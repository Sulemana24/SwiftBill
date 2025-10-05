import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["internet", "sms", "electricity", "topup"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    recipient: {
      type: String,
      required: true,
    },
    network: {
      type: String,
      enum: ["MTN", "Telecel", "AirtelTigo", null],
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    description: {
      type: String,
      required: true,
    },
    transactionId: {
      type: String,
      unique: true,
    },
    meterNumber: {
      type: String,
    },
    electricityType: {
      type: String,
      enum: ["prepaid", "postpaid", null],
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Generate transaction ID before saving
transactionSchema.pre("save", function (next) {
  if (!this.transactionId) {
    this.transactionId =
      "SWI" +
      Date.now() +
      Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  next();
});

export default mongoose.models.Transaction ||
  mongoose.model("Transaction", transactionSchema);
