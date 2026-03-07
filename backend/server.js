require('dotenv').config();
const express = require("express");
const connectDB = require('./db');
const User = require('./models/User');

const authRoutes = require("./routes/authRoutes");

const app = express();

// Connect DB
connectDB();

app.use(express.json());

// Auth routes
app.use("/api/auth", authRoutes);

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});