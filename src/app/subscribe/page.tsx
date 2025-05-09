"use client";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import PayPalOneTimeButton from "@/components/ui/PayPalOneTimeButton";
import PayPalSubscriptionButton from "@/components/ui/PayPalSubscriptionButton";
import ProtectedPage from '@/components/ProtectedPage';
import Header from '@/components/layout/Navbar';
import InnerBanner from '@/components/ui/InnerBanner';
import Footer from '@/components/layout/Footer';


type Due = {
    _id: string;
    amount: number;
    paid: boolean;
    createdAt: string;
};

export default function PayPage() {
    const searchParams = useSearchParams();
    const dueId = searchParams.get("dueId");

    const [due, setDue] = useState<Due | null>(null);

    const user = JSON.parse(sessionStorage.getItem("user") || "{}");
    const token = sessionStorage.getItem("token");

    const resolvedId = user.role === "home member" ? user.ownerId : user.id;

    useEffect(() => {
        const fetchDue = async () => {
            try {
                const res = await axios.post(`/api/dues/${dueId}`, {
                    userId: resolvedId, // send owner id if user is home member
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setDue(res.data);
            } catch (err) {
                console.error("Error fetching due:", err);
            }
        };

        if (dueId) fetchDue();
    }, [dueId]);

    if (!due) return <p>Loading...</p>;

    return (
        <ProtectedPage allowedRoles={["home owner", "home member", "board member", "admin"]}>
            <div className="Pay-Page-wrapper">
                <Header />
                <>
                    <InnerBanner title="Subscribe" />
                </>
                <section className='pay-wrap'>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="details-wrapper">
                                    <div className="detail-wrap">
                                        <h3>Due Details</h3>
                                        <p><strong>Due ID:</strong> {due._id}</p>
                                        <p><strong>Amount:</strong> ${due.amount.toFixed(2)}</p>
                                        <p><strong>Status:</strong> {due.paid ? "Paid" : "Unpaid"}</p>
                                        <p><strong>Created At:</strong> {new Date(due.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                {/* <h2>One-Time Payment</h2>
                                <PayPalOneTimeButton amount={due.amount} dueId={due._id} /> */}

                                <h2>Auto-Pay Subscription</h2>
                                <PayPalSubscriptionButton planId="P-1UC67166DB986312YNAJ4N4Q" dueId={due._id} />
                            </div>
                        </div>
                    </div>

                </section>
                <Footer />
            </div>
        </ProtectedPage>
    );
}
