const Review = require("../models/review.model");
const Smartphone = require("../models/smartphone.model");
const { reviewValidation } = require("../validations/review.validation");

const getReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { smartphoneId: req.params.smartphoneId },
    });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { userId: req.user.id },
      include: [{ model: Smartphone, attributes: ["name", "image"] }]
    });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createReview = async (req, res) => {
  try {
    const { error } = reviewValidation(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const review = await Review.create({
      userId: req.user.id,
      smartphoneId: req.body.smartphoneId,
      comment: req.body.comment,
      rating: req.body.rating,
    });
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateReview = async (req, res) => {
  try {
    const review = await Review.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!review) return res.status(404).json({ message: "Topilmadi" });

    await review.update({
      comment: req.body.comment,
      rating: req.body.rating
    });
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!review) return res.status(404).json({ message: "Topilmadi" });

    await review.destroy();
    res.json({ message: "Izoh o'chirildi" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getReviews, getMyReviews, createReview, updateReview, deleteReview };