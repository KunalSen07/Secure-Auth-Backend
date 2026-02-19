const crypto = require("crypto");

const generateCsrfToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

const setSecurityCookies = (res, refreshToken, csrfToken) => {
  if (refreshToken) {
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  if (csrfToken) {
    res.cookie("csrfToken", csrfToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
    });
  }
};

const clearSecurityCookies = (res) => {
  res.clearCookie("refreshToken");
  res.clearCookie("csrfToken");
};

module.exports = {
  generateCsrfToken,
  setSecurityCookies,
  clearSecurityCookies,
};
