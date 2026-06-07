//  backend/middleware/uploadMiddleware.js
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const path = require("path");

// Ensure local temporary directory path exists cleanly on boot execution
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

//  FIX: Explicitly configure destination and clean filename attributes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter allow-list rules parameters
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only images and PDFs are allowed"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit per file field
  fileFilter: fileFilter,
});

const uploadToCloudinary = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "resqnow_reports",
    });
    req.file.cloudinaryUrl = result.secure_url;
    fs.unlinkSync(req.file.path);
    next();
  } catch (error) {
    console.error("Cloudinary upload error ❌:", error.message);
    res.status(500).json({ error: "Image upload failed" });
  }
};

module.exports = {
  upload,
  uploadToCloudinary,
};
