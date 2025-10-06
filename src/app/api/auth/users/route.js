import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export default async function handler(req, res) {
  await dbConnect();
  const { id } = req.query;

  if (req.method === "GET") {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });
    return res
      .status(200)
      .json({ balance: user.balance || 0, name: user.name, email: user.email });
  }
  res.status(405).json({ error: "Method not allowed" });
}
