import {
  getRepository,
  getRepositoryLanguages,
  getRepositoryCommits,
  getRepositoryIssues,
  getRepositoryPullRequests,
  getRepositoryContributors,
  getRepositoryBeginnerFriendlyData,
} from './github.service.js';

import { prisma } from '../config/prisma.js';
import { generateRepositorySummary } from './gemini.service.js';
/**
 * Calculate an overall health score from the individual scores.
 */
const calculateHealthScore = ({
  codeQuality,
  documentation,
  testCoverage,
  performance,
  security,
}) => {
  return Math.round(
    codeQuality * 0.25 +
    documentation * 0.20 +
    testCoverage * 0.20 +
    performance * 0.15 +
    security * 0.20
  );
};

/**
 * Calculate how beginner-friendly a repository is.
 *
 * This is a DevLens estimate based on repository signals.
 * It is not an official GitHub metric.
 */
const calculateBeginnerFriendlyScore = ({
  beginnerFriendly = {},
  documentation = 0,
}) => {
  let score = 0;

  // README
  const readmeScore = beginnerFriendly.hasReadme
    ? 25
    : 0;

  // Contribution guide
  const contributionScore =
    beginnerFriendly.hasContributingGuide
      ? 20
      : 0;

  // Documentation
  const documentationScore =
    Math.round((documentation / 100) * 20);

  // Good first issues
  const issueCount =
    beginnerFriendly.beginnerIssuesCount || 0;

  let beginnerIssueScore = 0;

  if (issueCount >= 10) {
    beginnerIssueScore = 20;
  } else if (issueCount >= 5) {
    beginnerIssueScore = 15;
  } else if (issueCount >= 2) {
    beginnerIssueScore = 10;
  } else if (issueCount === 1) {
    beginnerIssueScore = 5;
  }

  // Setup complexity.
  //
  // We currently don't have enough reliable GitHub
  // information to calculate setup complexity accurately.
  // Use a neutral baseline rather than inventing data.
  const setupScore = beginnerFriendly.setupScore ?? 15;

  score =
    readmeScore +
    contributionScore +
    documentationScore +
    beginnerIssueScore +
    setupScore;

  return Math.min(Math.max(score, 0), 100);
};

/**
 * Analyze repository code quality using available GitHub data.
 */
export const analyzeCodeQuality = async (repositoryData) => {
  const {
    commits = [],
    pullRequests = [],
    issues = [],
    contributors = [],
  } = repositoryData;

  let score = 50;
  const issuesFound = [];
  const improvements = [];

  // Contributor activity
  if (contributors.length >= 10) {
    score += 10;
  } else if (contributors.length === 0) {
    score -= 10;
    issuesFound.push('No contributors detected');
  }

  // Pull request activity
  if (pullRequests.length >= 10) {
    score += 10;
  } else if (pullRequests.length < 3) {
    score -= 5;
    issuesFound.push('Low pull request activity');
  }

  // Commit activity
  if (commits.length >= 20) {
    score += 10;
  } else if (commits.length < 5) {
    score -= 5;
    issuesFound.push('Low recent commit activity');
  }

  // Open issues
  if (issues.length > 20) {
    score -= 5;
    issuesFound.push('High number of open issues');
  }

  if (score < 0) score = 0;
  if (score > 100) score = 100;

  if (score < 70) {
    improvements.push(
      'Increase code review and pull request activity'
    );
  }

  if (score < 60) {
    improvements.push(
      'Improve repository maintenance and development activity'
    );
  }

  return {
    score,
    issues: issuesFound,
    improvements,
  };
};

/**
 * Analyze repository documentation.
 */
export const analyzeDocumentation = async (repositoryData) => {
  const {
    repository,
  } = repositoryData;

  let score = 50;
  const missingDocs = [];
  const suggestions = [];

  const description = repository?.description;

  if (description && description.trim().length > 20) {
    score += 20;
  } else {
    score -= 20;
    missingDocs.push('Repository description');
  }

  // GitHub repository metadata does not currently tell us
  // whether README content exists, so don't claim that it does.
  suggestions.push(
    'Maintain a clear and comprehensive README'
  );

  suggestions.push(
    'Document installation, usage, and contribution guidelines'
  );

  if (score < 0) score = 0;
  if (score > 100) score = 100;

  return {
    score,
    missingDocs,
    suggestions,
  };
};

/**
 * Analyze repository security using currently available
 * repository-level information.
 */
export const performSecurityAnalysis = async (repositoryData) => {
  const {
    repository,
  } = repositoryData;

  let score = 70;
  const vulnerabilities = [];
  const recommendations = [];

  if (repository?.private === false) {
    recommendations.push(
      'Review exposed configuration and secrets before committing code'
    );
  }

  recommendations.push(
    'Use dependency and secret scanning regularly'
  );

  recommendations.push(
    'Keep third-party dependencies updated'
  );

  return {
    score,
    vulnerabilities,
    recommendations,
  };
};

/**
 * Basic test coverage estimation.
 *
 * Important:
 * GitHub repository metadata does NOT provide actual test
 * coverage percentage. Therefore this is an estimated score,
 * not real coverage.
 */
