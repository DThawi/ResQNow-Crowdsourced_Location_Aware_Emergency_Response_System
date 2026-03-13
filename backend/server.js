require('dotenv').config();
const express = require("express");
const connectDB = require('./db');
const User = require('./models/User');

const authRoutes = require("./routes/authRoutes.js");

const incidentRoutes = require('./routes/incidentRoutes.js');

const reportRoutes = require("./routes/reportRoutes.js");

const app = express();

// Connect DB
connectDB();

app.use(express.json());

// Auth routes
app.use("/api/auth", authRoutes);

app.use('/api/incidents', incidentRoutes);

app.use("/api/reports", reportRoutes);

app.get("/", (req, res) => {
  res.send("ResQNow backend running");
});

// Test database
app.get("/test-db", async (req, res) => {
  try {
    const allUsers = await User.find();
    res.json(allUsers);
  } catch (err) {
    res.status(500).send("Error reading from database");
  }
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
