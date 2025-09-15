import mongoose from "mongoose";

const MessageStatusSchema = new mongoose.Schema(
  {
    msgId: { type: String, required: true },
    status: String, 
    timestamp: String,
  },
  { timestamps: true }
);

export default mongoose.model("MessageStatus", MessageStatusSchema);
