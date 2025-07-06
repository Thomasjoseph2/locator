import User from '../models/user.js';
import logger from '../config/logger.js';
import jwt from 'jsonwebtoken';

const generateTokens = (user) => {
    const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '60m' });
    
    const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
};

class AuthController {
    async signup(req, res) {
        try {
            const { name, email, password } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(409).json({ message: 'User with this email already exists.' });
            }

            const user = new User({ name, email, password });
            await user.save();
            res.status(201).json({ message: 'User created successfully',user: { id: user._id, name: user.name, email: user.email } });
        } catch (error) {
            logger.error('Error during signup:', error);
            res.status(500).json({ message: 'Server Error' });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (!user || !await user.comparePassword(password)) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            const { accessToken, refreshToken } = generateTokens(user);
            user.refreshToken = refreshToken;
            await user.save();
            res.status(200).json({ accessToken, refreshToken ,user: { id: user._id, name: user.name, email: user.email } });
        } catch (error) {
            logger.error('Error during login:', error);
            res.status(500).json({ message: 'Server Error' });
        }
    }

    async refreshToken(req, res) {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh token not provided' });
        }

        try {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            const user = await User.findById(decoded.id);

            if (!user || user.refreshToken !== refreshToken) {
                return res.status(403).json({ message: 'Invalid refresh token' });
            }

            const { accessToken } = generateTokens(user);
            res.status(200).json({ accessToken });
        } catch (error) {
            logger.error('Error during token refresh:', error);
            res.status(403).json({ message: 'Invalid refresh token' });
        }
    }
}

export default new AuthController();