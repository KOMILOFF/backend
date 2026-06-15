const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Order, OrderItem } = require("../models/order.model");
const Smartphone = require("../models/smartphone.model");
const User = require("../models/user.model");
const {
  registerValidation,
  loginValidation,
} = require("../validations/user.validation");

const register = async (req, res) => {
  try {
    const { error } = registerValidation(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const existUser = await User.findOne({
      where: { email: req.body.email },
    });

    if (existUser)
      return res.status(400).json({
        message: "Email allaqachon mavjud",
      });

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    const { password, ...userWithoutPassword } = user.toJSON();

    res.status(201).json({
      message: "Muvaffaqiyatli ro'yxatdan o'tdingiz",
      user: userWithoutPassword,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { error } = loginValidation(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const user = await User.findOne({
      where: { email: req.body.email },
    });

    if (!user)
      return res.status(400).json({
        message: "Email yoki parol xato",
      });

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword)
      return res.status(400).json({
        message: "Email yoki parol xato",
      });

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Muvaffaqiyatli kirdingiz",
      token,
      id: user.id
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Order,
          include: [
            {
              model: OrderItem,
              as: "OrderItems", // 🚀 Mana bu yerda alias ('as') nomi qo'shildi!
              include: [Smartphone],
            },
          ],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({
        message: "Foydalanuvchi topilmadi",
      });
    }

    res.status(200).json(user);
  } catch (err) {
    console.log("getUserById xatoligi:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  register,
  login,
  getUsers,
  getUserById,
};