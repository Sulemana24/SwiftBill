import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import crypto from "crypto";

export async function POST(req) {
  try {
    const { fullName, email, password } = await req.json();

    if (!fullName || !email || !password) {
      return new Response(JSON.stringify({ error: "All fields required" }), {
        status: 400,
      });
    }

    await dbConnect();

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return new Response(JSON.stringify({ error: "Email already in use" }), {
        status: 409,
      });
    }

    const verificationCode = crypto.randomInt(100000, 999999).toString();
    const verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    // ✅ Do NOT hash manually. Let Mongoose pre-save hook handle it.
    const user = await User.create({
      name: fullName, // matches your model field
      email: email.toLowerCase().trim(),
      password, // plain text — model hook will hash it once
      verificationCode,
      verificationCodeExpires,
    });

    // ⚠️ Send email here (e.g. via nodemailer)
    console.log(`Verification code for ${email}: ${verificationCode}`);

    return new Response(
      JSON.stringify({
        message: "Signup successful. Check your email for verification code.",
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
