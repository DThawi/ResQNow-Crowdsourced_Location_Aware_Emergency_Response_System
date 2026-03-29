require('dotenv').config({ path: '../.env' });

const mongoose = require('mongoose');
const Authority = require('../models/Authority');

console.log("MONGO URI:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch(err => console.log(err));

const authorities = [
  {
    name: "Colombo Police",
    type: "Police",
    districts: ["Colombo"]
  }
];

const seedData = async () => {
  try {
    await Authority.deleteMany();
    await Authority.insertMany(authorities);
    console.log("✅ Data inserted");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();