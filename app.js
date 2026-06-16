const express = require("express");
const cors = require("cors");
require("dotenv").config();
const sequelize = require("./config/database");

const User = require("./models/user.model");
const Smartphone = require("./models/smartphone.model");
const { Order, OrderItem } = require("./models/order.model");
const Profile = require("./models/profile.model");
const Review = require("./models/review.model");
const Cart = require("./models/cart.model");
const Address = require("./models/adress.model");

const app = express();

app.use(cors({
  origin: "*",
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

User.hasOne(Profile, { foreignKey: "userId", onDelete: "CASCADE" });
Profile.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Order, { foreignKey: "userId", onDelete: "CASCADE" });
Order.belongsTo(User, { foreignKey: "userId" });

Order.hasMany(OrderItem, { foreignKey: "orderId", as: "OrderItems", onDelete: "CASCADE" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });

Smartphone.hasMany(OrderItem, { foreignKey: "smartphoneId", onDelete: "CASCADE" });
OrderItem.belongsTo(Smartphone, { foreignKey: "smartphoneId" });

Smartphone.hasMany(Review, { foreignKey: "smartphoneId", onDelete: "CASCADE" });
Review.belongsTo(Smartphone, { foreignKey: "smartphoneId" });

User.hasMany(Review, { foreignKey: "userId", onDelete: "CASCADE" });
Review.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Cart, { foreignKey: "userId", onDelete: "CASCADE" });
Cart.belongsTo(User, { foreignKey: "userId" });

Smartphone.hasMany(Cart, { foreignKey: "smartphoneId", onDelete: "CASCADE" });
Cart.belongsTo(Smartphone, { foreignKey: "smartphoneId" });

User.hasMany(Address, { foreignKey: "userId", onDelete: "CASCADE" });
Address.belongsTo(User, { foreignKey: "userId" });

app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/smartphones", require("./routes/smartphone.route"));
app.use("/api/cart", require("./routes/cart.route"));
app.use("/api/orders", require("./routes/order.route"));
app.use("/api/profile", require("./routes/profile.route"));
app.use("/api/reviews", require("./routes/review.route"));
app.use("/api/search", require("./routes/search.route"));
app.use("/api/addresses", require("./routes/adress.route"));

const PORT = process.env.PORT || 10000;

sequelize.sync({ force: false }).then(() => { 
  app.listen(PORT, () => {
    console.log(`Server ${PORT} portda ishlamoqda✅`);
  });
}).catch((err) => {
  console.error("Baza sinxronizatsiyasida xatolik:", err);
});