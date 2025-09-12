import mongoose from "mongoose";

const MessageStatusSchema = new mongoose.Schema(
  {
    msgId: { type: String, required: true },
    status: String, // delivered, read, failed
    timestamp: String,
  },
  { timestamps: true }
);

export default mongoose.model("MessageStatus", MessageStatusSchema);
