import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return new Response(
        JSON.stringify({ error: "Email and verification code required" }),
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findOne({ email });
    if (!user)
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });

    if (user.isVerified)
      return new Response(JSON.stringify({ message: "Already verified" }), {
        status: 200,
      });

    if (
      user.verificationCode !== code ||
      !user.verificationCodeExpires ||
      new Date() > new Date(user.verificationCodeExpires)
    ) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired code" }),
        { status: 400 }
      );
    }

    await User.updateOne(
      { email },
      {
        $set: {
          isVerified: true,
          verificationCode: null,
          verificationCodeExpires: null,
        },
      }
    );

    return new Response(
      JSON.stringify({ message: "Email verified successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Verification error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
