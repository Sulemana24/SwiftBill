// /pages/api/paystack/callback.js
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export default async function handler(req, res) {
  const { reference, userId } = req.query;

  if (!reference || !userId)
    return res.status(400).send("Missing reference or userId");

  try {
    // Verify payment with Paystack
    const verifyRes = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const verifyData = await verifyRes.json();

    if (!verifyData.status || verifyData.data.status !== "success") {
      return res.status(400).send("Payment not successful");
    }

    await dbConnect();
    const user = await User.findById(userId);

    if (!user) return res.status(404).send("User not found");

    const amount = verifyData.data.amount / 100; // Convert kobo to Ghc
    user.walletBalance = (user.walletBalance || 0) + amount;
    await user.save();

    // Redirect to dashboard
    return res.redirect("/dashboard?topup=success");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
}
