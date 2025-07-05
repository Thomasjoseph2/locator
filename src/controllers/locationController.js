
import Location from '../models/Location.js';
import logger from '../config/logger.js';

// @desc    Get all locations for a user
// @route   GET /api/locations
// @access  Private
export const getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find({ user: req.user.id });
    res.json(locations);
  } catch (err) {
    logger.error(`Error in getAllLocations: ${err.message}`);
    res.status(500).send('Server Error');
  }
};

// @desc    Create a location
// @route   POST /api/locations
// @access  Private
export const createLocation = async (req, res) => {
  const { title, latitude, longitude, reelUrl, imageUrl, notes, radius } = req.body;

  try {
    const locationPoint = {
      type: 'Point',
      coordinates: [longitude, latitude], // GeoJSON stores as [longitude, latitude]
    };

    let existingLocation = await Location.findOne({
      user: req.user.id,
      'location.coordinates': locationPoint.coordinates,
    });

    if (existingLocation) {
      return res.status(400).json({ msg: 'Location already exists' });
    }
    const newLocation = new Location({
      user: req.user.id,
      title,
      location: locationPoint,
      reelUrl,
      imageUrl,
      notes,
      radius,
    });

    const location = await newLocation.save();
    res.json(location);
  } catch (err) {
    logger.error(`Error in createLocation: ${err.message}`);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a location
// @route   DELETE /api/locations/:id
// @access  Private
export const deleteLocation = async (req, res) => {
  try {
    let location = await Location.findById(req.params.id);

    if (!location) return res.status(404).json({ msg: 'Location not found' });

    // Make sure user owns the location
    if (location.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Location.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Location removed' });
  } catch (err) {
    logger.error(`Error in deleteLocation: ${err.message}`);
    res.status(500).send('Server Error');
  }
};

// @desc    Update a location
// @route   PUT /api/locations/:id
// @access  Private
export const updateLocation = async (req, res) => {
  const { title, notes, latitude, longitude, radius } = req.body;

  // Build location object
  const locationFields = {};
  if (title) locationFields.title = title;
  if (notes) locationFields.notes = notes;
  if (radius) locationFields.radius = radius;

  if (latitude && longitude) {
    locationFields.location = {
      type: 'Point',
      coordinates: [longitude, latitude],
    };
  }

  try {
    let location = await Location.findById(req.params.id);

    if (!location) return res.status(404).json({ msg: 'Location not found' });

    // Make sure user owns the location
    if (location.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    location = await Location.findByIdAndUpdate(
      req.params.id,
      { $set: locationFields },
      { new: true }
    );

    res.json(location);
  } catch (err) {
    logger.error(`Error in updateLocation: ${err.message}`);
    res.status(500).send('Server Error');
  }
};

// @desc    Get nearby locations for a user
// @route   GET /api/locations/nearby
// @access  Private
export const getNearbyLocations = async (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ msg: 'Latitude and longitude are required query parameters.' });
  }

  try {
    const userLocation = {
      type: 'Point',
      coordinates: [parseFloat(longitude), parseFloat(latitude)],
    };

    const nearbyLocations = await Location.aggregate([
      {
        $geoNear: {
          near: userLocation,
          distanceField: 'distance', // Distance in meters
          spherical: true,
          query: { user: req.user.id }, // Filter by current user
        },
      },
      {
        $match: {
          $expr: { $lte: ['$distance', '$radius'] }, // Filter where distance <= custom radius
        },
      },
    ]);

    res.json(nearbyLocations);
  } catch (err) {
    logger.error(`Error in getNearbyLocations: ${err.message}`);
    res.status(500).send('Server Error');
  }
};
