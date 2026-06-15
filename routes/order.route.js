const express = require("express");
const router = express.Router();
const orderController = require("../controller/order.controller");
const authMiddleware = require("../middlewares/auth.middleware"); // 🚀 Middleware olib kelindi


router.post("/", authMiddleware, orderController.createOrder);
router.get("/", authMiddleware, orderController.getOrders);
router.delete("/", authMiddleware, orderController.deleteOrder);

module.exports = router;