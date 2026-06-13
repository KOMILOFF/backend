const Joi = require("joi");

const cartValidation = (data) => {
  const schema = Joi.object({
    userId: Joi.number().required(),
    smartphoneId: Joi.number().required(),
    qty: Joi.number().min(1).optional(),
  });
  return schema.validate(data);
};

module.exports = { cartValidation };