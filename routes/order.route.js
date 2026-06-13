const express = require("express");
const router = express.Router();
const orderController = require("../controller/order.controller");

router.post("/", orderController.createOrder);
router.get("/", orderController.getOrders);
router.delete("/", orderController.deleteOrder);

module.exports = router;