// /app/api/paypal/webhook/route.ts
import { NextResponse } from "next/server";
import Dues from "@/lib/models/Dues";
import User from "@/lib/models/User"; // if needed to associate user
import { client } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    await client;

    const body = await req.json();

    if (body.event_type === "BILLING.SUBSCRIPTION.PAYMENT.SUCCEEDED") {
      const subscriptionId = body.resource.subscription_id;
      const transactionId = body.resource.id;
      const amount = body.resource.amount.value;

      // Here you must map `subscriptionId` to the user or due
      // You could store `subscriptionId` when a user subscribes

      // Example: find the due linked to this subscription
      const due = await Dues.findOneAndUpdate(
        { subscriptionId, paid: false }, // match unpaid recent due
        { paid: true, transactionId, autoPay: true },
        { new: true }
      );

      if (!due) {
        return NextResponse.json(
          { message: "Due not found for subscription ID" },
          { status: 404 }
        );
      }

      return NextResponse.json({ message: "Due auto-paid", due });
    }

    return NextResponse.json({ message: "Event ignored" });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { message: "Webhook handler failed", error: error.message },
      { status: 500 }
    );
  }
}
