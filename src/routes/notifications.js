import express from 'express';
const router = express.Router();
import notificationController from '../controllers/notificationController.js';
import authMiddleware from '../middleware/authMiddleware.js';

// Route to send a common notification (e.g., to all users or a specific topic)
// This route might be protected or only accessible by admins, depending on your needs.
// For testing, we'll protect it with authMiddleware for now.
router.post('/send-common', notificationController.sendCommonNotification);
router.post('/process-location', authMiddleware, notificationController.processLocationUpdate);
router.post('/send-ad-by-location', (req, res) => notificationController.sendAdNotificationsByLocation(req, res));

export default router;
