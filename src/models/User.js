import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },

    // Wallet balance
    balance: { type: Number, default: 0 },

    // Updated orders schema - REMOVE required: true
    orders: [
      {
        type: {
          type: String,
          // REMOVE: required: true,
          enum: ["internet", "sms", "electricity"],
        },
        description: {
          type: String,
          // REMOVE: required: true,
        },
        amount: {
          type: Number,
          // REMOVE: required: true,
        },
        recipient: {
          type: String,
          // REMOVE: required: true,
        },
        network: {
          type: String,
          enum: ["MTN", "Telecel", "AirtelTigo", null],
          default: null,
        },
        status: {
          type: String,
          enum: ["completed", "processing", "failed"],
          default: "completed",
        },
        date: {
          type: Date,
          default: Date.now,
        },
        orderNumber: {
          type: String,
          // REMOVE: required: true,
        },
        // Keep these for backward compatibility if needed
        productId: String,
        productName: String,
        price: Number,
        quantity: { type: Number, default: 1 },
      },
    ],
  },
  { timestamps: true }
);

// Hash password before save (only if it's new or modified)
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Instance method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Prevent model overwrite upon hot reload in dev
const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
