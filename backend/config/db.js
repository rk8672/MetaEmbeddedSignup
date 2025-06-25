require('dotenv').config();
const mongoose = require("mongoose");

const connectToMongo = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Radha Krishna Singh - MongoDB Database connection successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }

  // Add an error event listener to handle unhandled errors
  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });
}

module.exports = connectToMongo;
