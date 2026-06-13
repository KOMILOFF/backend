const Cart = require("../models/cart.model");
const Smartphone = require("../models/smartphone.model");
const { cartValidation } = require("../validations/cart.validation");

const getMyCart = async (req, res) => {
  try {
    const userId = (req.query && req.query.userId) || (req.body && req.body.userId);
    
    if (!userId) {
      return res.status(400).json({ message: "userId topilmadi!" });
    }

    const cart = await Cart.findAll({
      where: { userId: userId },
      include: [{
        model: Smartphone,
        required: false
      }]
    });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const { error } = cartValidation(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { userId, smartphoneId, qty } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId majburiy maydon!" });
    }

    const exist = await Cart.findOne({
      where: { userId: userId, smartphoneId: smartphoneId },
    });

    if (exist) {
      await exist.update({ qty: exist.qty + (qty || 1) });
      return res.json(exist);
    }

    const cart = await Cart.create({
      userId: userId, 
      smartphoneId: smartphoneId,
      qty: qty || 1,
    });

    res.status(201).json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateCart = async (req, res) => {
  try {
    const { userId, qty } = req.body;
    const cart = await Cart.findOne({
      where: { id: req.params.id, userId: userId },
    });
    if (!cart) return res.status(404).json({ message: "Topilmadi" });

    await cart.update({ qty: qty });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const userId = (req.body && req.body.userId) || (req.query && req.query.userId);
    const cart = await Cart.findOne({
      where: { id: req.params.id, userId: userId },
    });
    if (!cart) return res.status(404).json({ message: "Topilmadi" });

    await cart.destroy();
    res.json({ message: "Savatdan o'chirildi" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getMyCart, addToCart, updateCart, removeFromCart };