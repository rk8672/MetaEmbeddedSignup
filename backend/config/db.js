import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const connectToMongo = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(" Radha Krishna Singh - MongoDB Database connection successfully");
  } catch (error) {
    console.error(" Error connecting to MongoDB:", error);
  }

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
  });
};

export default connectToMongo;
