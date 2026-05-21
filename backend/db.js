const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = (process.env.MONGO_URI || "").trim();

    if (!uri) {
      console.error("MONGO_URI is not set. Check your .env file.");
      process.exit(1);
    }

    await mongoose.connect(uri);

    console.log("MongoDB Connected ✅");
  } catch (err) {
    console.error("Database connection error ❌:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;