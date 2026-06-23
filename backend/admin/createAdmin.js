const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");
const User = require("../models/User");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB ✅");

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error("❌ Error: ADMIN_EMAIL and ADMIN_PASSWORD must be defined in the environment variables (.env file).");
      process.exit(1);
    }

    // Delete old admin if exists
    await User.deleteOne({ email: adminEmail });

    // Hash password
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    // Create new admin
    const admin = new User({
      name: "Super Admin",
      email: adminEmail,
      password: passwordHash,
      role: "Admin",             // <-- MUST be exact
      contact_number: "0770000000",
      registered_date: new Date(),
      location: {
        type: 'Point',
        coordinates: [0, 0] // Dummy coordinates to satisfy schema validation
      }
    });

    await admin.save();
    console.log("Admin created successfully ✅");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
