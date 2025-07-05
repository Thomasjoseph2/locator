import User from '../models/user.js';
import jwt from 'jsonwebtoken';

const generateTokens = (user) => {
    const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
};

class AuthController {
    async signup(req, res) {
        try {
            const { name, email, password } = req.body;
            const user = new User({ name, email, password });
            await user.save();
            res.status(201).json({ message: 'User created successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
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
            res.status(200).json({ accessToken, refreshToken });
        } catch (error) {
            res.status(500).json({ message: error.message });
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
            res.status(403).json({ message: 'Invalid refresh token' });
        }
    }
}

export default new AuthController();