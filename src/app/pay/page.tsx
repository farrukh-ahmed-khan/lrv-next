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
import toast from 'react-hot-toast';


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
    const [checkImage, setCheckImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [uploaded, setUploaded] = useState(false);
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");

    const resolvedId = user.role === "home member" ? user.ownerId : user.id;


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCheckImage(file)
            setUploaded(false);
        };
    };

    const handleCheckUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!checkImage) return toast.error("Please select an image first");

        const formData = new FormData();
        formData.append("checkImage", checkImage);
        formData.append("dueId", dueId || "");

        try {
            setLoading(true);
            await axios.post("/api/dues/upload-check", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success("Check uploaded successfully");
            setUploaded(true);
            setCheckImage(null);
        } catch (error) {
            console.error("Upload failed", error);
            toast.error("Failed to upload check");
        } finally {
            setLoading(false);
        }
    };

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
                    <InnerBanner title="Pay Your Dues" />
                </>
                <section className='pay-wrap'>
                    <div className="container">
                        <div className="row">
                            {
                                due.paid ? (
                                    <>
                                        <div className="col-lg-12">
                                            <div className="details-wrapper">
                                                <div className="detail-wrap text-center">
                                                    <h3>Due Details</h3>
                                                    <p><strong>Due ID:</strong> {due._id}</p>
                                                    <p><strong>Amount:</strong> ${due.amount.toFixed(2)}</p>
                                                    <p><strong>Status:</strong> {due.paid ? "Paid" : "Unpaid"}</p>
                                                    <p><strong>Created At:</strong> {new Date(due.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
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
                                            <h2>One-Time Payment</h2>
                                            <PayPalOneTimeButton amount={due.amount} dueId={due._id} />


                                            <h2 className="mt-4">Upload Bank Check</h2>
                                            <form
                                                onSubmit={handleCheckUpload}
                                                encType="multipart/form-data"
                                                className="flex flex-col gap-2"
                                            >
                                                <input type="file" accept="image/*" onChange={handleFileChange} disabled={loading} />
                                                <button className="btn btn-primary" type="submit"  disabled={loading || uploaded}>
                                                    {loading ? "Uploading..." : uploaded ? "Uploaded ✅" : "Upload Check"}
                                                </button>
                                            </form>
                                            {/* <h2>Auto-Pay Subscription</h2>
                                    <PayPalSubscriptionButton planId="P-1UC67166DB986312YNAJ4N4Q" dueId={due._id}/> */}
                                        </div>
                                    </>
                                )
                            }

                        </div>
                    </div>

                </section>
                <Footer />
            </div>
        </ProtectedPage>
    );
}
