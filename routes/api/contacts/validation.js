const Joi = require("joi");
const { HttpCode } = require("../../../helpers/constants");

const schemaAddContact = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  phone: Joi.string().min(10).max(13).required(),
  subscription: Joi.string().valid("free", "pro", "premium").default("free"),
});

const schemaUpdateContact = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).optional(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .optional(),
  phone: Joi.string().min(10).max(13).optional(),
  subscription: Joi.string().valid("free", "pro", "premium").default("free"),
});

const schemaContactID = Joi.object({
  id: Joi.string().required(),
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

module.exports.addContact = (req, _res, next) => {
  return validate(schemaAddContact, req.body, next);
};

module.exports.updateContact = (req, _res, next) => {
  return validate(schemaUpdateContact, req.body, next);
};

module.exports.ContactID = (req, _res, next) => {
  return validate(schemaContactID, req.query, next);
};
