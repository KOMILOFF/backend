const router = require("express").Router();
const { getMyCart, addToCart, updateCart, removeFromCart } = require("../controller/cart.controller");


router.get("/", getMyCart);
router.post("/", addToCart);
router.put("/:id", updateCart);
router.delete("/:id", removeFromCart);

module.exports = router;