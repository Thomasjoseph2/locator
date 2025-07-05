import User from '../models/user.js';

class ProfileController {
    async getProfile(req, res) {
        try {
            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json({ id: user._id, name: user.name, email: user.email });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default new ProfileController();