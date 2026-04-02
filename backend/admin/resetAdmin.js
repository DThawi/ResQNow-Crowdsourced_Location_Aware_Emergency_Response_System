const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
require("dotenv").config();

async function resetAdminPassword() {
  await mongoose.connect(process.env.MONGO_URI);

  const admin = await User.findOne({ email: "admin@test.com" });
  if (!admin) {
    console.log("Admin user not found!");
    process.exit();
  }

  const newPassword = "123456"; // password you want
  admin.password = await bcrypt.hash(newPassword, 10);
  await admin.save();

  console.log(`Admin password reset to "${newPassword}" successfully!`);
  mongoose.disconnect();
}

resetAdminPassword();