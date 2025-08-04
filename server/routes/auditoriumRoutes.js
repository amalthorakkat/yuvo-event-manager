



const express = require("express");
const router = express.Router();
const {
  getAllAuditoriums,
  getAuditoriumById,
  createAuditorium,
  updateAuditorium,
  deleteAuditorium,
} = require("../controllers/auditoriumController");
const multer = require("multer");
const { protect, restrictTo } = require("../middlewares/authMiddleware");

// Multer setup for file uploads
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, and WebP files are allowed"), false);
  }
};
const upload = multer({ storage, fileFilter });

// Public routes
router.get("/", getAllAuditoriums); // Get all auditoriums
router.get("/:id", getAuditoriumById); // Get single auditorium

// Admin-only routes
router.post(
  "/",
  protect,
  restrictTo("admin"),
  upload.array("images", 10),
  createAuditorium
); // Create auditorium
router.put(
  "/:id",
  protect,
  restrictTo("admin"),
  upload.array("images", 10),
  updateAuditorium
); // Update auditorium
router.delete("/:id", protect, restrictTo("admin"), deleteAuditorium); // Delete auditorium

module.exports = router;