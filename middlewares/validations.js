const Joi = require("joi");

const scheme = Joi.object({
  name: Joi.string().required().min(2).max(30),
  phone: Joi.string().required(),
  email: Joi.string()
    .required()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
});

module.exports = {
    scheme
}