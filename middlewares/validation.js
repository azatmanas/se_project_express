const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return helpers.error("string.uri");
  }
  return value;
};

module.exports.validateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),

    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'The "imageUrl" field must be a valid URL',
    }),
    weather: Joi.string().valid("hot", "warm", "cold").required().messages({}),
  }),
});

module.exports.validateId = celebrate({
  params: Joi.object().keys({
    ItemId: Joi.string().length(24).hex().required().messages({
      "string.length": "The 'id' must be a 24-character hexadecimal string",
      "string.hex": "The 'id' must contain only hexadecimal characters",
      "any.required": "The 'id' field is required",
    }),
  }),
});
