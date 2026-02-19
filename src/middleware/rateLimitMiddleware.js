const { checkRateLimit } = require("../services/rateLimit/rateLimitService");
const { normalizePath } = require("../utils/helper");
const { createError } = require("../utils/errorUtils");
const { AUTH } = require("../utils/errorConstants");

async function rateLimitMiddleware(req, res, next) {
  const identity = req.user?.id || req.ip;
  const normalizedPath = normalizePath(req.path);

  const { limit, remaining, reset, allowed } = await checkRateLimit({
    key: `${identity}:${normalizedPath}`,
    path: normalizedPath,
  });

  res.setHeader("X-RateLimit-Limit", limit);
  res.setHeader("X-RateLimit-Remaining", remaining);
  res.setHeader("X-RateLimit-Reset", reset);

  if (!allowed) {
    return next(createError(AUTH.RATE_LIMIT_EXCEEDED));
  }

  next();
}

module.exports = rateLimitMiddleware;
