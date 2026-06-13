const Joi = require("joi");

const reviewValidation = (data) => {
  const schema = Joi.object({
    smartphoneId: Joi.number().required(),
    comment: Joi.string().min(3).required(),
    rating: Joi.number().min(1).max(5).required(),
    orderItemId: Joi.number().optional()
  });
  return schema.validate(data);
};

module.exports = { reviewValidation };