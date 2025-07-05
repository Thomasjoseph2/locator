import express from 'express';
const router = express.Router();
import authController from '../controllers/authController.js';

// Route for user signup
router.post('/signup', authController.signup);

// Route for user login
router.post('/login', authController.login);

// Route for refreshing the access token
router.post('/refresh', authController.refreshToken);

export default router;