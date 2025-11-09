import connectDB from "@/lib/database";
import User from "@/models/User";
import { sendVerificationEmail } from "@/lib/emailService";

export async function POST(req) {
  await connectDB();

  try {
    const { email } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    // Generate 6-digit reset code as string
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    // Send reset code via email
    const emailSent = await sendVerificationEmail(
      user.email,
      resetToken,
      user.fullName || user.name
    );

    if (!emailSent) {
      return new Response(JSON.stringify({ error: "Failed to send email" }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify({ message: "Reset code sent" }), {
      status: 200,
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
