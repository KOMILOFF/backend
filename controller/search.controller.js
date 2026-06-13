const Smartphone = require("../models/smartphone.model");
const { Op } = require("sequelize");

const search = async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;

    const where = {};

    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (category) where.category = category;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = minPrice;
      if (maxPrice) where.price[Op.lte] = maxPrice;
    }

    const smartphones = await Smartphone.findAll({ where });
    res.json(smartphones);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { search };