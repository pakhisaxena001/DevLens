import express from 'express';

import * as repositoryController from '../controllers/repository.controller.js';

import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get(
  '/',
  authenticate,
  repositoryController.getUserRepositories
);

router.get(
  '/:id/details',
  authenticate,
  repositoryController.getRepositoryDetails
);

router.get(
  '/:id',
  repositoryController.getRepositoryById
);

router.post(
  '/sync',
  authenticate,
  repositoryController.syncRepository
);

router.put(
  '/:id',
  authenticate,
  repositoryController.updateRepository
);

router.delete(
  '/:id',
  authenticate,
  repositoryController.deleteRepository
);

export default router;