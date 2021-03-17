const Joi = require("joi");
const { Subscriptions, HttpCode } = require("../../../helpers/constants");

const schemaCreateUser = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  password: Joi.string().required(),
  subscription: Joi.string()
    .valid(Subscriptions.FREE, Subscriptions.PRO, Subscriptions.PREMIUM)
    .default(Subscriptions.FREE),
  token: Joi.string().allow("").default(""),
});

const validate = (schema, obj, next) => {
  const { error } = schema.validate(obj);
  if (error) {
    const [{ message }] = error.details;
    return next({
      status: "Error",
      code: HttpCode.BAD_REQUEST,
      message: `Filled: ${message.replace(/"/g, "")}`,
    });
  }
  next();
};

module.exports.createUser = (req, _res, next) => {
  return validate(schemaCreateUser, req.body, next);
};

module.exports.validateUploadAvatar = (req, res, next) => {
  if (!req.file) {
    return res.status(HttpCode.BAD_REQUEST).json({
      status: "Error",
      code: HttpCode.BAD_REQUEST,
      data: "Bad request",
      message: "Avatar field with file not found",
    });
  }
  next();
};
