const express = require("express");
const router = express.Router();

const { 
  getProfile, 
  updatePassword, 
  createProfile, 
  updateProfile, 
  deleteProfile 
} = require("../controller/profile.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", authMiddleware, getProfile);
router.post("/", authMiddleware, createProfile);
router.put("/", authMiddleware, updateProfile);
router.put("/password", authMiddleware, updatePassword);
router.delete("/", authMiddleware, deleteProfile);

module.exports = router;