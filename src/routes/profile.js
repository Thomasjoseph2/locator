import express from 'express';
const router = express.Router();
import authMiddleware from '../middleware/authMiddleware.js';
import profileController from '../controllers/profileController.js';

// Route to access user profile, protected by authentication middleware
router.get('/profile', authMiddleware, profileController.getProfile);
router.post('/profile/update-location', authMiddleware, profileController.updateLastKnownLocation);

export default router;