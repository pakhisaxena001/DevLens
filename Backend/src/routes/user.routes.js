import express from 'express';

import * as userController from '../controllers/user.controller.js';

import { authenticate } from '../middleware/auth.middleware.js';
import { validateUser } from '../validators/auth.validator.js';

const router = express.Router();

router.get('/profile', authenticate, userController.getProfile);

router.put(
  '/profile',
  authenticate,
  validateUser.update,
  userController.updateProfile
);

router.get('/:id', userController.getUserById);

router.delete('/account', authenticate, userController.deleteAccount);

export default router;