import React, { useEffect, useState } from "react";

import { Space, Table, Select, Button, Modal } from "antd";
import toast from "react-hot-toast";
import { getUsers, updateUserStatus } from "@/lib/UsersApi/api";
import axios from "axios";


type Due = {
    _id: string;
    amount: number;
    paid: boolean;
    paidStatus?: "Unpaid" | "Pending" | "Paid";
    createdAt: string;
    updatedAt?: string;
    subscriptionId: string;
    date: string;
    userId: string;
    dueDate: string;
    paymentMethod: string;
};

interface User {
    _id: string;
    firstname: string;
    lastname: string;
    email: string;
    phoneNumber: string;
    streetAddress: string;
    status: string;
    role: string;
}

const AdminDues = () => {
    const [dues, setDues] = useState<Due[]>([]);
    const [userData, setUserData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token")
    const role = user.role;

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedUserDues, setSelectedUserDues] = useState<Due[]>([]);
    const [selectedUserName, setSelectedUserName] = useState<string>("");

    const fetchData = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found.");
            return;
        }

        try {
            const duesRes = await axios.get("/api/dues/getAll", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const allDues: Due[] = duesRes.data;
            setDues(allDues);

            const usersRes = await getUsers(token);
            const filteredUsers = usersRes.users.filter((user: User) => user.role === "home owner");

            const usersWithDues = filteredUsers.flatMap((user: User) => {
                const userDues = allDues.filter((due) => due.userId === user._id);

                return userDues.map((due) => ({
                    key: `${user._id}-${due._id}`, // unique key
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    phonenumber: user.phoneNumber,
                    streetAddress: user.streetAddress,
                    role: user.role,
                    status: user.status,
                    dueAmount: due.amount,
                    duePaid: due.paid,
                    paidStatus: due.paidStatus,
                    dueDate: due.dueDate,
                    paymentMethod: due.paymentMethod || "N/A",
                    updatedAt: due.updatedAt,
                }));
            });


            setUserData(usersWithDues);
        } catch (error: any) {
            console.error("Failed to fetch users or dues", error);
            toast.error("Failed to fetch user or due data");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);
    const columns = [
        {
            title: "First Name",
            dataIndex: "firstname",
            key: "firstname",
        },
        {
            title: "Last Name",
            dataIndex: "lastname",
            key: "lastname",
        },
        {
            title: "Role",
            dataIndex: "role",
            key: "role",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Phone Number",
            dataIndex: "phonenumber",
            key: "phonenumber",
        },
        {
            title: "Street Address",
            dataIndex: "streetAddress",
            key: "streetAddress",
        },
        {
            title: "Amount Due",
            dataIndex: "dueAmount",
            key: "dueAmount",
            render: (amount: number) => `$${amount.toFixed(2)}`,
        },
        {
            title: "Year",
            dataIndex: "dueDate",
            key: "year",
            render: (date: string) => new Date(date).getFullYear(),
        },
        {
            title: "Payment Method",
            dataIndex: "paymentMethod",
            key: "paymentMethod",
            render: (method: string) => method || "N/A",
        },
        {
            title: "Paid",
            dataIndex: "duePaid",
            key: "duePaid",
            render: (_: boolean, record: any) => {
                const isPaid = record.duePaid || record.paidStatus === "Paid";
                return isPaid ? "Yes" : "No";
            },
        },
        {
            title: "Payment Date",
            dataIndex: "updatedAt",
            key: "paymentDate",
            render: (_: string, record: any) => {
                const isPaid = record.duePaid || record.paidStatus === "Paid";
                if (!isPaid) return "-";
                const date = record.updatedAt || record.dueDate;
                return date ? new Date(date).toLocaleDateString() : "-";
            },
        },
    ];
    const filteredUserData = userData.filter((row: any) => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) return true;
        const fullName = `${row.firstname || ""} ${row.lastname || ""}`.trim().toLowerCase();
        const email = (row.email || "").toLowerCase();
        const address = (row.streetAddress || "").toLowerCase();
        const year = row.dueDate ? String(new Date(row.dueDate).getFullYear()) : "";
        const isPaid = row.duePaid || row.paidStatus === "Paid";
        const paidLabel = isPaid ? "paid" : "unpaid";
        const paidStatus = (row.paidStatus || (isPaid ? "Paid" : "Unpaid")).toLowerCase();
        const paymentMethod = (row.paymentMethod || "").toLowerCase();
        const paymentDate = isPaid && row.updatedAt
            ? new Date(row.updatedAt).toLocaleDateString().toLowerCase()
            : "";

        return (
            fullName.includes(term) ||
            email.includes(term) ||
            address.includes(term) ||
            year.includes(term) ||
            paidLabel.includes(term) ||
            paidStatus.includes(term) ||
            paymentDate.includes(term) ||
            paymentMethod.includes(term)
        );
    });

    return (
        <>
            <div className="row">
                <div className="col-md-12">
                    <div className="row store-wrap">
                        <div className="col-lg-6 col-md-2">
                            <div>
                                <h6>Dues</h6>
                            </div>
                        </div>

                    </div>

                    <div className="mt-3">
                        <div className="mb-3">
                            <input
                                className="form-control"
                                placeholder="Search by year, name, email, address, paid, payment date, or payment method"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className={`store-table-wrap active-table`}>
                            <Table
                                className="responsive-table"
                                columns={columns}
                                dataSource={filteredUserData}
                            />
                        </div>
                    </div>
                </div>
                <Modal
                    title={`Dues for ${selectedUserName}`}
                    open={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    footer={null}
                >
                    {selectedUserDues.length > 0 ? (
                        <ul>
                            {selectedUserDues.map((due, index) => (
                                <li key={index}>
                                    <strong>Amount:</strong> ${due.amount.toFixed(2)} <br />
                                    <strong>Paid:</strong> {due.paid ? "Yes" : "No"} <br />
                                    <strong>Date:</strong> {new Date(due.dueDate).toLocaleDateString()}
                                    <hr />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No dues found for this user</p>
                    )}
                </Modal>
            </div>


        </>
    );
};

export default AdminDues;




