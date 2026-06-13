const Profile = require("../models/profile.model");
const User = require("../models/user.model");
const { profileValidation } = require("../validations/profile.validation");
const bcrypt = require("bcrypt");

const getProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Foydalanuvchi aniqlanmadi" });
    }

    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "name", "email"],
    });

    if (!user) {
      return res.status(404).json({ message: "Profil topilmadi" });
    }

    const userProfile = await Profile.findOne({ where: { userId: req.user.id } });

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: userProfile ? userProfile.phone : "",
      address: userProfile ? userProfile.address : "",
      avatar: userProfile ? userProfile.avatar : "avatar.jpg"
    });
  } catch (err) {
    console.error("Profile Error:", err);
    res.status(500).json({ message: "Serverda xatolik yuz berdi" });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Barcha maydonlarni to'ldiring" });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Joriy parol noto'g'ri" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: "Parol muvaffaqiyatli yangilandi" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createProfile = async (req, res) => {
  try {
    const { error } = profileValidation(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const exist = await Profile.findOne({ where: { userId: req.user.id } });
    if (exist) return res.status(400).json({ message: "Profil allaqachon mavjud" });
    const profile = await Profile.create({ userId: req.user.id, ...req.body });
    res.status(201).json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { error } = profileValidation(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const profile = await Profile.findOne({ where: { userId: req.user.id } });
    if (!profile) return res.status(404).json({ message: "Profil topilmadi" });
    await profile.update(req.body);
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ where: { userId: req.user.id } });
    if (!profile) return res.status(404).json({ message: "Profil topilmadi" });
    await profile.destroy();
    res.json({ message: "Profil o'chirildi" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getProfile, updatePassword, createProfile, updateProfile, deleteProfile };