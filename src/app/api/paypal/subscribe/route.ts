import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/paypal";

export async function POST(req: Request) {
  const { plan_id } = await req.json(); 
  try {
    const accessToken = await getAccessToken();

    const res = await fetch(
      "https://api-m.sandbox.paypal.com/v1/billing/subscriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan_id,
          application_context: {
            shipping_preference: "NO_SHIPPING",
            brand_name: "Dues Management",
            user_action: "SUBSCRIBE_NOW",
            return_url: "https://yourdomain.com/success",
            cancel_url: "https://yourdomain.com/cancel",
          },
        }),
      }
    );

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Subscription failed" }, { status: 500 });
  }
}
