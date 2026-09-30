import express from 'express';
import * as aiController from '../controllers/ai.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/analyze', authenticate, aiController.analyzeRepository);
router.post('/suggest', authenticate, aiController.getSuggestions);
router.post('/chat', authenticate, aiController.chat);
router.get('/insights/:repositoryId', authenticate, aiController.getInsights);

export default router;
