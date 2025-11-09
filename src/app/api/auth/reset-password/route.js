import connectDB from "@/lib/database";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  await connectDB();

  try {
    const { email, code, newPassword } = await req.json();

    if (!email || !code || !newPassword) {
      return new Response(
        JSON.stringify({ error: "Email, code, and new password are required" }),
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    // Debug logs
    console.log("Reset token in DB:", user.resetToken);
    console.log("Code entered:", code);
    console.log("Token expiry:", user.resetTokenExpiry, "Now:", Date.now());

    if (!user.resetToken || user.resetToken.toString() !== code.toString()) {
      return new Response(JSON.stringify({ error: "Invalid reset code" }), {
        status: 400,
      });
    }

    if (Date.now() > user.resetTokenExpiry) {
      return new Response(JSON.stringify({ error: "Reset code expired" }), {
        status: 400,
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    if (!user.isVerified) {
      user.isVerified = true;
    }

    // Clear reset token fields
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    return new Response(
      JSON.stringify({ message: "Password reset successfully" }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Reset password error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
