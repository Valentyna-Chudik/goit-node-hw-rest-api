const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const rateLimit = require("express-rate-limit");
const usersRouter = require("./routes/api/users");
const contactsRouter = require("./routes/api/contacts");
const { reguestLimit } = require("./helpers/rate-limiter");
require("dotenv").config();

const app = express();

const USERS_AVATARS = process.env.USERS_AVATARS;
app.use(express.static(path.join(__dirname, USERS_AVATARS)));

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(helmet());
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json({ limit: 10000 })); // in bytes

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  handler: reguestLimit,
});
app.use("/api/", apiLimiter);
app.use("/api/users", usersRouter);
app.use("/api/contacts", contactsRouter);

app.use((_req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, _req, res, _next) => {
  res.status(err.status || 500).json({ message: err.message });
});

module.exports = app;
