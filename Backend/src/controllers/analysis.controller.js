import { sendResponse, sendError } from '../utils/response.js';

import {
  createAnalysis as createAnalysisService,
  getRepositoryAnalysis as getRepositoryAnalysisService,
  getRepositoryScore as getRepositoryScoreService,
  getAnalysisMetrics as getAnalysisMetricsService,
  getAnalysisHistory as getAnalysisHistoryService,
} from '../services/analysis.service.js';

export const getAnalysis = async (req, res) => {
  try {
    const { repositoryId } = req.params;

    const analysis = await getRepositoryAnalysisService(
      repositoryId,
      req.user.id
    );

    return sendResponse(res, 200, {
      analysis,
    });
  } catch (error) {
    console.error('Get analysis error:', error);

    if (error.message === 'Analysis not found') {
      return sendError(res, 404, error.message);
    }

    return sendError(res, 500, error.message);
  }
};
export const createAnalysis = async (req, res) => {
  try {
    const { repositoryId } = req.params;

    const result = await createAnalysisService(
      repositoryId,
      req.user.id
    );

    return sendResponse(res, 201, {
      message: 'Analysis created successfully',
      data: result,
    });
  } catch (error) {
    console.error('Create analysis error:', error);

    if (error.message === 'Repository not found') {
      return sendError(res, 404, error.message);
    }

    if (
      error.message ===
      'You do not have access to this repository'
    ) {
      return sendError(res, 403, error.message);
    }

    return sendError(res, 500, error.message);
  }
};

export const getRepositoryScore = async (req, res) => {
  try {
    const { repositoryId } = req.params;

    const score = await getRepositoryScoreService(
      repositoryId,
      req.user.id
    );

    return sendResponse(res, 200, {
      score,
    });
  } catch (error) {
    console.error('Get repository score error:', error);

    if (error.message === 'Analysis not found') {
      return sendError(res, 404, error.message);
    }

    return sendError(res, 500, error.message);
  }
};

export const getMetrics = async (req, res) => {
  try {
    const { repositoryId } = req.params;

    const metrics = await getAnalysisMetricsService(
      repositoryId,
      req.user.id
    );

    return sendResponse(res, 200, {
      metrics,
    });
  } catch (error) {
    console.error('Get analysis metrics error:', error);

    if (error.message === 'Analysis not found') {
      return sendError(res, 404, error.message);
    }

    return sendError(res, 500, error.message);
  }
};

export const updateAnalysis = async (req, res) => {
  try {
    sendResponse(res, 200, {
      message: 'Analysis update will be implemented later',
    });
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

export const getAnalysisHistory = async (req, res) => {
  try {
    const { repositoryId } = req.params;

    const history = await getAnalysisHistoryService(
      repositoryId,
      req.user.id
    );

    return sendResponse(res, 200, {
      history,
    });
  } catch (error) {
    console.error('Get analysis history error:', error);

    return sendError(res, 500, error.message);
  }
};