const { findUserByEmail, createUser } = require("./userService");
const { verifyPassword, hashPassword } = require("../utils/passwordUtils");

const signup = async (email, password) => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) throw new Error("User already exists");

  const passwordHash = await hashPassword(password);
  const user = await createUser({ email, passwordHash });

  return user;
};

const login = async (email, password) => {
  const user = await findUserByEmail(email);
  if (!user) throw new Error("Invalid credentials");

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) throw new Error("Invalid credentials");

  return user;
};

module.exports = {
  signup,
  login,
};
