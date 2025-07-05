import admin from 'firebase-admin';
import User from '../models/user.js';
import Location from '../models/Location.js'; // Import Location model

// Haversine formula to calculate distance between two lat/lon points
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c; // in metres
    return d; // distance in meters
}

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
            console.error('Error sending common notification:', error);
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
            console.log(`Successfully sent location notification to topic ${topic}.`);
        } catch (error) {
            console.error(`Error sending location notification to topic ${topic}:`, error);
            throw error; // Re-throw to be caught by the calling function
        }
    }

    // New method to process location updates and trigger geofencing notifications
    async processLocationUpdate(req, res) {
        try {
            const { currentLatitude, currentLongitude } = req.body;
            const userId = req.user.id; // Assuming authMiddleware adds user.id to req

            // Find all locations saved by this user
            const savedLocations = await Location.find({ userId });

            for (const loc of savedLocations) {
                const distance = getDistance(currentLatitude, currentLongitude, loc.latitude, loc.longitude);
                console.log(`Distance to ${loc.name}: ${distance} meters (Radius: ${loc.radius} meters)`);

                // Check if user is within the radius and hasn't been notified recently
                const now = new Date();
                const oneHourAgo = new Date(now.getTime() - (60 * 60 * 1000)); // 1 hour cooldown

                if (distance <= loc.radius && (!loc.lastNotified || loc.lastNotified < oneHourAgo)) {
                    const topic = `location_${loc._id.toString()}`;
                    const title = 'Location Alert!';
                    const body = `You are near ${loc.name}! Distance: ${distance.toFixed(2)} meters.`;
                    const data = {
                        locationId: loc._id.toString(),
                        locationName: loc.name,
                        distance: distance.toFixed(2),
                    };

                    try {
                        await this.sendLocationNotification(topic, title, body, data);
                        loc.lastNotified = now; // Update last notified time
                        await loc.save();
                    } catch (error) {
                        console.error(`Failed to send notification for ${loc.name}:`, error);
                    }
                }
            }


            res.status(200).json({ message: 'Location update processed.' });
        } catch (error) {
            console.error('Error in processLocationUpdate:', error);
            res.status(500).json({ message: error.message });
        }
    }
}

export default new NotificationController();
