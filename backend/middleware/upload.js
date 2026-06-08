const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

const storage = multer.diskStorage({});

// File filter — allow images and PDFs
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
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: fileFilter,
});

// Single image upload for incidents
const uploadToCloudinary = async (req, res, next) => {
  try {
    if (!req.file) return next();
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "resqnow_reports",
      resource_type: "auto",
    });
    req.file.cloudinaryUrl = result.secure_url;
    fs.unlinkSync(req.file.path);
    next();
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    next(error);
  }
};

// Multiple documents upload for responder registration
const uploadDocumentsToCloudinary = async (req, res, next) => {
  try {
    if (!req.files) return next();

    const uploadedUrls = {};

    for (const [fieldName, files] of Object.entries(req.files)) {
      const file = files[0];
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "resqnow_documents",
        resource_type: "auto",
      });
      uploadedUrls[fieldName] = result.secure_url;
      fs.unlinkSync(file.path);
    }

    req.documentUrls = uploadedUrls;
    next();
  } catch (error) {
    console.error("Cloudinary documents upload error:", error);
    next(error);
  }
};

module.exports = { upload, uploadToCloudinary, uploadDocumentsToCloudinary };