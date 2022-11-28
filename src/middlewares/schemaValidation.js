const { BadRequest } = require('http-errors');
const validationSchema = (schema) => {
  return (req, res, next) => {
    const validationResult = schema.validate(req.body);

      if (validationResult.error) {
        throw new BadRequest(validationResult.error.message)
    }
    next();
  };
};

module.exports = {
  validationSchema,
};