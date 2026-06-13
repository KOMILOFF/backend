const router = require("express").Router();
const { getReviews, getMyReviews, createReview, updateReview, deleteReview } = require("../controller/review.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/my-reviews", authMiddleware, getMyReviews);
router.get("/:smartphoneId", getReviews);
router.post("/", authMiddleware, createReview);
router.put("/:id", authMiddleware, updateReview);
router.delete("/:id", authMiddleware, deleteReview);

module.exports = router;