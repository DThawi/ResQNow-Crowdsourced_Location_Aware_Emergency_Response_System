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

// Multer setup
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: fileFilter,
});

// ✅ THIS WAS MISSING 👇
const uploadToCloudinary = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "resqnow_reports",
    });

    req.file.cloudinaryUrl = result.secure_url;

    // delete temp file
    fs.unlinkSync(req.file.path);

    next();
  } catch (error) {
    console.error("Cloudinary upload error ❌:", error.message);
    res.status(500).json({ error: "Image upload failed" });
  }
};

// export properly
module.exports = {
  upload,
  uploadToCloudinary,
};