const analyzeTestCoverage = (repositoryData) => {
  const {
    repository,
  } = repositoryData;

  let score = 50;

  if (repository?.language) {
    score += 10;
  }

  return Math.min(score, 100);
};

/**
 * Basic performance score.
 *
 * This is intentionally conservative because actual runtime
 * performance cannot be determined from the current GitHub
 * metadata alone.
 */
const analyzePerformance = (repositoryData) => {
  const {
    commits = [],
  } = repositoryData;

  let score = 60;

  if (commits.length >= 20) {
    score += 10;
  }

  return Math.min(score, 100);
};

/**
 * Perform complete deterministic repository analysis.
 */
export const performAnalysis = async (repository) => {
  if (!repository) {
    throw new Error('Repository is required');
  }

  const owner = repository.owner;
  const repo = repository.name;

  if (!owner || !repo) {
    throw new Error(
      'Repository owner and name are required'
    );
  }

  // Fetch current GitHub data.
  const [
    repositoryData,
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

  const githubData = {
    repository: repositoryData,
    languages,
    commits,
    issues,
    pullRequests,
    contributors,
    beginnerFriendly,
  };

  const codeQuality = await analyzeCodeQuality(
    githubData
  );

  const documentation = await analyzeDocumentation(
    githubData
  );

  const beginnerFriendlyScore =
    calculateBeginnerFriendlyScore({
      beginnerFriendly,
      documentation: documentation.score,
    });

  const security = await performSecurityAnalysis(
    githubData
  );

  const testCoverage =
    analyzeTestCoverage(githubData);

  const performance =
    analyzePerformance(githubData);

  const healthScore = calculateHealthScore({
    codeQuality: codeQuality.score,
    documentation: documentation.score,
    testCoverage,
    performance,
    security: security.score,
  });

  const recommendations = [
    ...codeQuality.improvements,
    ...documentation.suggestions,
    ...security.recommendations,
  ];

  const aiInput = {
    repository: {
      name: repositoryData?.name || '',
      owner:
        typeof repositoryData?.owner === 'object'
          ? repositoryData.owner.login
          : repositoryData?.owner || '',
      description: repositoryData?.description || '',
      language: repositoryData?.language || 'Unknown',
      stars:
        repositoryData?.stargazers_count ??
        repositoryData?.stars ??
        0,
      forks:
        repositoryData?.forks_count ??
        repositoryData?.forks ??
        0,
      openIssues:
        repositoryData?.open_issues_count ??
        repositoryData?.openIssues ??
        0,
    },

    metrics: {
      contributors: contributors.length,
      commits: commits.length,
      issues: issues.length,
      pullRequests: pullRequests.length,
    },

    scores: {
      health: healthScore,
      codeQuality: codeQuality.score,
      documentation: documentation.score,
      testCoverage,
      performance,
      security: security.score,
      beginnerFriendly: beginnerFriendlyScore,
    },

    recommendations: recommendations.slice(0, 3),
  }

  let aiSummary

  try {
    aiSummary = await generateRepositorySummary(aiInput)

    console.log('Gemini AI summary generated successfully')
  } catch (error) {
    console.error(
      'Gemini AI summary generation failed:',
      error?.message || error
    )

    aiSummary = {
      summary: `${aiInput.repository.name} is a ${aiInput.repository.language} repository with an overall health score of ${aiInput.scores.health}/100. The repository shows measurable strengths in code quality, performance, and security, while documentation, issue management, and beginner friendliness remain areas for improvement.`,

      strengths: [
        `Code quality score of ${aiInput.scores.codeQuality}/100`,
        `Performance score of ${aiInput.scores.performance}/100`,
        `Security score of ${aiInput.scores.security}/100`,
      ],

      weaknesses: [
        `Documentation score of ${aiInput.scores.documentation}/100`,
        `${aiInput.repository.openIssues} open issues require ongoing maintenance`,
        `Beginner friendliness score of ${aiInput.scores.beginnerFriendly}/100`,
      ],

      recommendations: [
        'Maintain a clear and comprehensive README',
        'Document installation, usage, and contribution guidelines',
        'Use dependency and security scanning regularly',
      ],
    }

    console.log('Using DevLens fallback AI summary')
  }

  return {
    healthScore,
    codeQuality: codeQuality.score,
    documentation: documentation.score,
    testCoverage,
    performance,
    security: security.score,
    beginnerFriendly: beginnerFriendlyScore,

    aiSummary,

    details: {
      codeQuality,
      documentation,
      security,
      beginnerFriendly,
      beginnerFriendlyScore,
      languages,
      commits,
      issues,
      pullRequests,
      contributors,
    },
    recommendations,
  };
};

/**
 * Generate a structured analysis report.
 */
export const generateAnalysisReport = async (analysis) => {
  if (!analysis) {
    throw new Error('Analysis data is required');
  }

  return {
    summary: {
      healthScore: analysis.healthScore,
      codeQuality: analysis.codeQuality,
      documentation: analysis.documentation,
      testCoverage: analysis.testCoverage,
      performance: analysis.performance,
      security: analysis.security,
    },

    details: analysis.details,

    recommendations:
      analysis.recommendations || [],
  };
};

export const createAnalysis = async (repositoryId, userId) => {
  if (!repositoryId) {
    throw new Error('Repository ID is required');
  }

  if (!userId) {
    throw new Error('User ID is required');
  }

  const repository = await prisma.repository.findUnique({
    where: {
      id: repositoryId,
    },
  });

  if (!repository) {
    throw new Error('Repository not found');
  }

  if (repository.userId !== userId) {
    throw new Error('You do not have access to this repository');
  }

  const analysisResult = await performAnalysis(repository);

  const analysis = await prisma.analysis.create({
    data: {
      repositoryId,
      userId,
      healthScore: analysisResult.healthScore,
      codeQualityScore: analysisResult.codeQuality,
      documentationScore: analysisResult.documentation,
      testCoverage: analysisResult.testCoverage,
      performanceScore: analysisResult.performance,
      securityScore: analysisResult.security,
      beginnerFriendlyScore: analysisResult.beginnerFriendly,
      recommendations: analysisResult.recommendations,
      aiSummary: analysisResult.aiSummary
        ? JSON.stringify(analysisResult.aiSummary)
        : null,
    },
  });
  await createAnalysisHistory(
    analysis,
    userId
  );

  return {
    analysis,
    details: analysisResult.details,
  };
};

export const getRepositoryAnalysis = async (
  repositoryId,
  userId
) => {
  if (!repositoryId) {
    throw new Error('Repository ID is required');
  }

  if (!userId) {
    throw new Error('User ID is required');
  }

  const analysis = await prisma.analysis.findFirst({
    where: {
      repositoryId,
      userId,
    },
    orderBy: {
      analysisDate: 'desc',
    },
    include: {
      repository: true,
    },
  });

  if (!analysis) {
    throw new Error('Analysis not found');
  }

  let aiSummary = null;

  if (analysis.aiSummary) {
    try {
      aiSummary = JSON.parse(analysis.aiSummary);
    } catch {
      aiSummary = {
        summary: analysis.aiSummary,
        strengths: [],
        weaknesses: [],
        recommendations: [],
      };
    }
  }

  return {
    ...analysis,
    aiSummary,
  };
};

export const getRepositoryScore = async (repositoryId, userId) => {
  if (!repositoryId) {
    throw new Error('Repository ID is required');
  }

  const analysis = await prisma.analysis.findFirst({
    where: {
      repositoryId,
      userId,
    },
    orderBy: {
      analysisDate: 'desc',
    },
  });

  if (!analysis) {
    throw new Error('Analysis not found');
  }

  return {
    healthScore: analysis.healthScore,
    codeQualityScore: analysis.codeQualityScore,
    documentationScore: analysis.documentationScore,
    testCoverage: analysis.testCoverage,
    performanceScore: analysis.performanceScore,
    securityScore: analysis.securityScore,
  };
};

export const getAnalysisMetrics = async (
  repositoryId,
  userId
) => {
  if (!repositoryId) {
    throw new Error('Repository ID is required');
  }

  const analysis = await prisma.analysis.findFirst({
    where: {
      repositoryId,
      userId,
    },
    orderBy: {
      analysisDate: 'desc',
    },
  });

  if (!analysis) {
    throw new Error('Analysis not found');
  }

  return {
    healthScore: analysis.healthScore,
    codeQualityScore: analysis.codeQualityScore,
    documentationScore: analysis.documentationScore,
    testCoverage: analysis.testCoverage,
    performanceScore: analysis.performanceScore,
    securityScore: analysis.securityScore,
    analysisDate: analysis.analysisDate,
  };
};

export const createAnalysisHistory = async (
  analysis,
  userId
) => {
  if (!analysis) {
    throw new Error('Analysis is required');
  }

  if (!userId) {
    throw new Error('User ID is required');
  }

  if (analysis.userId !== userId) {
    throw new Error(
      'You do not have access to this analysis'
    );
  }

  const history = await prisma.analysisHistory.create({
    data: {
      analysisId: analysis.id,
      repositoryId: analysis.repositoryId,
      userId,

      snapshotData: {
        healthScore: analysis.healthScore,
        codeQualityScore: analysis.codeQualityScore,
        documentationScore: analysis.documentationScore,
        testCoverage: analysis.testCoverage,
        performanceScore: analysis.performanceScore,
        securityScore: analysis.securityScore,
        beginnerFriendlyScore:analysis.beginnerFriendlyScore,
        aiSummary: analysis.aiSummary,
        recommendations:  analysis.recommendations,
      },

      healthScore: analysis.healthScore,
    },
  });

  return history;
};

export const getAnalysisHistory = async (repositoryId, userId) => {
  if (!repositoryId) {
    throw new Error('Repository ID is required');
  }

  if (!userId) {
    throw new Error('User ID is required');
  }

  const history = await prisma.analysisHistory.findMany({
    where: {
      repositoryId,
      userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return history;
};