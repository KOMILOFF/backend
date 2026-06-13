const Joi = require("joi");

const orderValidation = (data) => {
  const schema = Joi.object({
    fullName: Joi.string().required(),
    phone: Joi.string().required(),
    address: Joi.string().required(),
    totalPrice: Joi.number().required(),
  });
  return schema.validate(data);
};

module.exports = { orderValidation };
