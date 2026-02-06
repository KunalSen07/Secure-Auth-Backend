# Secure Auth Backend

A robust and secure authentication system built with Node.js and Express. This service provides a complete solution for user management, featuring JSON Web Tokens (JWT) for session management, CSRF protection, and flexible rate limiting to prevent brute-force attacks.

## Features

- **Secure Authentication**:
  - Signup and Login with **Bcrypt** password hashing.
  - JWT-based authentication using **Access Tokens** and **Refresh Tokens**.
  - Token refresh mechanism with automatic token rotation.
- **Security & Protection**:
  - **CSRF Protection**: Native CSRF protection using cookie-based tokens.
  - **Rate Limiting**: Built-in support for both **In-Memory** and **Redis** stores to protect against DoS and brute-force attacks.
  - **Secure Cookies**: HTTP-only and SameSite cookie configurations.
- **Scalable Architecture**:
  - Clean separation of concerns with Controllers, Services, and Utilities.
  - Role-based middleware support.
  - Centralized error handling.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: In-memory (extendable)
- **Caching/Store**: Redis (optional, for rate limiting)
- **Security**: JWT, Bcrypt, Cookie-parser, CSRF logic

## Project Structure

```text
.
├── src/
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Auth, CSRF, Rate Limiting, Role middleware
│   ├── routes/           # API route definitions
│   ├── services/         # Business logic (Auth, User, RateLimit)
│   ├── utils/            # Utility functions (JWT, Password, CSRF, Redis)
│   └── app.js            # Express app configuration
├── index.js              # Server entry point
└── .env                  # Environment variables
```

## Setup & Installation

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd Secure-Auth-Backend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Environment Configuration**:
   Create a `.env` file in the root directory and configure the following:

   ```env
   JWT_SECRET=your_jwt_secret_key
   RATE_LIMIT_STORE=memory # Or 'redis'
   REDIS_URL=redis://localhost:6379 # Required if using redis store
   ```

4. **Run the server**:

   ```bash
   # Development mode (with --watch)
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Auth Routes (`/auth`)

| Endpoint   | Method | Description          | Body                          |
| :--------- | :----- | :------------------- | :---------------------------- |
| `/signup`  | POST   | Register a new user  | `{ "email", "password" }`     |
| `/login`   | POST   | Authenticate user    | `{ "email", "password" }`     |
| `/refresh` | POST   | Get new access token | `{ "token" }` (refresh token) |
| `/logout`  | POST   | Invalidate session   | `{ "token" }` (refresh token) |

## Security Implementation Details

- **CSRF**: The server generates a unique CSRF token for each session and sets it as a cookie. Clients must send this token back in the `X-CSRF-Token` header for state-changing requests.
- **Rate Limiting**: Configurable via `.env`. Supports distributed rate limiting through Redis for multi-instance deployments.
- **Passwords**: Never stored in plain text; always hashed using a salt factor of 10-12 via Bcrypt.
