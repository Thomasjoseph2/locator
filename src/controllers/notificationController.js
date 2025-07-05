import admin from 'firebase-admin';
import User from '../models/user.js';
import Location from '../models/Location.js'; // Import Location model
import logger from '../config/logger.js';

class NotificationController {
    // Method to send a general notification to a topic
    async sendCommonNotification(req, res) {
        try {
            const { title, body, topic  } = req.body;

            const message = {
                notification: {
                    title: title || 'Default Title',
                    body: body || 'Default Body',
                },
                topic: topic,
            };

            await admin.messaging().send(message);
            res.status(200).json({ message: `Common notification sent successfully to topic ${topic}.` });

        } catch (error) {
            logger.error('Error sending common notification:', error);
            res.status(500).json({ message: error.message });
        }
    }

    // Method to send a location-specific notification
    async sendLocationNotification(topic, title, body, data) {
        const message = {
            notification: {
                title: title,
                body: body,
            },
            topic: topic,
            data: data, // Custom data payload
        };

        try {
            await admin.messaging().send(message);
            logger.info(`Successfully sent location notification to topic ${topic}.`);
        } catch (error) {
            logger.error(`Error sending location notification to topic ${topic}:`, error);
            throw error; // Re-throw to be caught by the calling function
        }
    }

    // New method to process location updates and trigger geofencing notifications
    async processLocationUpdate(req, res) {
        try {
            const { latitude, longitude } = req.body; // Use latitude, longitude from body
            const userId = req.user.id; // Assuming authMiddleware adds user.id to req

            if (!latitude || !longitude) {
                return res.status(400).json({ message: 'Latitude and longitude are required in the request body.' });
            }

            const userLocation = {
                type: 'Point',
                coordinates: [parseFloat(longitude), parseFloat(latitude)],
            };

            // Use the geospatial query to find nearby locations for this user
            const nearbyLocations = await Location.aggregate([
                {
                    $geoNear: {
                        near: userLocation,
                        distanceField: 'distance', // Distance in meters
                        spherical: true,
                        maxDistance: 6000, // Only consider locations within 6km (6000 meters) of user
                        query: { user: userId }, // Filter by current user
                    },
                },
                {
                    $match: {
                        $expr: { $lte: ['$distance', { $add: ['$radius', 500] }] }, // Filter where distance <= custom radius + 500m buffer
                    },
                },
            ]);

            for (const loc of nearbyLocations) {
                const now = new Date();
                // Cooldown period: 1 hour (adjust as needed)
                const cooldownPeriod = 60 * 60 * 1000; 

                if (!loc.lastNotified || (now.getTime() - loc.lastNotified.getTime() > cooldownPeriod)) {
                    const topic = userId; // Use user ID as the topic
                    const title = 'Location Alert!';
                    const body = `You are near ${loc.title}! Distance: ${loc.distance.toFixed(2)} meters.`;
                    const data = {
                        locationId: loc._id.toString(),
                        locationTitle: loc.title,
                        distance: loc.distance.toFixed(2),
                    };

                    try {
                        await this.sendLocationNotification(topic, title, body, data);
                        // Update lastNotified timestamp on the original Location document
                        await Location.findByIdAndUpdate(loc._id, { lastNotified: now });
                    } catch (error) {
                        console.error(`Failed to send notification for ${loc.title}:`, error);
                    }
                }
            }

            res.status(200).json({ message: 'Location update processed.' });
        } catch (error) {
            logger.error('Error in processLocationUpdate:', error);
            res.status(500).json({ message: error.message });
        }
    }

    // Method to send bulk ad notifications to users within a specific location and radius
    async sendAdNotificationsByLocation(req, res) {
        try {
            const { latitude, longitude, adRadius, title, body, data } = req.body;

            if (typeof latitude === 'undefined' || typeof longitude === 'undefined' || !adRadius || !title || !body) {
                return res.status(400).json({ message: 'Latitude, longitude, adRadius, title, and body are required.' });
            }

            const adCenter = {
                type: 'Point',
                coordinates: [parseFloat(longitude), parseFloat(latitude)],
            };

            // Find users whose lastKnownLocation is within the adRadius
            const usersInArea = await User.aggregate([
                {
                    $geoNear: {
                        near: adCenter,
                        distanceField: 'distance', // Distance in meters
                        spherical: true,
                        maxDistance: adRadius, // Ad campaign radius
                        // No query here, as we want all users in the area
                    },
                },
                {
                    $project: { _id: 1 }, // Only project the user ID
                },
            ]);

            if (usersInArea.length === 0) {
                return res.status(200).json({ message: 'No users found in the specified area.' });
            }

            const notificationPromises = usersInArea.map(user => {
                const topic = user._id.toString(); // User ID is the topic
                return this.sendLocationNotification(topic, title, body, data);
            });

            await Promise.allSettled(notificationPromises);

            res.status(200).json({ message: `Ad notifications sent to ${usersInArea.length} users.` });

        } catch (error) {
            logger.error('Error sending ad notifications by location:', error);
            res.status(500).json({ message: error.message });
        }
    }
}

export default new NotificationController();

