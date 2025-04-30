// app/api/paypal/capture-order/route.ts
import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/paypal";

export async function POST(req: Request) {
  const { orderId } = await req.json();
  try {
    const accessToken = await getAccessToken();

    const res = await fetch(
      `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to capture order" },
      { status: 500 }
    );
  }
}
