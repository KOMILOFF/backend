const express = require("express");
const router = express.Router();
const addressController = require("../controller/adress.controller");
const authMiddleware = require("../middlewares/auth.middleware");


router.post("/", addressController.createAddress);
router.get("/", addressController.getAddresses);
router.put("/", addressController.updateAddress);
router.delete("/", addressController.deleteAddress);

module.exports = router;