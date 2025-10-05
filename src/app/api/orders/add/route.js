// /api/orders/add.js
import dbConnect from "@/lib/mongodb";
import User from "../../../../models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    const {
      userId,
      type,
      description,
      amount,
      recipient,
      status,
      date,
      network,
      orderNumber,
    } = await req.json();

    console.log("🔄 Received order data:", {
      userId,
      type,
      description,
      amount,
      recipient,
      status,
      network,
      orderNumber,
    });

    // Validate required fields
    if (!userId || !type || !description || !amount || !recipient || !status) {
      return NextResponse.json(
        { error: "All order fields are required" },
        { status: 400 }
      );
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("🔄 User found, current balance:", user.balance);

    // Check wallet balance
    if (user.balance < amount) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );
    }

    // Create new order with the correct variable names
    const newOrder = {
      type,
      description,
      amount,
      recipient,
      network: network || null,
      status,
      date: date || new Date(),
      orderNumber:
        orderNumber || `SWI${Math.floor(100000 + Math.random() * 900000)}`,
      // Optional: Keep old fields for backward compatibility
      productId: `SWI${Math.floor(100000 + Math.random() * 900000)}`,
      productName: description,
      price: amount,
      quantity: 1,
    };

    console.log("🔄 Creating new order:", newOrder);

    // Push order to user
    user.orders.push(newOrder);

    // Deduct from wallet balance
    user.balance -= amount;

    console.log("🔄 New user balance:", user.balance);

    await user.save();

    console.log("✅ Order saved successfully");

    return NextResponse.json({
      message: "Order added successfully",
      order: newOrder,
      balance: user.balance,
    });
  } catch (err) {
    console.error("❌ Add order error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
