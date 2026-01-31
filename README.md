# Backend Service

## Structure

The project has been restructured to follow standard Express.js patterns:

- `src/controllers`: Request handlers.
- `src/services`: Business logic (Authentication, User management).
- `src/utils`: Utility functions (Password hashing).
- `src/routes`: API definitions.
- `src/app.js`: Express app configuration.
- `index.js`: Entry point.

## Running theserver

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

- `GET /health`: Check server status.
- `POST /auth/signup`: Create a new user. Body: `{ "email": "...", "password": "..." }`
- `POST /auth/login`: Login. Body: `{ "email": "...", "password": "..." }`
- `POST /auth/refresh`: Refresh access token. Body: `{ "token": "..." }`
- `POST /auth/logout`: Logout and invalidate refresh token. Body: `{ "token": "..." }`
