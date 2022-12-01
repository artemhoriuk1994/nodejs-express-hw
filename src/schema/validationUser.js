const Joi = require("joi");

const schemePostRegister = Joi.object({
  email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
  password: Joi.string().required().min(7),
  subscription: Joi.string().valid("starter", "pro", "business"),
});

const schemeGetLogin = Joi.object({
  email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
  password: Joi.string().required()
});

const schemePatchSub = Joi.object({
   subscription: Joi.string().required().valid("starter", "pro", "business"),
})

const schemePostVerify = Joi.object({
   email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
})

module.exports = { schemePostRegister, schemeGetLogin, schemePatchSub, schemePostVerify};

