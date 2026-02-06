const redis = require("../../utils/redisClient");

const luaScript = `
local key = KEYS[1]
local now = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local limit = tonumber(ARGV[3])

redis.call("ZADD", key, now, now)
redis.call("ZREMRANGEBYSCORE", key, 0, now - window)

local count = redis.call("ZCARD", key)

redis.call("EXPIRE", key, math.ceil(window / 1000))

if count > limit then
  return {0, count}
end

return {1, count}
`;

async function check(key, windowMs, max) {
  const now = Date.now();

  const [allowed, count] = await redis.eval(luaScript, {
    keys: [key],
    arguments: [now.toString(), windowMs.toString(), max.toString()],
  });

  return {
    allowed: allowed === 1,
    count,
  };
}

module.exports = { check };
