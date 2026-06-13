const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // yo'lingiz to'g'riligini tekshiring

const Order = sequelize.define("Order", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("Pending", "Processing", "Shipped", "Delivered", "Cancelled"),
    defaultValue: "Pending",
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // MANA SHU QATORNI QO'SHAMIZ: Ustun nomini PostgreSQL-ga moslab kichik harfda qat'iy belgilaymiz
  userId: {
    type: DataTypes.INTEGER,
    field: "userId", 
    allowNull: false
  }
}, {
  timestamps: true,
  tableName: "Orders" // Jadval nomini qat'iylashtirish
});

const OrderItem = sequelize.define("OrderItem", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },

  orderId: {
    type: DataTypes.INTEGER,
    field: "orderId"
  },
  smartphoneId: {
    type: DataTypes.INTEGER,
    field: "smartphoneId"
  }
}, {
  tableName: "OrderItems"
});

module.exports = { Order, OrderItem };