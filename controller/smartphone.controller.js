const Smartphone = require("../models/smartphone.model");
const { smartphoneValidation } = require("../validations/smartphone.validation");

const getAll = async (req, res) => {
  try {
    const smartphones = await Smartphone.findAll();
    res.json(smartphones);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getOne = async (req, res) => {
  try {
    const smartphone = await Smartphone.findByPk(req.params.id);
    if (!smartphone) return res.status(404).json({ message: "Topilmadi" });
    res.json(smartphone);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { error } = smartphoneValidation(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const smartphone = await Smartphone.create(req.body);
    res.status(201).json(smartphone);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const smartphone = await Smartphone.findByPk(req.params.id);
    if (!smartphone) return res.status(404).json({ message: "Topilmadi" });

    await smartphone.update(req.body);
    res.json(smartphone);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const smartphone = await Smartphone.findByPk(req.params.id);
    if (!smartphone) return res.status(404).json({ message: "Topilmadi" });

    await smartphone.destroy();
    res.json({ message: "O'chirildi" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAll, getOne, create, update, remove };
