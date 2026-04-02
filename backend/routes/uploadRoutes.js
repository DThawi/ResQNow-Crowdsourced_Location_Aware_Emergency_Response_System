const express = require("express");
const router = express.Router();
const { upload, uploadToCloudinary } = require("../middleware/upload"); // adjust path

router.post(
  "/upload",
  upload.single("image"),
  uploadToCloudinary,
  (req, res) => {
    res.json({
      message: "Upload successful ✅",
      imageUrl: req.file.cloudinaryUrl,
    });
  }
);

module.exports = router;