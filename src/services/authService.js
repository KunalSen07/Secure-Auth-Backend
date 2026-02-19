const {
  findUserByEmail,
  createUser,
  addRefreshToken,
  hasRefreshToken,
  removeRefreshToken,
  findUserById,
} = require("./userService");
const { verifyPassword, hashPassword } = require("../utils/passwordUtils");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwtToken");
const { generateCsrfToken } = require("../utils/securityUtils");
const { createError } = require("../utils/errorUtils");
const { AUTH } = require("../utils/errorConstants");

const signup = async (email, password) => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) throw createError(AUTH.USER_EXISTS);

  const passwordHash = await hashPassword(password);
  const user = await createUser({ email, passwordHash });

  return authenticateSession(user);
};

const login = async (email, password) => {
  const user = await findUserByEmail(email);
  if (!user) throw createError(AUTH.INVALID_CREDENTIALS);

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) throw createError(AUTH.INVALID_CREDENTIALS);

  return authenticateSession(user);
};

const refresh = async (oldRefreshToken) => {
  if (!oldRefreshToken) throw createError(AUTH.REFRESH_TOKEN_REQUIRED);

  const decoded = verifyRefreshToken(oldRefreshToken);
  if (!decoded) throw createError(AUTH.INVALID_REFRESH_TOKEN);

  const hasToken = await hasRefreshToken(decoded.id, oldRefreshToken);
  if (!hasToken) throw createError(AUTH.TOKEN_NOT_FOUND);

  const user = await findUserById(decoded.id);
  if (!user) throw createError(AUTH.USER_NOT_FOUND);

  await removeRefreshToken(user.id, oldRefreshToken);
  return authenticateSession(user);
};

const logout = async (refreshToken) => {
  if (refreshToken) {
    const decoded = verifyRefreshToken(refreshToken);
    if (decoded) {
      await removeRefreshToken(decoded.id, refreshToken);
    }
  }
};

const authenticateSession = async (user) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  const csrfToken = generateCsrfToken();

  await addRefreshToken(user.id, refreshToken);

  return {
    user: { id: user.id, email: user.email },
    accessToken,
    refreshToken,
    csrfToken,
  };
};

module.exports = {
  signup,
  login,
  refresh,
  logout,
};
