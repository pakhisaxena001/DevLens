export const parseGitHubUrl = (url) => {
  try {
    const parsedUrl = new URL(url.trim());

    if (parsedUrl.hostname !== 'github.com') {
      throw new Error('URL must be a GitHub URL');
    }

    const parts = parsedUrl.pathname
      .split('/')
      .filter(Boolean);

    if (parts.length < 2) {
      throw new Error('Invalid GitHub repository URL');
    }

    const owner = parts[0];
    const repo = parts[1].replace(/\.git$/, '');

    return {
      owner,
      repo,
    };
  } catch (error) {
    throw new Error('Invalid GitHub repository URL');
  }
};

export const extractLanguage = (fileName) => {
  const ext = fileName.split('.').pop().toLowerCase();

  const languageMap = {
    js: 'JavaScript',
    jsx: 'JavaScript',
    ts: 'TypeScript',
    tsx: 'TypeScript',
    py: 'Python',
    java: 'Java',
    cpp: 'C++',
    c: 'C',
    rb: 'Ruby',
    go: 'Go',
    rs: 'Rust',
    php: 'PHP',
  };

  return languageMap[ext] || ext;
};

export const calculateCodeQuality = (metrics) => {
  const weights = {
    testCoverage: 0.3,
    documentation: 0.2,
    codeStyle: 0.2,
    performance: 0.15,
    security: 0.15,
  };

  let score = 0;

  for (const [key, weight] of Object.entries(weights)) {
    if (typeof metrics[key] === 'number') {
      score += metrics[key] * weight;
    }
  }

  return score;
};