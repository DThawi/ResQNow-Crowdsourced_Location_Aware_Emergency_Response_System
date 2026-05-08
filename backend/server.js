require("dotenv").config();
const express = require("express");
const connectDB = require("./db");
const User = require("./models/User");

// Route imports
const authRoutes = require("./routes/authRoutes.js");
const incidentRoutes = require("./routes/incidentRoutes.js");
const uploadRoutes = require("./routes/uploadRoutes");
const adminRoutes = require("./routes/adminRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/incidents", incidentRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/analytics", analyticsRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.send("ResQNow backend running");
});

// Test DB endpoint
app.get("/test-db", async (req, res) => {
  try {
    const allUsers = await User.find();
    res.json(allUsers);
  } catch (err) {
    console.error("Database error :", err.message);
    res.status(500).send("Error reading from database");
  }
});

// Server start
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} `);
    });
  } catch (err) {
    console.error("Failed to start server :", err.message);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== "test") {
  startServer();
} else {
  connectDB();
}

module.exports = app;
