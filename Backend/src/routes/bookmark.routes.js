import express from 'express';
import * as bookmarkController from '../controllers/bookmark.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', authenticate, bookmarkController.getUserBookmarks);
router.post('/', authenticate, bookmarkController.createBookmark);
router.delete('/:id', authenticate, bookmarkController.deleteBookmark);
router.get('/:id', authenticate, bookmarkController.getBookmarkById);

export default router;
