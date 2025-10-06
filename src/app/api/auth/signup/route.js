import dbConnect from "@/lib/mongodb";
import User from "../../../../models/User";
import { generateToken } from "@/lib/auth";
import { NextResponse } from "next/server";

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

    const user = new User({
      name: fullName,
      email: email.toLowerCase().trim(),
      password,
      balance: 0,
      orders: [],
    });

    await user.save();

    const token = generateToken({ id: user._id, email: user.email });

    const res = NextResponse.json({
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });

    res.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      secure: process.env.NODE_ENV === "production",
    });

    return res;
  } catch (err) {
    console.error("Signup error details:", err.message, err.stack);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
