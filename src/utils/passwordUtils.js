const bcrypt = require("bcrypt");

const hashData = async (data) => {
  const saltRounds = 10;
  return await bcrypt.hash(data, saltRounds);
};

const verifyData = async (data, hash) => {
  return await bcrypt.compare(data, hash);
};

module.exports = {
  hashPassword: hashData,
  verifyPassword: verifyData,
  hashData,
  verifyData,
};
