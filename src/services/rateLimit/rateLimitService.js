const { check } = require("./storeFactory");

const RATE_LIMITS = {
  "/auth/login": { windowMs: 60_000, max: 5 },
  "/auth/refresh": { windowMs: 60_000, max: 10 },
  default: { windowMs: 60_000, max: 100 },
};

async function checkRateLimit({ key, path }) {
  const { windowMs, max } = RATE_LIMITS[path] || RATE_LIMITS.default;

  const result = await check(key, windowMs, max);

  const remaining = Math.max(0, max - result.count);

  return {
    allowed: result.allowed,
    limit: max,
    remaining,
    reset: Math.ceil(windowMs / 1000),
  };
}

module.exports = { checkRateLimit };
