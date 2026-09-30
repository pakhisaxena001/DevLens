import axios from 'axios';
import { config } from '../config/env.js';

const githubApi = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Authorization: `token ${config.githubToken}`,
  },
});

export const getRepository = async (owner, repo) => {
  try {
    const { data } = await githubApi.get(`/repos/${owner}/${repo}`);
    return data;
  } catch (error) {
    throw new Error(`Failed to fetch repository: ${error.message}`);
  }
};

export const getRepositoryLanguages = async (owner, repo) => {
  try {
    const { data } = await githubApi.get(`/repos/${owner}/${repo}/languages`);
    return data;
  } catch (error) {
    throw new Error(`Failed to fetch languages: ${error.message}`);
  }
};

export const getUserRepositories = async (username) => {
  try {
    const { data } = await githubApi.get(`/users/${username}/repos?per_page=100`);
    return data;
  } catch (error) {
    throw new Error(`Failed to fetch user repositories: ${error.message}`);
  }
};

export const getRepositoryCommits = async (owner, repo, perPage = 30) => {
  try {
    const { data } = await githubApi.get(
      `/repos/${owner}/${repo}/commits?per_page=${perPage}`
    );
    return data;
  } catch (error) {
    throw new Error(`Failed to fetch commits: ${error.message}`);
  }
};

export const getRepositoryIssues = async (owner, repo) => {
  try {
    const { data } = await githubApi.get(`/repos/${owner}/${repo}/issues`);
    return data;
  } catch (error) {
    throw new Error(`Failed to fetch issues: ${error.message}`);
  }
};

export const getRepositoryPullRequests = async (owner, repo) => {
  try {
    const { data } = await githubApi.get(`/repos/${owner}/${repo}/pulls`);
    return data;
  } catch (error) {
    throw new Error(`Failed to fetch pull requests: ${error.message}`);
  }
};

export const getRepositoryContributors = async (owner, repo) => {
  try {
    const { data } = await githubApi.get(
      `/repos/${owner}/${repo}/contributors?per_page=100`
    );

    return data;
  } catch (error) {
    throw new Error(
      `Failed to fetch contributors: ${error.message}`
    );
  }
};

export const getRepositoryFile = async (owner, repo, path) => {
  try {
    const { data } = await githubApi.get(
      `/repos/${owner}/${repo}/contents/${path}`
    )

    return data
  } catch (error) {
    if (error.response?.status === 404) {
      return null
    }

    throw new Error(
      `Failed to fetch repository file ${path}: ${error.message}`
    )
  }
}

export const getRepositoryBeginnerIssues = async (owner, repo) => {
  try {
    const { data } = await githubApi.get(
      `/repos/${owner}/${repo}/issues?labels=good%20first%20issue&state=open&per_page=100`
    )

    return data
  } catch (error) {
    throw new Error(
      `Failed to fetch beginner-friendly issues: ${error.message}`
    )
  }
}

export const getRepositoryBeginnerFriendlyData = async (owner, repo) => {
  const [
    readme,
    contributing,
    beginnerIssues,
  ] = await Promise.all([
    getRepositoryFile(owner, repo, 'README.md'),
    getRepositoryFile(owner, repo, 'CONTRIBUTING.md'),
    getRepositoryBeginnerIssues(owner, repo),
  ])

  return {
    hasReadme: Boolean(readme),
    hasContributingGuide: Boolean(contributing),
    beginnerIssuesCount: Array.isArray(beginnerIssues)
      ? beginnerIssues.length
      : 0,
  }
}