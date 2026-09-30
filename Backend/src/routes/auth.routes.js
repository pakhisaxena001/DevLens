import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import { validateAuth } from '../validators/auth.validator.js';

const router = express.Router();

router.post('/register', validateAuth.register, authController.register);
router.post('/login', validateAuth.login, authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

export default router;
