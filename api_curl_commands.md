# KeepLocation API cURL Commands

This document provides `curl` commands for testing the KeepLocation backend API endpoints.
Replace placeholders like `YOUR_ACCESS_TOKEN`, `YOUR_REFRESH_TOKEN`, `LOCATION_ID`, `USER_ID`, `AD_LATITUDE`, `AD_LONGITUDE`, `AD_RADIUS`, etc., with actual values.

## Authentication Endpoints

### 1. User Signup
Registers a new user.

```bash
curl -X POST http://localhost:3000/auth/signup \
-H "Content-Type: application/json" \
-d '{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}'
```

### 2. User Login
Authenticates a user and returns access and refresh tokens.

```bash
curl -X POST http://localhost:3000/auth/login \
-H "Content-Type: application/json" \
-d '{
  "email": "test@example.com",
  "password": "password123"
}'
```
*   **Note:** Copy the `accessToken` and `refreshToken` from the response.

### 3. Refresh Access Token
Generates a new access token using a valid refresh token.

```bash
curl -X POST http://localhost:3000/auth/refresh \
-H "Content-Type: application/json" \
-d '{
  "refreshToken": "YOUR_REFRESH_TOKEN"
}'
```
*   **Note:** Replace `YOUR_REFRESH_TOKEN` with the refresh token obtained from login.

## User Profile Endpoints

### 4. Get User Profile
Retrieves the profile of the authenticated user.

```bash
curl -X GET http://localhost:3000/user/profile \
-H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```
*   **Note:** Replace `YOUR_ACCESS_TOKEN` with a valid access token.

### 5. Update User's Last Known Location
Updates the authenticated user's last known geographical coordinates.

```bash
curl -X POST http://localhost:3000/user/profile/update-location \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
-d '{
  "latitude": 10.0,
  "longitude": 76.3
}'
```
*   **Note:** Replace `YOUR_ACCESS_TOKEN` and provide the user's current coordinates.

## Location Management Endpoints

### 6. Create a New Location Bookmark
Saves a new location associated with the authenticated user. Uses GeoJSON Point format.

```bash
curl -X POST http://localhost:3000/api/locations \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
-d '{
  "title": "Cool Shawarma Place",
  "latitude": 9.9816,
  "longitude": 76.2999,
  "reelUrl": "https://instagram.com/reel/example",
  "imageUrl": "https://example.com/image.jpg",
  "notes": "Must try their special shawarma!",
  "radius": 200
}'
```
*   **Note:** Replace `YOUR_ACCESS_TOKEN`. `latitude` and `longitude` will be converted to GeoJSON `Point` on the backend.

### 7. Get All Saved Locations
Retrieves all locations saved by the authenticated user.

```bash
curl -X GET http://localhost:3000/api/locations \
-H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```
*   **Note:** Replace `YOUR_ACCESS_TOKEN`.

### 8. Get Nearby Locations
Retrieves locations saved by the authenticated user that are within their custom-defined radius from a given point.

```bash
curl -X GET "http://localhost:3000/api/locations/nearby?latitude=10.0&longitude=76.3" \
-H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```
*   **Note:** Replace `YOUR_ACCESS_TOKEN` and provide the current `latitude` and `longitude` as query parameters.

### 9. Update a Saved Location
Updates details of an existing saved location. Can also update location coordinates and radius.

```bash
curl -X PUT http://localhost:3000/api/locations/LOCATION_ID \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
-d '{
  "title": "Updated Shawarma Spot",
  "notes": "New notes about the place.",
  "latitude": 9.9820,
  "longitude": 76.3005,
  "radius": 250
}'
```
*   **Note:** Replace `LOCATION_ID` with the actual ID of the location and `YOUR_ACCESS_TOKEN`.

### 10. Delete a Saved Location
Deletes a specific saved location.

```bash
curl -X DELETE http://localhost:3000/api/locations/LOCATION_ID \
-H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```
*   **Note:** Replace `LOCATION_ID` with the actual ID of the location and `YOUR_ACCESS_TOKEN`.

## Notification Endpoints

### 11. Send a Common Notification
Sends a notification to a specific topic (e.g., all users).

```bash
curl -X POST http://localhost:3000/api/notifications/send-common \
-H "Content-Type: application/json" \
-d '{
  "title": "Test Notification",
  "body": "This is a test notification to all users.",
  "topic": "common"
}'
```

### 12. Process Location Update (Geofencing Trigger)
Triggers a check to see if the authenticated user is near any of their saved locations, and sends notifications if applicable.

```bash
curl -X POST http://localhost:3000/api/notifications/process-location \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
-d '{
  "latitude": 10.0,
  "longitude": 76.3
}'
```
*   **Note:** Replace `YOUR_ACCESS_TOKEN` and update the coordinates to the user's current location.

### 13. Send Ad Notifications by Location
Sends bulk ad notifications to users whose last known location falls within a specified radius of a given point.

```bash
curl -X POST http://localhost:3000/api/notifications/send-ad-by-location \
-H "Content-Type: application/json" \
-d '{
  "latitude": 10.0,
  "longitude": 76.3,
  "adRadius": 5000, "title": "Special Offer!",
  "body": "Check out our new deals near you!",
  "data": {"campaignId": "ad_campaign_123"}
}'
```
*   **Note:** This endpoint is currently not protected by authentication. `adRadius` is in meters. Adjust `latitude`, `longitude`, `adRadius`, `title`, `body`, and `data` as needed.