const Joi = require("joi");

const smartphoneValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).required(),
    price: Joi.number().required(),
    image: Joi.string().optional(),
    description: Joi.string().optional(),
    category: Joi.string().optional(),
  });
  return schema.validate(data);
};

module.exports = { smartphoneValidation };
