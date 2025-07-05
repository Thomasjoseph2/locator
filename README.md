# Node.js Authentication App

This project is a simple Node.js application that provides user authentication and profile access functionalities. It uses Express.js as the web framework and includes routes for user login, signup, and accessing user profiles.

## Project Structure

```
app
├── src
│   ├── index.js               # Entry point of the application
│   ├── routes
│   │   ├── auth.js            # Authentication routes (login/signup)
│   │   └── profile.js         # Profile access route (requires authentication)
│   ├── middleware
│   │   └── authMiddleware.js   # Middleware for authentication
│   └── controllers
│       ├── authController.js   # Controller for authentication logic
│       └── profileController.js # Controller for profile access logic
├── package.json                # Project dependencies and scripts
└── README.md                   # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd app
   ```

2. Install the dependencies:
   ```
   npm install
   ```

## Running the Server

To start the server, run the following command:
```
npm start
```

The server will be running on `http://localhost:3000`.

## Available Routes

- **POST /api/auth/signup**: Create a new user account.
- **POST /api/auth/login**: Authenticate a user and return a token.
- **GET /api/profile**: Access the user profile (requires authentication).

## Middleware

The application includes middleware to protect routes that require authentication. The `authMiddleware` checks for a valid authentication token in the request headers.

## Controllers

- **authController**: Handles user login and signup logic.
- **profileController**: Manages access to user profile information.

## License

This project is licensed under the MIT License.