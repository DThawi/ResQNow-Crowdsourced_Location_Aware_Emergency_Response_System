require("dotenv").config();
const express = require("express");
const connectDB = require("./db"); // your MongoDB connection file
const User = require("./models/User");

// Route imports
const authRoutes = require("./routes/authRoutes.js");
<<<<<<< HEAD
const incidentRoutes = require("./routes/incidentRoutes.js");
const reportRoutes = require("./routes/reportRoutes.js");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();

// Root endpoint
=======

const incidentRoutes = require('./routes/incidentRoutes.js');



const app = express();

// Connect DB
connectDB();

app.use(express.json());

// Auth routes
app.use("/api/auth", authRoutes);

app.use('/api/incidents', incidentRoutes);



>>>>>>> 5fdde7215c038add9ba1f37797c797cefdb53198
app.get("/", (req, res) => {
  res.send("ResQNow backend running");
});

// TEMPORARY: Reset admin password safely (only for testing)
app.get("/reset-admin-password", async (req, res) => {
  const bcrypt = require("bcryptjs");
  try {
    const admin = await User.findOne({ email: "admin@test.com" });
    if (!admin) return res.status(404).send("Admin not found");

    admin.password = await bcrypt.hash("123456", 10); // reset password
    await admin.save();

    res.send("Admin password reset to 123456 ✅");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error resetting password");
  }
});

// Test DB endpoint
app.get("/test-db", async (req, res) => {
  // ...
});

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/incident", incidentRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/upload", uploadRoutes);

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
    console.error("Database error ❌:", err.message);
    res.status(500).send("Error reading from database");
  }
});

// Server start function
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB(); // wait for DB connection
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} ✅`);
    });
  } catch (err) {
    console.error("Failed to start server ❌:", err.message);
    process.exit(1);
  }
};

// Only start server if not testing
if (process.env.NODE_ENV !== "test") {
  startServer();
}

<<<<<<< HEAD
// Export app for testing
module.exports = app;
=======
module.exports = app;
>>>>>>> 5fdde7215c038add9ba1f37797c797cefdb53198
