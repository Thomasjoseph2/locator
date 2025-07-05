import express from 'express';
const router = express.Router();
import authMiddleware from '../middleware/authMiddleware.js';

import {
  getAllLocations,
  createLocation,
  deleteLocation,
  updateLocation,
} from '../controllers/locationController.js';
// Protect all routes with authMiddleware
router.use(authMiddleware);

router.route('/').get(getAllLocations).post(createLocation);
router.route('/:id').delete(deleteLocation).put(updateLocation);

export default router;