const authService = require("../services/authService");
const {
  setSecurityCookies,
  clearSecurityCookies,
} = require("../utils/securityUtils");
const { createError } = require("../utils/errorUtils");
const { AUTH } = require("../utils/errorConstants");

const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) throw createError(AUTH.EMAIL_PASSWORD_REQUIRED);

    // 2. Call one service function
    const session = await authService.signup(email, password);
    const { user, accessToken, refreshToken, csrfToken } = session;

    // 3. Assemble response (security response via utility)
    setSecurityCookies(res, refreshToken, csrfToken);

    res.status(201).json({
      message: "User created successfully",
      user,
      accessToken,
      csrfToken,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw createError(AUTH.EMAIL_PASSWORD_REQUIRED);

    const session = await authService.login(email, password);
    const { user, accessToken, refreshToken, csrfToken } = session;

    setSecurityCookies(res, refreshToken, csrfToken);

    res.status(200).json({
      message: "Login successful",
      user,
      accessToken,
      csrfToken,
    });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const token = req.body.token || req.cookies.refreshToken;

    const session = await authService.refresh(token);
    const { accessToken, refreshToken: newRefreshToken, csrfToken } = session;

    setSecurityCookies(res, newRefreshToken, csrfToken);

    res.status(200).json({
      accessToken,
      csrfToken,
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const token = req.body.token || req.cookies.refreshToken;
    await authService.logout(token);

    clearSecurityCookies(res);

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  refreshToken,
  logout,
};
