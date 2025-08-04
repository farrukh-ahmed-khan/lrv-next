import React, { useEffect, useState } from "react";

import { Space, Table, Select, Button, Modal, message } from "antd";
import toast from "react-hot-toast";
import { getUsers, updateUserStatus } from "@/lib/UsersApi/api";
import axios from "axios";


type Due = {
    _id: string;
    amount: number;
    paid: boolean;
    createdAt: string;
    subscriptionId: string;
    date: string;
    userId: string;
    dueDate: string;
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

const CreateBoardMembers = () => {
    const { Option } = Select;
    const [statusUpdates, setStatusUpdates] = useState<{ [key: string]: string }>({});
    const [loadingStates, setLoadingStates] = useState<{ [key: string]: string | null }>({});
    const [dues, setDues] = useState<Due[]>([]);
    const [userData, setUserData] = useState([]);
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
            const filteredUsers = usersRes.users.filter(
                (user: User) => user.role === "home owner" && user.status === "approved"
            );

            const usersWithDues = filteredUsers.map((user: User) => {

                const userDues = allDues.filter((due) => due.userId === user._id);
                const unpaidDues = userDues.filter((due) => !due.paid);
                const totalDue = unpaidDues.reduce((acc, due) => acc + due.amount, 0);

                return {
                    id: user._id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    phonenumber: user.phoneNumber,
                    streetAddress: user.streetAddress,
                    role: user.role,
                    status: user.status,
                    dues: userDues,
                    dueStatus: unpaidDues.length > 0 ? "Unpaid" : "Paid",
                    totalDueAmount: totalDue,
                };
            });

            setUserData(usersWithDues);
        } catch (error: any) {
            console.error("Failed to fetch users or dues", error);
            toast.error("Failed to fetch user or due data");
        }
    };






    const promoteToBoardMember = async (record: any) => {
        const token = localStorage.getItem("token");
        setLoadingStates((prev) => ({ ...prev, [record.id]: "updateStatus" }));

        if (!token) {
            console.error("No token found.");
            return;
        }

        try {
            await axios.put(
                "/api/user/update-role",
                { userId: record.id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            message.success("User promoted to board member");
            fetchData();
        } catch (err: any) {
            message.error(err.response?.data?.message || "Failed to update role");
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
            title: "Action",
            render: (_: any, record: any) =>
                record.role !== "board member" ? (
                    <Button onClick={() => promoteToBoardMember(record.id)}>
                        Make Board Member
                    </Button>
                ) : (
                    <span style={{ color: "green" }}>Already Board</span>
                ),
        },
    ];



    return (
        <>
            <div className="row">
                <div className="col-md-12">
                    <div className="row store-wrap">
                        <div className="col-lg-6 col-md-2">
                            <div>
                                <h6>Approved Home Owner List</h6>
                            </div>
                        </div>

                    </div>

                    <div className="mt-3">
                        <div className={`store-table-wrap active-table`}>
                            <Table
                                className="responsive-table"
                                columns={columns}
                                dataSource={userData}
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
                        <p>No dues found for this user.</p>
                    )}
                </Modal>
            </div>


        </>
    );
};

export default CreateBoardMembers;
