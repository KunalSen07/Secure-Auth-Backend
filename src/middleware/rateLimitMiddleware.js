const { checkRateLimit } = require("../services/rateLimit/rateLimitService");

function rateLimitMiddleware(req, res, next) {
  const identity = req.user?.id || req.ip;
  const normalizedPath = normalizePath(req.path);

  const { limit, remaining, reset, allowed } = checkRateLimit({
    key: `${identity}:${normalizedPath}`,
    path: normalizedPath,
  });

  res.setHeader("X-RateLimit-Limit", limit);
  res.setHeader("X-RateLimit-Remaining", remaining);
  res.setHeader("X-RateLimit-Reset", reset);

  if (!allowed) {
    return res.status(429).json({
      error: "Too many requests. Try again later.",
    });
  }

  next();
}

module.exports = rateLimitMiddleware;
