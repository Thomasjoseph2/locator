# Lovable App: Frontend Development Plan

This document outlines the plan for developing the Flutter mobile application.

## 1. Core Technology

- **Framework:** Flutter
- **State Management:** Provider (or Riverpod for more complex state)
- **Backend API:** The existing Node.js/Express API.

## 2. MVP Feature Set

The primary goal is to build a functional MVP that achieves the core value proposition: saving locations and getting notified when nearby.

### Feature 2.1: User Authentication
- **Screens:** Login, Register.
- **Functionality:** Connect to the existing `/api/auth` endpoints. Securely store JWT tokens on the device using `flutter_secure_storage`.

### Feature 2.2: Location Bookmarking
- **UI:**
    - A main screen displaying a list of all saved locations.
    - A floating action button to open the "Add Location" screen.
- **"Add Location" Screen:**
    - **Search:** A text field that uses the Google Places API (via `google_places_flutter` or similar) to allow users to easily search for places.
    - **Manual Entry:** Allow users to manually input details if needed.
    - **Rich Context Fields:**
        - **Title:** (Required)
        - **Coordinates:** (Required, auto-filled from search)
        - **Notes:** A text area for personal notes.
        - **Image/Reel URL:** A field to paste a link (e.g., from Instagram, blogs). We can later add functionality to auto-fetch a thumbnail from this link.
- **Functionality:** On save, send the data to the `POST /api/locations` endpoint.

### Feature 2.3: Geofence Notifications (The "Magic" Feature)
- **Technology:** Use the `geofence_service` package for efficient, battery-safe geofencing.
- **Implementation:**
    1.  When the app starts (and after login), fetch all saved locations from the backend.
    2.  For each location, register a geofence with the `geofence_service`.
    3.  The radius will initially be hardcoded (e.g., 3km) but can be made configurable later.
    4.  Create a background event handler that listens for geofence triggers (e.g., `GeofenceStatus.ENTER`).
    5.  When the handler is triggered, use the `flutter_local_notifications` package to display a notification to the user (e.g., "A bookmarked place, 'The Grand Cafe', is nearby!").

## 3. Post-MVP Enhancements (Future Ideas)

- **Customizable Radius:** Add a settings screen to allow users to change the notification radius.
- **Collections:** Allow users to group saved locations into lists (e.g., "Paris Trip," "Local Eats").
- **Share Extension:** Implement a native share extension so users can save locations directly from other apps like Google Maps or Instagram.
- **Smart Notifications:** Only trigger notifications if the user has been stationary in the area for a certain period, avoiding false positives when driving by.

## 4. Project Structure

A standard Flutter project structure will be used. The initial scaffolding will be created using `flutter create`.
