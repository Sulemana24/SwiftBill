import dbConnect from "@/lib/mongodb";
import User from "../../../../models/User";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ orders: user.orders || [] });
  } catch (err) {
    console.error("Fetch orders error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
