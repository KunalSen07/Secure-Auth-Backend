const { check } = require("./storeFactory");
const logger = require("../../utils/logger");

const RATE_LIMITS = {
  "/auth/login": { windowMs: 60_000, max: 5, failStrategy: "closed" },
  "/auth/refresh": { windowMs: 60_000, max: 10, failStrategy: "closed" },
  default: { windowMs: 60_000, max: 100, failStrategy: "open" },
};

async function checkRateLimit({ key, path }) {
  const config = RATE_LIMITS[path] || RATE_LIMITS.default;
  const { windowMs, max, failStrategy } = config;

  try {
    const result = await check(key, windowMs, max);
    const count = result.count || 0;
    const remaining = Math.max(0, max - count);

    return {
      allowed: result.allowed,
      limit: max,
      remaining,
      reset: Math.ceil(windowMs / 1000),
    };
  } catch (error) {
    logger.error(`Rate limit store error for ${key}`, error);

    const isAllowed = failStrategy === "open";

    return {
      allowed: isAllowed,
      limit: max,
      remaining: isAllowed ? 1 : 0,
      reset: Math.ceil(windowMs / 1000),
      error: true,
    };
  }
}

module.exports = { checkRateLimit };
