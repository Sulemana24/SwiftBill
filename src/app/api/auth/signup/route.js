import dbConnect from "@/lib/mongodb";
import User from "../../../../models/User";
import { generateToken } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/emailService";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req) {
  try {
    await dbConnect();
    const {
      fullName = "",
      email,
      password,
      confirmPassword,
    } = await req.json();

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: "Full name, email and password are required" },
        { status: 400 }
      );
    }

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    if (confirmPassword && password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate 6-digit verification code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Create user with verification fields
    const user = new User({
      name: fullName,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      balance: 0,
      orders: [],
      isVerified: false,
      verificationCode,
      verificationCodeExpires,
    });

    await user.save();

    // Send verification email
    const emailSent = await sendVerificationEmail(
      email,
      verificationCode,
      fullName
    );

    if (!emailSent) {
      // If email fails, delete the user and return error
      await User.findByIdAndDelete(user._id);
      return NextResponse.json(
        { error: "Failed to send verification email. Please try again." },
        { status: 500 }
      );
    }

    // Don't generate token or set cookie since user isn't verified yet
    // Return success response without authentication
    return NextResponse.json(
      {
        success: true,
        message:
          "Account created successfully! Please check your email for the verification code.",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isVerified: user.isVerified,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Signup error details:", err.message, err.stack);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
