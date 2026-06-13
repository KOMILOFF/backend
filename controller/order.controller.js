const { Order, OrderItem } = require("../models/order.model");
const Smartphone = require("../models/smartphone.model");
const Cart = require("../models/cart.model");

exports.createOrder = async (req, res) => {
  try {
    const { items, address, userId } = req.body;
    const targetUserId = userId || (req.user && req.user.id);

    if (!targetUserId) {
      return res.status(400).json({ message: "userId topilmadi! Ro'yxatdan o'ting yoki userId yuboring." });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Savat bo'sh!" });
    }

    if (!address) {
      return res.status(400).json({ message: "Manzil kiritilmadi!" });
    }

    let totalPrice = 0;
    for (const item of items) {
      const product = await Smartphone.findByPk(item.id);
      if (!product) {
        return res.status(404).json({ message: `Mahsulot (ID: ${item.id}) topilmadi!` });
      }
      totalPrice += Number(product.price) * Number(item.qty || 1);
    }

    const order = await Order.create({
      userId: Number(targetUserId), 
      totalPrice: totalPrice,
      address: address,
    });

    for (const item of items) {
      const product = await Smartphone.findByPk(item.id);
      await OrderItem.create({
        orderId: order.id,
        smartphoneId: product.id,
        quantity: Number(item.qty || 1),
        price: product.price,
      });
    }

    await Cart.destroy({ where: { userId: Number(targetUserId) } });

    return res.status(201).json({ message: "Order created successfully", orderId: order.id });
  } catch (error) {
    console.error("BACKEND ORDER CREATE XATOLIGI:", error);
    return res.status(500).json({ message: "Backendda xatolik yuz berdi: " + error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const userId = (req.user && req.user.id) || (req.query && req.query.userId) || (req.body && req.body.userId);

    if (!userId) {
      return res.status(400).json({ message: "userId topilmadi!" });
    }

    const orders = await Order.findAll({
      where: { userId: userId },
      include: [{
        model: OrderItem,
        as: "OrderItems",
        include: [{ model: Smartphone }]
      }],
      order: [["createdAt", "DESC"]]
    });
    return res.status(200).json(orders);
  } catch (error) {
    console.error("BACKEND GET ORDERS XATOLIGI:", error);
    return res.status(500).json({ message: "Backendda xatolik yuz berdi: " + error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const { id, userId } = req.body;
    const targetUserId = userId || (req.user && req.user.id);

    if (!targetUserId || !id) {
      return res.status(400).json({ message: "userId va buyurtma id si kiritilishi shart!" });
    }

    const order = await Order.findOne({
      where: {
        id: Number(id),
        userId: Number(targetUserId)
      }
    });

    if (!order) {
      return res.status(404).json({ message: "Ushbu foydalanuvchiga tegishli bunday buyurtma topilmadi!" });
    }

    await OrderItem.destroy({ where: { orderId: id } });
    await order.destroy();

    return res.status(200).json({ message: "Buyurtma muvaffaqiyatli o'chirildi" });
  } catch (error) {
    console.error("BACKEND DELETE ORDER XATOLIGI:", error);
    return res.status(500).json({ message: "Backendda xatolik yuz berdi: " + error.message });
  }
};