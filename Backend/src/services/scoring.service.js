export const calculateRepositoryScore = (metrics) => {
  const weights = {
    stars: 0.2,
    forks: 0.15,
    watchers: 0.1,
    openIssues: -0.15,
    pullRequests: 0.15,
    commits: 0.15,
    contributors: 0.1,
    documentation: 0.1,
  };

  let score = 50;
  for (const [key, weight] of Object.entries(weights)) {
    if (metrics[key]) {
      const value = Math.min(metrics[key] / 100, 1);
      score += value * weight * 50;
    }
  }

  return Math.min(Math.round(score), 100);
};

export const calculateCodeQualityScore = (analysis) => {
  const weights = {
    testCoverage: 0.3,
    documentation: 0.25,
    codeStyle: 0.2,
    performance: 0.15,
    security: 0.1,
  };

  let score = 0;
  for (const [key, weight] of Object.entries(weights)) {
    if (analysis[key]) {
      score += analysis[key] * weight;
    }
  }

  return Math.round(score);
};

export const getScoreRating = (score) => {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Very Good';
  if (score >= 70) return 'Good';
  if (score >= 60) return 'Fair';
  return 'Needs Improvement';
};
