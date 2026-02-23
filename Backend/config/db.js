const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // OLD (Failed): 'mongodb+srv://mat:mat@masteratwork...'
    
    // NEW (Try this format):
    // It will look like this (copy yours from the dashboard!):
    const connString = 'mongodb://mat:mat@masteratwork-shard-00-00.ujdxlib.mongodb.net:27017,masteratwork-shard-00-01.ujdxlib.mongodb.net:27017,masteratwork-shard-00-02.ujdxlib.mongodb.net:27017/retro?ssl=true&replicaSet=atlas-xyz-shard-0&authSource=admin&retryWrites=true&w=majority';

    await mongoose.connect(connString);
    console.log("MongoDB connected 🚀");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;