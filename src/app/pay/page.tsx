"use client"
import PayPalOneTimeButton from "@/components/ui/PayPalOneTimeButton";
import PayPalSubscriptionButton from "@/components/ui/PayPalSubscriptionButton";
import axios from "axios";
import { useEffect, useState } from "react";


type Due = {
    _id: string;
    amount: number;
    paid: boolean;
};
export default function PayPage() {

    const [dues, setDues] = useState<Due[]>([]);

    useEffect(() => {
        const fetchDues = async () => {
            try {
                const res = await axios.get("/api/dues/get", {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                    },
                });
                setDues(res.data.due);
            } catch (error: any) {
                console.error("Failed to fetch dues", error.res);
            }
        };

        fetchDues();
    }, []);


    return (
        <div>
            <h1 className="pt-5">Pay Your Dues</h1>

            <h2>One-Time Payment</h2>

            {dues.map((due) => (

                <div key={due._id} className="due-card" >
                    <p>Amount: ${due.amount}</p>
                    <p>Status: {due.paid ? "Paid" : "Unpaid"}</p>
                    {!due.paid && (
                        <PayPalOneTimeButton amount={due.amount} dueId={due._id} />
                    )}
                </div>
            ))}


            <h2>Auto-Pay Subscription</h2>
            <PayPalSubscriptionButton planId="P-PLAN_ID_FROM_PAYPAL" />
        </div>
    );
}
