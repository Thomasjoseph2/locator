import dotenv from 'dotenv';
dotenv.config();
import admin from 'firebase-admin';
if (!process.env.FIREBASE_API_KEY) {
  console.error('FIREBASE_API_KEY environment variable is not set.');
  process.exit(1);
}

try {
  const serviceAccount = JSON.parse(process.env.FIREBASE_API_KEY);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log('Firebase Admin SDK initialized successfully.');
} catch (error) {
  console.error('Error parsing Firebase service account key:', error);
  process.exit(1);
}
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