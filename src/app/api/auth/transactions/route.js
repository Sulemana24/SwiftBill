import { NextResponse } from "next/server";
import connectDB from "@/lib/database";
import Transaction from "@/models/Transaction";
import { protect } from "@/lib/auth";

export async function GET(request) {
  try {
    await connectDB();
    const user = await protect(request);

    const transactions = await Transaction.find({ user: user._id })
      .sort({ createdAt: -1 })
      .limit(10);

    return NextResponse.json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 401 }
    );
  }
}
