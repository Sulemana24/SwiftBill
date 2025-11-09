import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Transaction from "@/models/Transaction";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    const {
      serviceType,
      network,
      recipient,
      description,
      package: packageMB,
      amount,
      reference,
      userId,
    } = (await req.body) ? await req.body : await req.json();

    if (!network || !recipient || !packageMB || !amount || !reference) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findById(userId);
    if (!user)
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );

    if (user.walletBalance < amount) {
      return NextResponse.json(
        { success: false, message: "Insufficient balance" },
        { status: 400 }
      );
    }

    // ✅ Call FastyData API
    const apiResponse = await fetch("https://fastydata.com/api_init", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.FASTY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        network,
        number: recipient,
        reference,
        package: packageMB,
      }),
    });

    const fastyResult = await apiResponse.json();

    if (fastyResult.code !== 200) {
      return NextResponse.json(
        { success: false, message: fastyResult.message || "Fasty API error" },
        { status: 400 }
      );
    }

    // Save transaction in MongoDB
    const transaction = await Transaction.create({
      user: user._id,
      type: serviceType,
      network,
      recipient,
      description,
      packageMB,
      reference,
      amount,
      status: "completed",
    });

    // Deduct user wallet
    user.walletBalance -= amount;
    await user.save();

    return NextResponse.json({
      success: true,
      transaction,
      walletBalance: user.walletBalance,
    });
  } catch (err) {
    console.error("Initiate purchase error:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
