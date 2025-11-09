// app/api/data/route.js
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { network, number, reference, package: dataPackage } = body;

    // Simple validation
    if (!network || !number || !reference || !dataPackage) {
      return NextResponse.json(
        {
          error:
            "All fields (network, number, reference, package) are required.",
        },
        { status: 400 }
      );
    }

    const API_KEY = process.env.API_KEY;
    const BASE_URL = process.env.API_BASE_URL;

    // Send to FastyData API
    const response = await fetch(`${BASE_URL}/api_init`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        network,
        number,
        reference,
        package: parseInt(dataPackage),
      }),
    });

    const result = await response.json();

    // Return the provider's response to the client
    return NextResponse.json(result);
  } catch (error) {
    console.error("FastyData error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
