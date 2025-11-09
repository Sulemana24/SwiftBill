import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { signToken, setTokenCookie } from "@/lib/auth";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password required" }),
        { status: 400 }
      );
    }

    await dbConnect();
    const emailLower = email.trim().toLowerCase();
    const user = await User.findOne({ email: emailLower });

    if (!user)
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
      });

    if (!user.isVerified) {
      return new Response(
        JSON.stringify({ error: "Please verify your email before logging in" }),
        { status: 403 }
      );
    }

    const matched = await user.comparePassword(password);
    if (!matched)
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
      });

    const token = signToken({
      sub: user._id,
      email: user.email,
      fullName: user.fullName,
    });

    const res = new Response(
      JSON.stringify({
        user: { id: user._id, name: user.fullName, email: user.email },
        token,
      }),
      { status: 200 }
    );

    setTokenCookie(res, token);
    return res;
  } catch (err) {
    console.error("Login error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
