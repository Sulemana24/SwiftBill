import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import crypto from "crypto";

// Example placeholder for sending email
async function sendVerificationEmail(email, code, name) {
  try {
    console.log(`Sending verification code ${code} to ${email} for ${name}`);
    // Replace with actual email service integration
    return true;
  } catch (err) {
    console.error("Email sending failed:", err);
    return false;
  }
}

export async function POST(req) {
  try {
    console.log("Received signup request");
    const { fullName, email, password } = await req.json();
    console.log("Request body:", { fullName, email, password });

    // Validate input
    if (!fullName || !email || !password) {
      console.warn("Validation failed: missing fields");
      return new Response(JSON.stringify({ error: "All fields required" }), {
        status: 400,
      });
    }

    // Connect to DB
    await dbConnect();
    console.log("MongoDB connected");

    // Check for existing user
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      console.warn("Email already in use:", email);
      return new Response(JSON.stringify({ error: "Email already in use" }), {
        status: 409,
      });
    }

    // Generate verification code
    const verificationCode = crypto.randomInt(100000, 999999).toString();
    const verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000);

    const userData = {
      fullName: fullName,
      email: email.toLowerCase().trim(),
      password,
      verificationCode,
      verificationCodeExpires,
      balance: 0,
      orders: [],
      isVerified: false,
    };
    console.log("Creating user with data:", userData);

    // Create user
    let user;
    try {
      user = await User.create(userData);
      console.log("User created successfully with ID:", user._id);
    } catch (mongooseErr) {
      console.error("Mongoose error while creating user:", mongooseErr);
      return new Response(
        JSON.stringify({ error: "Database validation failed" }),
        {
          status: 500,
        }
      );
    }

    // Send verification email
    const emailSent = await sendVerificationEmail(
      email,
      verificationCode,
      fullName
    );
    if (!emailSent) {
      console.error("Failed to send verification email, deleting user");
      await User.findByIdAndDelete(user._id);
      return new Response(
        JSON.stringify({
          error: "Failed to send verification email. Try again.",
        }),
        { status: 500 }
      );
    }

    // Success response
    return new Response(
      JSON.stringify({
        message: "Signup successful. Check your email for verification code.",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isVerified: user.isVerified,
        },
      }),
      { status: 201 }
    );
  } catch (err) {
    console.error("Unexpected signup error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
