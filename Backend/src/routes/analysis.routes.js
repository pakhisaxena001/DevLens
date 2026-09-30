import express from 'express';

import * as analysisController from '../controllers/analysis.controller.js';

import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();



// Create a new repository analysis
router.post(
  '/:repositoryId',
  authenticate,
  analysisController.createAnalysis
);



// Get repository health score
router.get(
  '/:repositoryId/score',
  authenticate,
  analysisController.getRepositoryScore
);

// Get analysis metrics
router.get(
  '/:repositoryId/metrics',
  authenticate,
  analysisController.getMetrics
);

router.get(
  '/:repositoryId/history',
  authenticate,
  analysisController.getAnalysisHistory
);

// Get latest analysis for a repository
router.get(
  '/:repositoryId',
  authenticate,
  analysisController.getAnalysis
);

// Update an analysis
router.put(
  '/:analysisId',
  authenticate,
  analysisController.updateAnalysis
);

export default router;