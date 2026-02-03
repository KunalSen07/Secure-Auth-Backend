const express = require("express");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const csrfMiddleware = require("./middleware/csrfMiddleware");
const rateLimitMiddleware = require("./middleware/rateLimitMiddleware");

const app = express();

app.set("trust proxy", 1);

app.use(express.json());
app.use(cookieParser());
app.use(rateLimitMiddleware);
app.use(csrfMiddleware);

app.use("/auth", authRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

module.exports = app;
