/* import dbConnect from "../../../lib/mongodb";
import User from "../../../models/User";
import { verifyToken } from "../../../lib/auth";
import cookie from "cookie";

export default async function handler(req, res) {
  try {
    await dbConnect();

    const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};
    const token = cookies.token || null;

    if (!token) return res.status(200).json({ user: null });

    const payload = verifyToken(token);
    if (!payload) {
      return res.status(200).json({ user: null });
    }

    const user = await User.findById(payload.sub).select("-password");
    if (!user) return res.status(200).json({ user: null });

    return res.status(200).json({ user });
  } catch (err) {
    console.error("Me error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
 */
