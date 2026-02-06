const memoryStore = require("./memoryStore");
const redisStore = require("./redisStore");

const USE_REDIS = process.env.RATE_LIMIT_STORE === "redis";

module.exports = USE_REDIS ? redisStore : memoryStore;
