import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { amount, email } = req.body;

  if (!amount || !email) {
    return res.status(400).json({ error: "Amount and email required" });
  }

  try {
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: amount * 100,
        currency: "GHS",
        callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/paystack/callback?userId=${userId}`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Return authorization URL to frontend
    return res
      .status(200)
      .json({ authorization_url: response.data.data.authorization_url });
  } catch (err) {
    console.error(err.response?.data || err.message);
    return res.status(500).json({ error: "Payment initialization failed" });
  }
}
