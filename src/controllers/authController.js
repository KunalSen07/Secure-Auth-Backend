const {
  signup: authSignup,
  login: authLogin,
} = require("../services/authService");
const {
  addRefreshToken,
  findUserById,
  removeRefreshToken,
  hasRefreshToken,
} = require("../services/userService");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwtToken");
const { generateCsrfToken, setCsrfCookie } = require("../utils/csrfUtils");

const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const user = await authSignup(email, password);
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await addRefreshToken(user.id, refreshToken);

    const csrfToken = generateCsrfToken();
    setCsrfCookie(res, csrfToken);

    res.status(201).json({
      message: "User created successfully",
      user: { id: user.id, email: user.email },
      accessToken,
      refreshToken,
      csrfToken,
    });
  } catch (error) {
    if (error.message === "User already exists") {
      return res.status(409).json({ error: error.message });
    }
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const user = await authLogin(email, password);
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await addRefreshToken(user.id, refreshToken);

    const csrfToken = generateCsrfToken();
    setCsrfCookie(res, csrfToken);

    res.status(200).json({
      message: "Login successful",
      user: { id: user.id, email: user.email },
      accessToken,
      refreshToken,
      csrfToken,
    });
  } catch (error) {
    if (error.message === "Invalid credentials") {
      return res.status(401).json({ error: error.message });
    }
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ error: "Refresh token is required" });
    }

    const decoded = verifyRefreshToken(token);
    if (!decoded) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    const hasToken = await hasRefreshToken(decoded.id, token);
    if (!hasToken) {
      return res
        .status(403)
        .json({ error: "Refresh token not found or already used" });
    }

    const user = await findUserById(decoded.id);
    if (!user) return res.status(401).json({ error: "User not found" });

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    await removeRefreshToken(user.id, token);
    await addRefreshToken(user.id, newRefreshToken);

    const csrfToken = generateCsrfToken();
    setCsrfCookie(res, csrfToken);

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      csrfToken,
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (token) {
      const decoded = verifyRefreshToken(token);
      if (decoded) {
        await removeRefreshToken(decoded.id, token);
      }
    }
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
