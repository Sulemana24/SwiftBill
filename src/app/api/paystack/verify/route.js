import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import axios from "axios";

export async function POST(req) {
  try {
    const { reference, userId } = await req.json();

    if (!reference || !userId) {
      return new Response(
        JSON.stringify({ error: "Reference and userId required" }),
        { status: 400 }
      );
    }

    const { data } = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
      }
    );

    const payment = data.data;

    if (payment.status !== "success") {
      return new Response(JSON.stringify({ success: false }), { status: 200 });
    }

    await dbConnect();

    const user = await User.findById(userId);
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    const amountInGhs = payment.amount / 100;
    user.balance = (user.balance || 0) + amountInGhs;
    await user.save();

    return new Response(
      JSON.stringify({ success: true, newBalance: user.balance }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err.response?.data || err.message);
    return new Response(
      JSON.stringify({ error: "Payment verification failed" }),
      { status: 500 }
    );
  }
}
