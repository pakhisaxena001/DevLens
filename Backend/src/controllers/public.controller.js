import { sendResponse, sendError } from '../utils/response.js';

export const getPublicRepositories = async (req, res, next) => {
  try {
    sendResponse(res, 200, { repositories: [] });
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

export const getPublicRepositoryDetails = async (req, res, next) => {
  try {
    sendResponse(res, 200, { repository: {} });
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

export const getTrendingRepositories = async (req, res, next) => {
  try {
    sendResponse(res, 200, { trending: [] });
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

export const searchRepositories = async (req, res, next) => {
  try {
    sendResponse(res, 200, { results: [] });
  } catch (error) {
    sendError(res, 500, error.message);
  }
};
