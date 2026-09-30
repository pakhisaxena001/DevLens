import {
  getRepository,
  getRepositoryLanguages,
  getRepositoryCommits,
  getRepositoryIssues,
  getRepositoryPullRequests,
  getRepositoryContributors,
  getRepositoryBeginnerFriendlyData,
} from './github.service.js';

import { parseGitHubUrl } from '../utils/githubParser.js';

import { prisma } from '../config/prisma.js';

export const searchRepositories = async (query, filters = {}) => {
  // GitHub repository search will be implemented later.
  return [];
};

export const getRepositoryAnalytics = async (repositoryId) => {
  if (!repositoryId) {
    throw new Error('Repository ID is required');
  }

  return {
    commits: [],
    contributors: [],
    languages: {},
    trends: {},
  };
};

export const compareRepositories = async (repositoryIds) => {
  if (!Array.isArray(repositoryIds) || repositoryIds.length < 2) {
    throw new Error('At least two repository IDs are required');
  }

  return {
    comparison: {},
  };
};

export const getRepositoryTrends = async (
  repositoryId,
  period = '30d'
) => {
  if (!repositoryId) {
    throw new Error('Repository ID is required');
  }

  return {
    trends: {},
    period,
  };
};

export const getUserRepositories = async (userId) => {
  if (!userId) {
    throw new Error('User ID is required');
  }

  const repositories = await prisma.repository.findMany({
    where: {
      userId,
    },
    include: {
      metrics: true,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  return repositories;
};

export const getRepositoryById = async (repositoryId) => {
  if (!repositoryId) {
    throw new Error('Repository ID is required');
  }

  const repository = await prisma.repository.findUnique({
    where: {
      id: repositoryId,
    },
    include: {
      metrics: true,
    },
  });

  if (!repository) {
    throw new Error('Repository not found');
  }

  return repository;
};

export const getRepositoryDetails = async (repositoryId) => {
  if (!repositoryId) {
    throw new Error('Repository ID is required');
  }

  // Get stored repository from PostgreSQL
  const repository = await prisma.repository.findUnique({
    where: {
      id: repositoryId,
    },
    include: {
      metrics: true,
    },
  });

  if (!repository) {
    throw new Error('Repository not found');
  }

  // Get fresh GitHub data
  const githubData = await fetchGitHubRepositoryData(
    repository.url
  );

  return {
    repository,
    metrics: repository.metrics,
    languages: githubData.languages,
    commits: githubData.commits,
    issues: githubData.issues,
    pullRequests: githubData.pullRequests,
    contributors: githubData.contributors,
    beginnerFriendly: githubData.beginnerFriendly,
  };
};

export const extractMetrics = async (repositoryData) => {
  if (!repositoryData) {
    throw new Error('Repository data is required');
  }

  return {
    codeQuality: 0,
    documentation: 0,
    testCoverage: 0,
    performance: 0,
    security: 0,
  };
};

/**
 * Fetch complete repository data directly from GitHub.
 */
export const fetchGitHubRepositoryData = async (githubUrl) => {
  const { owner, repo } = parseGitHubUrl(githubUrl);

  const [
    repository,
    languages,
    commits,
    issues,
    pullRequests,
    contributors,
    beginnerFriendly,
  ] = await Promise.all([
    getRepository(owner, repo),
    getRepositoryLanguages(owner, repo),
    getRepositoryCommits(owner, repo, 30),
    getRepositoryIssues(owner, repo),
    getRepositoryPullRequests(owner, repo),
    getRepositoryContributors(owner, repo),
    getRepositoryBeginnerFriendlyData(owner, repo),
  ]);

  return {
    owner,
    repo,
    repository,
    languages,
    commits,
    issues,
    pullRequests,
    contributors,
    beginnerFriendly,
  };
};
/**
 * Fetch repository data from GitHub
 * and save/update the repository in PostgreSQL.
 */
export const syncRepository = async (githubUrl, userId) => {
  if (!githubUrl) {
    throw new Error('GitHub repository URL is required');
  }

  if (!userId) {
    throw new Error('Authenticated user is required');
  }

  const githubData = await fetchGitHubRepositoryData(githubUrl);

  const {
    repository,
    languages,
    commits,
    issues,
    pullRequests,
    contributors,
  } = githubData;

  const savedRepository = await prisma.repository.upsert({
    where: {
      githubId: BigInt(repository.id),
    },

    update: {
      userId,
      owner: repository.owner.login,
      name: repository.name,
      url: repository.html_url,
      description: repository.description,
      language: repository.language,
      stars: repository.stargazers_count,
      forks: repository.forks_count,
      watchers: repository.watchers_count,
      openIssues: repository.open_issues_count,
    },

    create: {
      githubId: BigInt(repository.id),
      userId,
      owner: repository.owner.login,
      name: repository.name,
      url: repository.html_url,
      description: repository.description,
      language: repository.language,
      stars: repository.stargazers_count,
      forks: repository.forks_count,
      watchers: repository.watchers_count,
      openIssues: repository.open_issues_count,
    },
  });

  const lastCommitDate = commits
    .map((commit) => commit.commit?.author?.date)
    .filter(Boolean)
    .sort()
    .pop();

  const metrics = await prisma.repositoryMetrics.upsert({
    where: {
      repositoryId: savedRepository.id,
    },

    update: {
      contributors: contributors.length,
      commits: commits.length,
      issues: issues.length,
      pullRequests: pullRequests.length,
      lastCommitDate: lastCommitDate
        ? new Date(lastCommitDate)
        : null,
    },

    create: {
      repositoryId: savedRepository.id,
      contributors: contributors.length,
      commits: commits.length,
      issues: issues.length,
      pullRequests: pullRequests.length,
      lastCommitDate: lastCommitDate
        ? new Date(lastCommitDate)
        : null,
    },
  });

  return {
    repository: {
    ...savedRepository,
    githubId: savedRepository.githubId?.toString() ?? null,
    },
    metrics,
    languages,
  };
};