import dotenv from 'dotenv';
dotenv.config();
import admin from 'firebase-admin';
import serviceAccount from './config/firebaseServiceAccountKey.json' with { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import locationRoutes from './routes/locations.js';
import notificationRoutes from './routes/notifications.js';

const app = express();

app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/user', profileRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/notifications', notificationRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});