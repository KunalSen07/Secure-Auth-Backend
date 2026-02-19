const memoryStore = require("./memoryStore");
const redisStore = require("./redisStore");

const getStore = () => {
  const useRedis =
    process.env.RATE_LIMIT_STORE === "redis" && process.env.REDIS_URL;
  return useRedis ? redisStore : memoryStore;
};

module.exports = {
  getStore,
  check: (key, windowMs, max) => getStore().check(key, windowMs, max),
};
