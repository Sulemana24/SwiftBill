import { NextResponse } from "next/server";
import connectDB from "@/lib/database";
import Transaction from "@/models/Transaction";
import User from "@/models/User";
import { protect } from "@/lib/auth";

export async function POST(request) {
  try {
    await connectDB();
    const user = await protect(request);

    const {
      type,
      amount,
      recipient,
      network,
      description,
      meterNumber,
      electricityType,
    } = await request.json();

    // Check user balance
    if (amount > user.walletBalance) {
      return NextResponse.json(
        { success: false, message: "Insufficient balance" },
        { status: 400 }
      );
    }

    // Create transaction
    const transaction = await Transaction.create({
      user: user._id,
      type,
      amount,
      recipient,
      network,
      description,
      meterNumber,
      electricityType,
      status: "completed",
    });

    // Update user balance
    await User.findByIdAndUpdate(user._id, {
      $inc: { walletBalance: -amount },
    });

    // Get updated user
    const updatedUser = await User.findById(user._id);

    return NextResponse.json(
      {
        success: true,
        data: {
          transaction,
          user: {
            walletBalance: updatedUser.walletBalance,
          },
        },
        message: "Purchase successful",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}
