// /app/api/auth/resend-verification/route.js
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { sendVerificationEmail } from "@/lib/emailService";
import crypto from "crypto";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
      });
    }

    await dbConnect();

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    if (user.isVerified) {
      return new Response(
        JSON.stringify({ error: "Email is already verified" }),
        { status: 400 }
      );
    }

    const verificationCode = crypto.randomInt(100000, 999999).toString();
    user.verificationCode = verificationCode;
    user.verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000);

    await user.save();

    const emailSent = await sendVerificationEmail(
      email,
      verificationCode,
      user.name
    ); // use your schema field
    if (!emailSent) {
      return new Response(
        JSON.stringify({ error: "Failed to send verification email" }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Verification code sent successfully",
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Resend verification error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
