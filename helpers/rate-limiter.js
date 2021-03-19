const rateLimit = require("express-rate-limit");

const { HttpCode } = require("./constants");

const registerLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 2,
  handler: (_req, res, _next) => {
    return res.status(HttpCode.BAD_REQUEST).json({
      status: "Error",
      code: HttpCode.BAD_REQUEST,
      data: "Forbidden",
      message:
        "Too many attempts to register. Not more than two times per hour from one IP.",
    });
  },
});

const reguestLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 200,
  handler: (_req, res, _next) => {
    return res.status(HttpCode.BAD_REQUEST).json({
      status: "Error",
      code: HttpCode.BAD_REQUEST,
      data: "Bad request",
      message: "Too many requests, please try again later.",
    });
  },
});

module.exports = { registerLimit, reguestLimit };
