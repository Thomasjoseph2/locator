# KeepLocation API cURL Commands

This document provides `curl` commands for testing the KeepLocation backend API endpoints.
Replace placeholders like `YOUR_ACCESS_TOKEN`, `YOUR_REFRESH_TOKEN`, and `LOCATION_ID` with actual values.

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

## Location Management Endpoints

### 5. Create a New Location Bookmark
Saves a new location associated with the authenticated user.

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
*   **Note:** Replace `YOUR_ACCESS_TOKEN`.

### 6. Get All Saved Locations
Retrieves all locations saved by the authenticated user.

```bash
curl -X GET http://localhost:3000/api/locations \
-H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```
*   **Note:** Replace `YOUR_ACCESS_TOKEN`.

### 7. Update a Saved Location
Updates details of an existing saved location.

```bash
curl -X PUT http://localhost:3000/api/locations/LOCATION_ID \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
-d '{
  "title": "Updated Shawarma Spot",
  "notes": "New notes about the place."
}'
```
*   **Note:** Replace `LOCATION_ID` with the actual ID of the location and `YOUR_ACCESS_TOKEN`.

### 8. Delete a Saved Location
Deletes a specific saved location.

```bash
curl -X DELETE http://localhost:3000/api/locations/LOCATION_ID \
-H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```
*   **Note:** Replace `LOCATION_ID` with the actual ID of the location and `YOUR_ACCESS_TOKEN`.

## Notification Endpoints

### 9. Send a Common Notification
Sends a notification to a specific topic (e.g., all users).

```bash
curl -X POST http://localhost:3000/api/notifications/send-common \
-H "Content-Type: application/json" \
-d '{
  "title": "Test Notification",
  "body": "This is a test notification to all users.",
  "topic": "common"
}'
```'
```
```
*   **Note:** Replace `YOUR_ACCESS_TOKEN`.

### 10. Process Location Update
Triggers a check to see if the user is near any of their saved locations.

```bash
curl -X POST http://localhost:3000/api/notifications/process-location \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
-d '{
  "currentLatitude": 10.0,
  "currentLongitude": 76.3
}'
```
*   **Note:** Replace `YOUR_ACCESS_TOKEN` and update the coordinates to a location near one of your saved locations.

