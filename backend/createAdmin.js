const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
require("dotenv").config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB ✅");

    // Delete old admin if exists
    await User.deleteOne({ email: "superadmin@test.com" });

    // Hash password
    const passwordHash = await bcrypt.hash("SuperAdmin@2026", 10);

    // Create new admin
    const admin = new User({
      name: "Super Admin",
      email: "superadmin@test.com",
      password: passwordHash,
      role: "Admin",             // <-- MUST be exact
      contact_number: "0770000000",
      registered_date: new Date()
    });

    await admin.save();
    console.log("Admin created successfully ✅");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
