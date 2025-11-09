import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    balance: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String, default: null },
    verificationCodeExpires: { type: Date, default: null },
    orders: [
      {
        type: {
          type: String,
          enum: ["internet", "sms", "electricity"],
        },
        description: String,
        amount: Number,
        recipient: String,
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
        date: { type: Date, default: Date.now },
        orderNumber: String,
        productId: String,
        productName: String,
        price: Number,
        quantity: { type: Number, default: 1 },
      },
    ],
  },
  { timestamps: true }
);

// Hash password only if it's new or modified
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  if (this.password.startsWith("$2a$")) return next(); // already hashed

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
