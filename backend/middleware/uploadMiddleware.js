const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

// Multer storage (temporary local storage)
const storage = multer.diskStorage({});

// File filter (only allow images)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"), false);
  }
};

// Multer upload setup
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: fileFilter,
});

// Upload middleware function (Cloudinary upload)
const uploadToCloudinary = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "resqnow_reports",
    });

    // Attach Cloudinary URL to request
    req.file.cloudinaryUrl = result.secure_url;

    // Delete temp file
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