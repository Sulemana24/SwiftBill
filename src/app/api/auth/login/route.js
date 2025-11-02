import dbConnect from "@/lib/mongodb";
import User from "../../../../models/User";
import { generateToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    console.log("=== LOGIN ATTEMPT STARTED ===");

    await dbConnect();
    console.log("✅ Database connected");

    const { email, password } = await req.json();

    console.log("📧 Login attempt for:", email);
    console.log("🔑 Password length:", password ? password.length : "missing");

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    console.log("🔍 Searching for user with email:", cleanEmail);

    const user = await User.findOne({ email: cleanEmail });
    console.log("👤 User found:", user ? "Yes" : "No");

    if (!user) {
      console.log("❌ No user found with email:", cleanEmail);
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    console.log("✅ User details:", {
      id: user._id,
      name: user.name,
      email: user.email,
      hasPassword: !!user.password,
      passwordStartsWith: user.password
        ? user.password.substring(0, 10) + "..."
        : "none",
      isHashed: user.password ? user.password.startsWith("$2b$") : false,
      isVerified: user.isVerified, // Add this line
    });

    // Check if email is verified
    if (!user.isVerified) {
      console.log("❌ User email not verified:", cleanEmail);
      return NextResponse.json(
        { error: "Please verify your email before logging in" },
        { status: 401 }
      );
    }

    // Use bcrypt.compare directly (same method used in signup)
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔐 Password match result:", isMatch);

    if (!isMatch) {
      console.log("❌ Password does not match for:", cleanEmail);
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    console.log("✅ Password verified successfully");

    // Generate token
    const tokenPayload = {
      id: user._id.toString(),
      email: user.email,
    };
    const token = generateToken(tokenPayload);
    console.log("🎫 Token generated successfully");

    // Create response
    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        balance: user.balance || 0,
        orders: user.orders || [],
      },
      token,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      secure: process.env.NODE_ENV === "production",
    });

    console.log("🎉 LOGIN SUCCESSFUL for:", user.email);
    return response;
  } catch (err) {
    console.error("💥 LOGIN ERROR:", err);
    console.error("Error details:", err.message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
