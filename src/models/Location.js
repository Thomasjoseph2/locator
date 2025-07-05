
import mongoose from 'mongoose';

const LocationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  reelUrl: {
    type: String,
    trim: true,
  },
  imageUrl: {
    type: String,
    trim: true,
  },
  notes: {
    type: String,
    trim: true,
  },
  radius: {
    type: Number,
    required: true,
    default: 100, // Default radius in meters
  },
  lastNotified: {
    type: Date,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Location', LocationSchema);
