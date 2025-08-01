"use client"
import React, { useEffect, useState } from "react";
import { Form, Input, Button, Card } from "antd";
import toast from "react-hot-toast";
import ProtectedPage from "@/components/ProtectedPage";
import Navbar from "@/components/layout/dashboard/Navbar";
import Sidebar from "@/components/layout/dashboard/Sidebar";
import axios from "axios";
import { useRouter } from 'next/navigation';


type Due = {
    _id: string;
    amount: number;
    paid: boolean;
    createdAt: string;
    subscriptionId: string;
};
const HouseMembers = () => {
    const [isNavClosed, setIsNavClosed] = useState(false);
    const responsiveBreakpoint = 991;

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const [dues, setDues] = useState<Due[]>([]);
    const router = useRouter()

    useEffect(() => {
        const fetchDues = async () => {
            try {
                const res = await axios.get("/api/dues/get", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setDues(res.data.due);
            } catch (error: any) {
                console.error("Failed to fetch dues", error.res);
            }
        };

        fetchDues();
    }, []);




    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= responsiveBreakpoint) {
                setIsNavClosed(true);
            } else {
                setIsNavClosed(false);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    const toggleNav = () => {
        setIsNavClosed(!isNavClosed);
    };

    return (
        <>
            <ProtectedPage allowedRoles={["home owner", "home member", "board member"]}>
                <section className={`myheader ${isNavClosed ? 'nav-closed' : ''}`}>
                    <div className="">
                        <Navbar toggleNav={toggleNav} />
                        <div className="">
                            <div className="main">
                                <Sidebar isNavClosed={isNavClosed} />
                                <div className="page-content" onClick={() => setIsNavClosed(window.innerWidth <= responsiveBreakpoint ? true : false)}>
                                    <section className="dues-content">
                                        <div className="container">

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
                                                                                {
                                                                                    console.log(due)
                                                                                }
                                                                                <button
                                                                                    className="pay-now-btn"
                                                                                    onClick={() => router.push(`/pay?dueId=${due._id}`)}
                                                                                >
                                                                                    Pay Now
                                                                                </button>


                                                                            </>
                                                                        )}

                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>


                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </ProtectedPage >
        </>
    );
};

export default HouseMembers;
