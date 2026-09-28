const express = require("express");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const messageController = require("../controllers/message.controller");
const protect = require("../middleware/auth.middleware");

const router = express.Router({ mergeParams: true });

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../uploads"),
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `${crypto.randomUUID()}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
  },
});

router.use(protect);

router.get("/", messageController.getMessages);

router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Image is required",
    });
  }

  res.status(201).json({
    success: true,
    data: {
      imageUrl: `/uploads/${req.file.filename}`,
    },
  });
});

module.exports = router;
