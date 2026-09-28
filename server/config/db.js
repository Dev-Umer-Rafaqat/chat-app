const mongoose = require("mongoose");
const { MONGO_URI } = require("./env");
const Conversation = require("../models/Conversation");

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    await Conversation.syncIndexes();
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

module.exports = connectDB;
