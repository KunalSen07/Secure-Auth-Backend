const { hashData, verifyData } = require("../utils/passwordUtils");

// Mock database
const users = [];

const findUserByEmail = async (email) => {
  return users.find((user) => user.email === email);
};

const findUserById = async (id) => {
  return users.find((user) => user.id === id);
};

const createUser = async (user) => {
  const newUser = {
    id: users.length + 1,
    refreshTokens: [],
    ...user,
  };
  users.push(newUser);

  return newUser;
};

const addRefreshToken = async (userId, token) => {
  const user = await findUserById(userId);
  if (user) {
    const hashedToken = await hashData(token);
    user.refreshTokens.push(hashedToken);
  }
};

const removeRefreshToken = async (userId, token) => {
  const user = await findUserById(userId);
  if (user) {
    const results = await Promise.all(
      user.refreshTokens.map((t) => verifyData(token, t)),
    );
    const index = results.findIndex((match) => match);
    if (index !== -1) {
      user.refreshTokens.splice(index, 1);
    }
  }
};

const hasRefreshToken = async (userId, token) => {
  const user = await findUserById(userId);
  if (!user) return false;

  const results = await Promise.all(
    user.refreshTokens.map((t) => verifyData(token, t)),
  );
  return results.some((match) => match);
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  addRefreshToken,
  removeRefreshToken,
  hasRefreshToken,
};
