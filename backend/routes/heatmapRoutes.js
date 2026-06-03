const express = require("express");

const router = express.Router();

const {
  getHeatmapData,
} = require("../controllers/heatmapController");

router.get("/", getHeatmapData);

module.exports = router;