import mongoose from "mongoose";

const whatsappCredentialSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    wabaId: {
      type: String,
      required: true,
    },
    phoneNumberId: {
      type: String,
      required: true,
    },
    businessAccountId: {
      type: String,
    },
    displayName: {
      type: String,
    },
    displayNameStatus: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    accessToken: {
      type: String,
      required: true,
    },
    tokenExpiresAt: {
      type: Date, 
    },
    paymentMethodStatus: {
      type: String,
      enum: ["ATTACHED", "NOT_ATTACHED"],
      default: "NOT_ATTACHED",
    },
    webhookUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

const WhatsAppCredential = mongoose.model(
  "WhatsAppCredential",
  whatsappCredentialSchema
);

export default WhatsAppCredential;
