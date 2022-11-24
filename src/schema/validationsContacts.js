const Joi = require("joi");

const schemePost = Joi.object({
  name: Joi.string().required().max(30),
  phone: Joi.string().required(),
  email: Joi.string().required().email({minDomainSegments: 2, tlds: { allow: ["com", "net"] }}),
});

const schemePut = Joi.object({
  name: Joi.string().alphanum().min(2).max(10),
  email: Joi.string().email({
    minDomainSegments: 2,

    tlds: { allow: ["com", "net"] },
  }),
  phone: Joi.number(),
  favorite: Joi.boolean(),
});

const schemePatch = Joi.object({
  favorite: Joi.boolean().required()
});


module.exports = { schemePost, schemePut, schemePatch };

