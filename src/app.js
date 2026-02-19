const express = require("express");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const csrfMiddleware = require("./middleware/csrfMiddleware");
const rateLimitMiddleware = require("./middleware/rateLimitMiddleware");
const { SERVER } = require("./utils/errorConstants");
const logger = require("./utils/logger");

const app = express();

app.set("trust proxy", 1);

app.use(express.json());
app.use(cookieParser());
app.use(rateLimitMiddleware);
app.use(csrfMiddleware);

app.use("/auth", authRoutes);

app.use((err, req, res, next) => {
  const status = err.status || SERVER.INTERNAL_ERROR.status;
  const message = err.message || SERVER.INTERNAL_ERROR.message;

  if (status === 500) {
    logger.error("Internal Server Error", err);
  } else {
    logger.warn(`Client Error: ${message}`, { status, path: req.path });
  }

  res.status(status).json({ error: message });
});

module.exports = app;
