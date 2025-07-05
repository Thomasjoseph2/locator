import User from '../models/user.js';
import logger from '../config/logger.js';

class ProfileController {
    async getProfile(req, res) {
        try {
            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json({ id: user._id, name: user.name, email: user.email });
        } catch (error) {
            logger.error('Error getting user profile:', error);
            res.status(500).json({ message: error.message });
        }
    }

    async updateLastKnownLocation(req, res) {
        try {
            const { latitude, longitude } = req.body;
            if (typeof latitude === 'undefined' || typeof longitude === 'undefined') {
                return res.status(400).json({ message: 'Latitude and longitude are required.' });
            }

            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }

            user.lastKnownLocation = {
                type: 'Point',
                coordinates: [parseFloat(longitude), parseFloat(latitude)],
            };
            await user.save();

            res.status(200).json({ message: 'Last known location updated successfully.' });
        } catch (error) {
            logger.error('Error updating last known location:', error);
            res.status(500).json({ message: 'Server Error' });
        }
    }
}

export default new ProfileController();