"use client";
import { useEffect } from "react";
import axios from "axios";
import { useRouter } from 'next/navigation';
import toast from "react-hot-toast";

declare global {
  interface Window {
    paypal: any;
  }
}


export default function PayPalOneTimeButton({
  amount,
  dueId,
}: {
  amount: number;
  dueId: string;
}) {


  const router = useRouter()

  useEffect(() => {
    const containerId = `paypal-button-${dueId}`;
    const container = document.getElementById(containerId);
    if (!window.paypal || !container) return;

    container.innerHTML = "";

    const button = window.paypal
      .Buttons({
        createOrder: async () => {
          try {
            const { data } = await axios.post("/api/paypal/create-order", { amount });
            return data.id;
          } catch (error) {
            console.error("Create order failed", error);
          }
        },
        onApprove: async (data: any) => {
          try {
            const res = await axios.post("/api/paypal/capture-order", {
              orderId: data.orderID,
            });

            await axios.put(
              "/api/dues/mark-paid",
              {
                transactionId: res.data.id,
                dueId,
                autoPay: false,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`
                },
              }
            );

            toast.success("Payment Success");
            router.push(`/`)
            window.location.reload()
          } catch (error: any) {
            toast.error("Payment failed", error);
            alert("Payment failed");
          }
        },
        onError: (err: any) => {
          console.error("PayPal error", err);
          alert("Payment error occurred");
        },
      });

    button.render(`#${containerId}`);
  }, [amount, dueId]);

  return <div id={`paypal-button-${dueId}`}></div>;
}
