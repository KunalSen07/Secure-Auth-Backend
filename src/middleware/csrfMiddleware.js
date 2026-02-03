const crypto = require("crypto");

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
    return res.status(403).json({ error: "CSRF token missing" });
  }
  try {
    const valid = crypto.timingSafeEqual(
      Buffer.from(csrfCookie),
      Buffer.from(csrfHeader),
    );

    if (!valid) return res.status(403).json({ error: "Invalid CSRF token" });
  } catch {
    return res.status(403).json({ error: "Invalid CSRF token" });
  }

  next();
}

module.exports = csrfMiddleware;
