import express from 'express';
import * as publicController from '../controllers/public.controller.js';

const router = express.Router();

router.get('/repositories', publicController.getPublicRepositories);
router.get('/repository/:id', publicController.getPublicRepositoryDetails);
router.get('/trending', publicController.getTrendingRepositories);
router.get('/search', publicController.searchRepositories);

export default router;
