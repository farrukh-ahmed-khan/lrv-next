"use client";
import { useEffect } from "react";
import axios from "axios";

export default function PayPalSubscriptionButton({ planId, dueId, }: { planId: string; dueId: string; }) {
  useEffect(() => {
    const containerId = "paypal-subscribe";
    const container = document.getElementById(containerId);
    if (!window.paypal || !container) return;

    container.innerHTML = "";

    const button = window.paypal.Buttons({
      createSubscription: async () => {
        try {
          const { data } = await axios.post("/api/paypal/subscribe", { plan_id: planId });
          return data.id;
        } catch (error) {
          console.error("Subscription creation failed", error);
        }
      },
      onApprove: async (data: any) => {
        console.log("Subscription approved", data);

        try {
          await axios.put(
            "/api/dues/mark-paid",
            {
              transactionId: data.subscriptionID,
              dueId,
              autoPay: true,
              subscriptionId: data.subscriptionID,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          alert("Subscription successful!");
        } catch (error) {
          console.error("Subscription update failed", error);
          alert("Subscription update failed");
        }
      },
      onError: (err: any) => {
        console.error("Subscription error", err);
        alert("Subscription error occurred");
      },
    });

    button.render(`#${containerId}`);
  }, [planId]);

  return <div id="paypal-subscribe"></div>;
}
