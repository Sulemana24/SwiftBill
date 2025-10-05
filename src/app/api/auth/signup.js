// pages/api/auth/signup.js
import dbConnect from "../../../lib/mongodb";
import User from "../../../models/User";
import bcrypt from "bcryptjs";
import { signToken, setTokenCookie } from "../../../lib/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, password } = req.body ?? {};

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Name, email and password are required" });
  }

  try {
    await dbConnect();

    // Prevent duplicate users
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: "Email already in use" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashed,
    });

    // create token payload (avoid sending password)
    const token = signToken({
      sub: user._id,
      email: user.email,
      name: user.name,
    });

    // Set httpOnly cookie
    setTokenCookie(res, token);

    // return safe user object
    return res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
