const Joi = require("joi");

const profileValidation = (data) => {
  const schema = Joi.object({
    phone: Joi.string().optional(),
    address: Joi.string().optional(),
    avatar: Joi.string().optional(),
  });
  return schema.validate(data);
};

module.exports = { profileValidation };
