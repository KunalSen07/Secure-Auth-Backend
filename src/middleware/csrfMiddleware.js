const crypto = require("crypto");
const { createError } = require("../utils/errorUtils");
const { AUTH } = require("../utils/errorConstants");

function csrfMiddleware(req, res, next) {
  if (
    ["GET", "HEAD", "OPTIONS"].includes(req.method) ||
    req.path === "/auth/login" ||
    req.path === "/auth/signup"
  ) {
    return next();
  }

  const csrfCookie = req.cookies.csrfToken;
  const csrfHeader = req.headers["x-csrf-token"];

  if (!csrfCookie || !csrfHeader) {
    return next(createError(AUTH.CSRF_MISSING));
  }
  try {
    const valid = crypto.timingSafeEqual(
      Buffer.from(csrfCookie),
      Buffer.from(csrfHeader),
    );

    if (!valid) {
      return next(createError(AUTH.CSRF_INVALID));
    }
  } catch {
    return next(createError(AUTH.CSRF_INVALID));
  }

  next();
}

module.exports = csrfMiddleware;
