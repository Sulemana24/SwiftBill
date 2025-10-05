// pages/api/auth/login.js
import dbConnect from "../../../lib/mongodb";
import User from "../../../models/User";
import bcrypt from "bcryptjs";
import { signToken, setTokenCookie } from "../../../lib/auth";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { email, password } = req.body ?? {};
  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });

  try {
    await dbConnect();
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) return res.status(401).json({ error: "Invalid credentials" });

    const token = signToken({
      sub: user._id,
      email: user.email,
      name: user.name,
    });

    setTokenCookie(res, token);

    return res.status(200).json({
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
