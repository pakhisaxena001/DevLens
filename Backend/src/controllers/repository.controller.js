import { sendResponse, sendError } from '../utils/response.js';

import {
  syncRepository as syncRepositoryService,
  getUserRepositories as getUserRepositoriesService,
  getRepositoryById as getRepositoryByIdService,
  getRepositoryDetails as getRepositoryDetailsService,
  getRepositoryAnalytics,
  getRepositoryTrends,
  compareRepositories,
} from '../services/repository.service.js';

export const getUserRepositories = async (req, res) => {
  try {
    const repositories = await getUserRepositoriesService(
      req.user.id
    );

    return sendResponse(res, 200, {
      repositories,
    });
  } catch (error) {
    console.error('Get repositories error:', error);

    return sendError(res, 500, error.message);
  }
};

export const getRepositoryById = async (req, res) => {
  try {
    const repository = await getRepositoryByIdService(
      req.params.id
    );

    return sendResponse(res, 200, {
      repository,
    });
  } catch (error) {
    console.error('Get repository error:', error);

    return sendError(res, 404, error.message);
  }
};


export const syncRepository = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return sendError(
        res,
        400,
        'GitHub repository URL is required'
      );
    }

    const result = await syncRepositoryService(
      url,
      req.user.id
    );

    return sendResponse(res, 200, {
      message: 'Repository synced successfully',
      data: result,
    });
  } catch (error) {
    console.error('Repository sync error:', error);

    return sendError(res, 500, error.message);
  }
};

export const updateRepository = async (req, res) => {
  try {
    sendResponse(res, 200, {
      message: 'Repository update will be implemented with PostgreSQL',
    });
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

export const deleteRepository = async (req, res) => {
  try {
    sendResponse(res, 200, {
      message: 'Repository deletion will be implemented with PostgreSQL',
    });
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

export const getRepositoryDetails = async (req, res) => {
  try {
    const details = await getRepositoryDetailsService(
      req.params.id
    );

    return sendResponse(res, 200, {
      details,
    });
  } catch (error) {
    console.error('Get repository details error:', error);

    return sendError(res, 404, error.message);
  }
};