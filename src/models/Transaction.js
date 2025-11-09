import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, required: true },
  network: String,
  recipient: String,
  description: String,
  packageMB: Number,
  reference: String,
  amount: Number,
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Transaction ||
  mongoose.model("Transaction", transactionSchema);
