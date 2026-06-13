const Address = require("../models/adress.model");

exports.createAddress = async (req, res) => {
  try {
    const { title, details, userId } = req.body;
    
    const targetUserId = userId || (req.user && req.user.id);

    if (!targetUserId) {
      return res.status(400).json({ message: "userId topilmadi yoki kiritilmadi!" });
    }

    if (!title || !details) {
      return res.status(400).json({ message: "Barcha maydonlarni to'ldiring" });
    }

    const address = await Address.create({ 
      title, 
      details, 
      userId: Number(targetUserId) 
    });

    res.status(201).json(address);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getAddresses = async (req, res) => {
  try {
    const userId = (req.query && req.query.userId) || (req.user && req.user.id);

    if (!userId) {
      return res.status(400).json({ message: "userId topilmadi!" });
    }

    const addresses = await Address.findAll({ where: { userId: Number(userId) } });
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.updateAddress = async (req, res) => {
  try {
    const { id, userId, title, details } = req.body;
    const targetUserId = userId || (req.user && req.user.id);

    if (!targetUserId || !id) {
      return res.status(400).json({ message: "userId va manzil id si kiritilishi shart!" });
    }

    const address = await Address.findOne({
      where: { 
        id: Number(id),
        userId: Number(targetUserId) 
      }
    });

    if (!address) {
      return res.status(404).json({ message: "Ushbu foydalanuvchiga tegishli bunday manzil topilmadi!" });
    }

    address.title = title || address.title;
    address.details = details || address.details;
    await address.save();

    res.json(address);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const { id, userId } = req.body;
    const targetUserId = userId || (req.user && req.user.id);

    if (!targetUserId || !id) {
      return res.status(400).json({ message: "userId va manzil id si kiritilishi shart!" });
    }

    const address = await Address.findOne({
      where: { 
        id: Number(id),
        userId: Number(targetUserId) 
      }
    });

    if (!address) {
      return res.status(404).json({ message: "Ushbu foydalanuvchiga tegishli bunday manzil topilmadi!" });
    }

    await address.destroy();
    res.json({ message: "Manzil muvaffaqiyatli o'chirildi" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }

};