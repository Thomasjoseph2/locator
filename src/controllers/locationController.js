
import Location from '../models/Location.js';

// @desc    Get all locations for a user
// @route   GET /api/locations
// @access  Private
export const getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find({ user: req.user.id });
    res.json(locations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Create a location
// @route   POST /api/locations
// @access  Private
export const createLocation = async (req, res) => {
  const { title, latitude, longitude, reelUrl, imageUrl, notes, radius } = req.body;

  try {
    let existingLocation = await Location.findOne({
      user: req.user.id,
      latitude,
      longitude,
    });

    if (existingLocation) {
      return res.status(400).json({ msg: 'Location already exists' });
    }
    const newLocation = new Location({
      user: req.user.id,
      title,
      latitude,
      longitude,
      reelUrl,
      imageUrl,
      notes,
      radius,
    });

    const location = await newLocation.save();
    res.json(location);
  } catch (err) {
    console.error(err.message);
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
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update a location
// @route   PUT /api/locations/:id
// @access  Private
export const updateLocation = async (req, res) => {
  const { title, notes } = req.body;

  // Build location object
  const locationFields = {};
  if (title) locationFields.title = title;
  if (notes) locationFields.notes = notes;

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
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
