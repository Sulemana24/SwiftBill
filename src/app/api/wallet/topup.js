import axios from "axios";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId, amount } = req.body;

  if (!userId || !amount || amount <= 0) {
    return res.status(400).json({ error: "Invalid user or amount" });
  }

  try {
    await dbConnect();

    // Find the user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Paystack expects amount in kobo (multiply by 100)
    const paystackAmount = Math.round(amount * 100);

    // Initialize Paystack transaction
    const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: user.email,
        amount: paystackAmount,
        metadata: {
          userId: user._id.toString(),
        },
        callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/wallet/verify`,
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Send authorization_url back to frontend
    res.status(200).json({
      authorization_url: response.data.data.authorization_url,
      reference: response.data.data.reference,
    });
  } catch (err) {
    console.error("Paystack topup error:", err.response?.data || err);
    res.status(500).json({ error: "Failed to initialize payment" });
  }
}
