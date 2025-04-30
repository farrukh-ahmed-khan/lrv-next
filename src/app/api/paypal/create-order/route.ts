// app/api/paypal/create-order/route.ts
import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/paypal";

export async function POST(req: Request) {
  const { amount } = await req.json();
  try {
    const accessToken = await getAccessToken();

    const res = await fetch(
      "https://api-m.sandbox.paypal.com/v2/checkout/orders",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: "USD",
                value: amount.toString(),
              },
            },
          ],
          application_context: {
            shipping_preference: "NO_SHIPPING", // 👈 disables shipping
            user_action: "PAY_NOW",
            return_url: "https://yourdomain.com/success",
            cancel_url: "https://yourdomain.com/cancel",
          },
        }),
      }
    );

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
