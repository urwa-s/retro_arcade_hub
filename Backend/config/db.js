const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    //const connString = 'mongo';

    await mongoose.connect(connString);
    console.log("MongoDB connected 🚀");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
