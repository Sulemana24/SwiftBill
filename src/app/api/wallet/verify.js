import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { reference, userId } = req.body;

  if (!reference || !userId) {
    return res.status(400).json({ error: "Missing reference or userId" });
  }

  try {
    await dbConnect();

    // Verify payment with Paystack
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${paystackSecret}`,
        },
      }
    );

    const data = await response.json();

    if (!data.status) {
      return res
        .status(400)
        .json({ success: false, message: "Payment verification failed" });
    }

    const amountPaid = data.data.amount / 100; // Convert kobo to cedis

    // Update user's balance in MongoDB
    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    user.balance = (user.balance || 0) + amountPaid;
    await user.save();

    return res.status(200).json({ success: true, newBalance: user.balance });
  } catch (error) {
    console.error("Paystack verification error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
