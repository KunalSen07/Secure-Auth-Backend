const crypto = require("crypto");

/**
 * Generates a high-entropy random CSRF token.
 * @returns {string} Hex string CSRF token.
 */
const generateCsrfToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

/**
 * Sets the CSRF token cookie on the response object.
 * @param {Object} res - Express response object.
 * @param {string} token - The CSRF token to set.
 */
const setCsrfCookie = (res, token) => {
  res.cookie("csrfToken", token, {
    httpOnly: false, // Must be false for frontend JS to read it for Double Submit Cookie pattern
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
  });
};

module.exports = {
  generateCsrfToken,
  setCsrfCookie,
};
