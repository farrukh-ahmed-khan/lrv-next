"use client"
import Header from "@/components/layout/Navbar";
import InnerBanner from "@/components/ui/InnerBanner";
import Footer from "@/components/layout/Footer";
import ProtectedPage from "@/components/ProtectedPage";
import btnImg from "@/assets/images/btn_subscribe.gif"
import bottomimg from "@/assets/images/bottom-dues.jpg"
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

import axios from "axios";

type Due = {
    _id: string;
    amount: number;
    paid: boolean;
    createdAt: string;
    subscriptionId: string;
};
const Dues = () => {
    const [dues, setDues] = useState<Due[]>([]);
    const router = useRouter()

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
        <ProtectedPage allowedRoles={["home owner", "home member", "board member", "admin"]}>
            <div className="Dues-wrapper">
                <Header />
                <>
                    <InnerBanner title="LRV Homeowner Annual Dues" />
                </>
                <section className="dues-content">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="heading">
                                    <h4>
                                        LRV Homeowner Annual Dues — $30.00
                                    </h4>
                                </div>
                            </div>
                            <div className="col-lg-12">
                                <div className="content">
                                    <p>
                                        LRV Homeowner Association dues are
                                        payable annually in January, by January 31st.
                                    </p>
                                    <p>
                                        Your $30.00 in annual dues helps to pay for a variety of
                                        LRV Association expenses, i.e.,
                                        landscaping, electricity & lighting for the common entry area, sprinkler systems
                                        and equipment repair & maintenance at the corners of Palos Verdes
                                        Drive North & Silver Saddle Lane. Your Association also contributes to
                                        the annual LRV Halloween and Christmas parties. In addition, your dues
                                        payment enables the LRV Board of Directors
                                        to maintain California State licensing and to conduct homeowner business as
                                        a corporation.
                                    </p>
                                    <p>
                                        Questions about LRV dues? Want to know if you're up-to-date with your LRV dues?
                                    </p>
                                    <ul>
                                        <li>
                                            Contact Praveen Gattu, LRV Treasurer at
                                            <a href="tel: 303-880-7455">
                                                303-880-7455
                                            </a>
                                            or E-mail at
                                            <a href="mailto: pgattu@gmail.com">
                                                pgattu@gmail.com
                                            </a>
                                        </li>
                                    </ul>
                                    <p>
                                        There are three easy methods to pay your annual LRV Homeowner dues:
                                    </p>
                                    <ul>
                                        <li>
                                            <span>
                                                Subscribe,
                                            </span>
                                            below for auto-recurring annual dues:
                                            <ul>
                                                <li>
                                                    You need a PayPal account for this payment type…
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                    <div className="btn-img-wrap">
                                        <Image src={btnImg} alt="" />
                                    </div>
                                    <ul>
                                        <li>
                                            <span>
                                                Pay Online,
                                            </span>
                                            one time. A PayPal account is not necessary, using:
                                            <ul>
                                                <li>
                                                    Any popular credit cards or PayPal by clicking the green button below.
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                    <div className="pay-btn-wrap">
                                        <button className="pay-now-btn">Pay Now</button>
                                    </div>
                                    <ul>
                                        <li>
                                            <span>
                                                Mail or drop-off a personal check to:
                                            </span>
                                        </li>
                                    </ul>
                                    <p>
                                        Praveen Gattu - LRV Treasurer
                                    </p>
                                    <p>
                                        58 Silver Saddle Lane
                                    </p>
                                    <p>
                                        Rolling Hills Estates, CA  90274
                                    </p>
                                </div>
                            </div>
                            <div className="col-lg-12">
                                <div className="bottom-img-wrap">
                                    <Image src={bottomimg} alt="bottomimg" />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="heading">
                                    <h4>
                                        Your Dues
                                    </h4>
                                </div>
                            </div>
                            <div className="row">
                                {dues.map((due) => {
                                    const year = new Date(due.createdAt).getFullYear();
                                    return (
                                        <div className="col-lg-3">
                                            <div key={due._id} className="due-card">
                                                <p className="due-year">Year: {year}</p>
                                                <div className="due-info">
                                                    <p className="due-amount">${due.amount}</p>
                                                    <span className={`status-badge ${due.paid ? 'paid' : 'unpaid'}`}>
                                                        {due.paid ? 'Paid' : 'Unpaid'}
                                                    </span>
                                                </div>

                                                <div className="pay-btn-wrap" style={{
                                                    justifyContent: "space-between",
                                                }}>
                                                    {!due.paid && !due.subscriptionId && (
                                                        <>
                                                            <button
                                                                className="pay-now-btn"
                                                                onClick={() => router.push(`/pay?dueId=${due._id}`)}
                                                            >
                                                                Pay Now
                                                            </button>
                                                            <button
                                                                className="pay-now-btn"
                                                                style={{ backgroundColor: "#FFC439", color: "#000" }}
                                                                onClick={() => router.push(`/subscribe?dueId=${due._id}`)}
                                                            >
                                                                Subscribe
                                                            </button>

                                                        </>
                                                    )}
                                                    {/* {!due.paid && <button className="pay-now-btn">Pay Now</button>} */}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>


                        </div>
                    </div>
                </section>

                <Footer />
            </div>
        </ProtectedPage>
    );
};

export default Dues;
