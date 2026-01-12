"use client";

import React, { useEffect, useState } from "react";
import { DatePicker, Table, TableColumnsType } from "antd";
import type { Dayjs } from "dayjs";
import Navbar from "@/components/layout/dashboard/Navbar";
import Sidebar from "@/components/layout/dashboard/Sidebar";
import ProtectedPage from "@/components/ProtectedPage";
import DashStats from "@/components/ui/dashboard/DashStats";
import axios from "axios";
import { getUsers } from "@/lib/UsersApi/api";
import toast from "react-hot-toast";


const Page: React.FC = () => {
  const [isNavClosed, setIsNavClosed] = useState(false);
  const [dues, setDues] = useState<any[]>([]);
  const [unpaidMembers, setUnpaidMembers] = useState<any[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const responsiveBreakpoint = 991;


  const filterDuesByDate = (dues: any[]) => {
    return dues.filter((due) => {
      const date = new Date(due.createdAt); // or due.updatedAt
      const dueMonth = (date.getMonth() + 1).toString().padStart(2, "0");
      const dueYear = date.getFullYear().toString();

      if (selectedYear && dueYear !== selectedYear) return false;
      if (selectedMonth && dueMonth !== selectedMonth.split("-")[1]) return false;

      return true;
    });
  };

  const columns = [
    {
      title: "Label",
      dataIndex: "label",
      key: "label",
    },
    {
      title: "Total Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: any) => (amount !== undefined ? `$${amount.toFixed(2)}` : "-"),
    },
    {
      title: "Percentage",
      dataIndex: "percentage",
      key: "percentage",
    },
    {
      title: "Count",
      dataIndex: "count",
      key: "count",
    },
  ];

  const Seccolumns = [
    {
      title: "Street Address",
      dataIndex: "streetaddresss",
      key: "streetaddresss",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Total Overdue",
      dataIndex: "totaloverdue",
      key: "totaloverdue",
    },
    {
      title: "Due Last Paid Year",
      dataIndex: "lastpaidyear",
      key: "lastpaidyear",
    },
  ]

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const duesRes = await axios.get("/api/dues/getAll", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const rawDues: any[] = duesRes.data;
      const allDues = filterDuesByDate(rawDues);

      const usersRes = await getUsers(token);
      const Users = usersRes.users;

      /* ---------------- SUMMARY TABLE (already working) ---------------- */
      const totalAmount = allDues.reduce((sum, d) => sum + d.amount, 0);

      const paidAmount = allDues
        .filter((d) => d.paid || d.paidStatus === "Paid")
        .reduce((sum, d) => sum + d.amount, 0);

      const unpaidAmount = totalAmount - paidAmount;

      const paidCount = allDues.filter(
        (d) => d.paid || d.paidStatus === "Paid"
      ).length;

      const unpaidCount = allDues.length - paidCount;

      const paidPercentage = totalAmount
        ? ((paidAmount / totalAmount) * 100).toFixed(0) + "%"
        : "0%";

      setDues([
        { key: "total", label: "Total Dues", amount: totalAmount },
        {
          key: "paid",
          label: "Paid Dues",
          amount: paidAmount,
          percentage: paidPercentage,
          count: paidCount,
        },
        {
          key: "unpaid",
          label: "Unpaid Dues",
          amount: unpaidAmount,
          percentage: (100 - Number(paidPercentage.replace("%", ""))) + "%",
          count: unpaidCount,
        },
      ]);

      /* ---------------- SECOND TABLE: UNPAID MEMBERS ---------------- */

      // Only unpaid dues
      const unpaidDues = allDues.filter(
        (d) => !d.paid && d.paidStatus !== "Paid"
      );

      // Group unpaid dues by userId
      const groupedByUser: Record<string, any[]> = unpaidDues.reduce(
        (acc, due) => {
          if (!acc[due.userId]) acc[due.userId] = [];
          acc[due.userId].push(due);
          return acc;
        },
        {}
      );

      const unpaidTableData = Object.entries(groupedByUser).map(
        ([userId, dues]) => {
          const user = Users.find((u: any) => u._id === userId);

          const totalOverdue = dues.reduce(
            (sum, d) => sum + d.amount,
            0
          );

          // last paid year (from user's paid dues)
          const paidDuesOfUser = allDues.filter(
            (d) => d.userId === userId && (d.paid || d.paidStatus === "Paid")
          );

          const lastPaidYear =
            paidDuesOfUser.length > 0
              ? new Date(
                Math.max(
                  ...paidDuesOfUser.map((d) =>
                    new Date(d.updatedAt || d.createdAt).getTime()
                  )
                )
              ).getFullYear()
              : "Never";

          return {
            key: userId,
            streetaddresss: dues[0].streetAddress,
            name: user ? `${user.firstname} ${user.lastname}` : "Unknown",
            email: user?.email || "-",
            totaloverdue: totalOverdue,
            lastpaidyear: lastPaidYear,
          };
        }
      );

      setUnpaidMembers(unpaidTableData);

    } catch (error: any) {
      console.error("Failed to fetch dues", error);
      toast.error("Failed to fetch dues data");
    }
  };



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


  useEffect(() => {
    fetchData();
  }, [selectedMonth, selectedYear]);

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
    <ProtectedPage allowedRoles={["board member"]}>
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
                <div className="col-md-6">
                  <Table
                    className="responsive-table"
                    columns={columns}
                    dataSource={dues}
                    pagination={false}
                  />
                </div>
                <div className="col-md-6">
                  <Table
                    className="responsive-table"
                    columns={Seccolumns}
                    dataSource={unpaidMembers}
                    pagination={{ pageSize: 10 }}
                  />

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </ProtectedPage>
  );
};

export default Page;
