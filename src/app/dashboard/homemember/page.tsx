"use client";

import React, { useEffect, useState } from "react";
import { DatePicker } from "antd";
import type { Dayjs } from "dayjs";
import Navbar from "@/components/layout/dashboard/Navbar";
import Sidebar from "@/components/layout/dashboard/Sidebar";
import ProtectedPage from "@/components/ProtectedPage";
import DashStats from "@/components/ui/dashboard/DashStats";

const Page: React.FC = () => {
    const [isNavClosed, setIsNavClosed] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
    const [selectedYear, setSelectedYear] = useState<string | null>(null);
    const responsiveBreakpoint = 991;

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= responsiveBreakpoint) {
                setIsNavClosed(true);
            } else {
                setIsNavClosed(false);
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleNav = () => {
        setIsNavClosed(!isNavClosed);
    };

    const handleMonthChange = (date: Dayjs | null, dateString: string | string[]) => {
        setSelectedMonth(typeof dateString === "string" ? dateString : dateString[0] || null);
    };

    const handleYearChange = (date: Dayjs | null, dateString: string | string[]) => {
        setSelectedYear(typeof dateString === "string" ? dateString : dateString[0] || null);
    };


    return (
        <ProtectedPage allowedRoles={["home member"]}>
            <section className={`myheader ${isNavClosed ? "nav-closed" : ""}`}>
                <div>
                    <Navbar toggleNav={toggleNav} />
                    <div className="main">
                        <Sidebar isNavClosed={isNavClosed} />
                        <div
                            className="page-content"
                            onClick={() =>
                                setIsNavClosed(window.innerWidth <= responsiveBreakpoint)
                            }
                        >
                            <div className="row">
                                <div className="col-lg-6">
                                    <p>Hi</p>
                                    <h2>Welcome</h2>
                                </div>
                                <div className="col-lg-6 d-flex align-items-center justify-content-end">
                                    <div className="row">
                                        <div className="col-lg-6 d-flex align-items-center justify-content-end">
                                            <div className="date-wrap">
                                                <div className="date-input">
                                                    <DatePicker picker="month" onChange={handleMonthChange} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 d-flex align-items-center justify-content-end">
                                            <div className="date-wrap">
                                                <div className="date-input">
                                                    <DatePicker picker="year" onChange={handleYearChange} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row mb-4">
                                <div className="col-md-3">
                                    <div className="main-stats">
                                        <div className="d-flex flex-column">
                                            <p>Total Profile Created</p>
                                            <h2>321</h2>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="main-stats">
                                        <div className="d-flex flex-column">
                                            <p>Total Offenses</p>
                                            <h2>20</h2>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="main-stats">
                                        <div className="d-flex flex-column">
                                            <p>Total Tickets</p>
                                            <h2>120</h2>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="main-stats">
                                        <div className="d-flex flex-column">
                                            <p>Expunge Request</p>
                                            <h2>15</h2>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <DashStats />
                        </div>
                    </div>
                </div>
            </section>
        </ProtectedPage>
    );
};

export default Page;
