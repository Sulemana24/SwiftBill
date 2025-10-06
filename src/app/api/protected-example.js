import { verifyToken } from "../../lib/auth";
import cookie from "cookie";
import dbConnect from "../../lib/mongodb";

export default async function handler(req, res) {
  const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};
  const token = cookies.token;
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ error: "Invalid token" });

  await dbConnect();
  return res
    .status(200)
    .json({ message: "Protected data", userId: payload.sub, payload });
}
