import axios from "axios";

export async function POST(req) {
  try {
    const { amount, email, userId } = await req.json();
    if (!amount || !email || !userId) {
      return new Response(JSON.stringify({ error: "Missing data" }), {
        status: 400,
      });
    }

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: amount * 100,
        currency: "GHS",
        callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/callback?userId=${userId}`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return new Response(
      JSON.stringify({
        authorization_url: response.data.data.authorization_url,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err.response?.data || err.message);
    return new Response(
      JSON.stringify({ error: "Payment initialization failed" }),
      { status: 500 }
    );
  }
}
