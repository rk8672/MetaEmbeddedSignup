import mongoose from "mongoose";

const IncomingMessageSchema = new mongoose.Schema(
  {
    msgId: { type: String, required: true, unique: true },
    from: String,
    type: String,
    text: String,
    timestamp: String,
  },
  { timestamps: true }
);

export default mongoose.model("IncomingMessage", IncomingMessageSchema);
