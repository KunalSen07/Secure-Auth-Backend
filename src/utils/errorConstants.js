module.exports = {
  AUTH: {
    EMAIL_PASSWORD_REQUIRED: {
      message: "Email and password are required",
      status: 400,
    },
    USER_EXISTS: {
      message: "User already exists",
      status: 409,
    },
    INVALID_CREDENTIALS: {
      message: "Invalid credentials",
      status: 401,
    },
    REFRESH_TOKEN_REQUIRED: {
      message: "Refresh token is required",
      status: 400,
    },
    INVALID_REFRESH_TOKEN: {
      message: "Invalid refresh token",
      status: 401,
    },
    TOKEN_NOT_FOUND: {
      message: "Refresh token not found or already used",
      status: 403,
    },
    USER_NOT_FOUND: {
      message: "User not found",
      status: 401,
    },
    CSRF_MISSING: {
      message: "CSRF token missing",
      status: 403,
    },
    CSRF_INVALID: {
      message: "Invalid CSRF token",
      status: 403,
    },
    RATE_LIMIT_EXCEEDED: {
      message: "Too many requests, please try again later",
      status: 429,
    },
  },
  SERVER: {
    INTERNAL_ERROR: {
      message: "Something went wrong!",
      status: 500,
    },
  },
};
