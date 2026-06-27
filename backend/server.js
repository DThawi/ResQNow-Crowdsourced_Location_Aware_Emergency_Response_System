require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const User = require("./models/User");
const heatmapRoutes = require("./routes/heatmapRoutes");

// Route imports
const authRoutes = require("./routes/authRoutes.js");
const incidentRoutes = require("./routes/incidentRoutes.js");
const uploadRoutes = require("./routes/uploadRoutes");
const adminRoutes = require("./routes/adminRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const notificationRoutes = require("./routes/notificationRoutes.js"); 

const path = require("path");
const app = express();

app.use(cors());
app.use(express.json());

// UNIFIED HTTP CONTEXT CONTAINER FOR SOCKET.IO
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST", "PUT", "DELETE"]
  },
  transports: ["websocket"]
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log(`📡 Socket connection established with device token: ${socket.id}`);
  
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`👤 Secure communications room mapped for User ID: ${userId}`);
  });

  socket.on("disconnect", (reason) => {
    console.log(`🔌 Device connection dropped: ${reason}`);
  });
});

// Routes Registration
app.use("/api/auth", authRoutes);
app.use("/api/incidents", incidentRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/heatmap", heatmapRoutes);
app.use("/api/notifications", notificationRoutes); // 🎯 Bound perfectly to /api/notifications

// Root endpoint
app.get("/", (req, res) => {
  res.send("ResQNow backend running with active socket engine layers.");
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
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Unified real-time server deployed publicly on port ${PORT}`);
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
