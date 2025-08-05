import React, { useEffect, useState } from "react";

import { Space, Table, Select, Button, Modal } from "antd";
import toast from "react-hot-toast";
import { getUsers, updateUserDuesStatus, updateUserStatus } from "@/lib/UsersApi/api";
import axios from "axios";
import Image from "next/image";


type Due = {
    _id: string;
    amount: number;
    paid: boolean;
    paidStatus?: "Unpaid" | "Pending" | "Paid";
    createdAt: string;
    subscriptionId: string;
    date: string;
    userId: string;
    dueDate: string;
    paymentMethod?: "Credit Card" | "PayPal" | "Check";
    checkImage?: string;
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

const CheckedDues = () => {
    const { Option } = Select;
    const [dues, setDues] = useState<Due[]>([]);
    const [userData, setUserData] = useState([]);
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token")
    const role = user.role;

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedUserDues, setSelectedUserDues] = useState<any>([]);
    const [selectedUserName, setSelectedUserName] = useState<string>("");
    const [loadingStates, setLoadingStates] = useState<{ [key: string]: string | null }>({});
    const [statusUpdates, setStatusUpdates] = useState<{ [key: string]: string }>({});


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

            const checkPaidDues = allDues.filter(
                (due) =>
                    due.paymentMethod === "Check" &&
                    ["Pending", "Paid", "Unpaid"].includes(due.paidStatus ?? "")
            );

            setDues(checkPaidDues);

            const usersRes = await getUsers(token);
            const filteredUsers = usersRes.users.filter((user: User) => user.role === "home owner");

            const usersWithCheckDues = filteredUsers.flatMap((user: User) => {
                const userDues = checkPaidDues.filter((due) => due.userId === user._id);

                return userDues.map((due) => ({
                    key: `${user._id}-${due._id}`,
                    id: due._id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    phonenumber: user.phoneNumber,
                    streetAddress: user.streetAddress,
                    role: user.role,
                    status: user.status,
                    dueAmount: due.amount,
                    duePaid: due.paid,
                    dueDate: due.dueDate,
                    paymentMethod: due.paymentMethod,
                    paidStatus: due.paidStatus,
                    checkImage: due.checkImage,
                }));
            });

            setUserData(usersWithCheckDues);
        } catch (error: any) {
            console.error("Failed to fetch users or dues", error);
            toast.error("Failed to fetch user or due data");
        }
    };


    useEffect(() => {
        fetchData();
    }, []);

    const handleUpdateStatus = async (record: any, status: any) => {

        console.log(record)

        const token = localStorage.getItem("token");
        setLoadingStates((prev) => ({ ...prev, [record.id]: "updateStatus" }));

        if (!token) {
            console.error("No token found.");
            return;
        }

        try {
            const res = await updateUserDuesStatus(token, status, record.id);
            console.log(res)
            toast.success("Status updated successfully!");


        } catch (error: any) {
            console.log(error.message)
            toast.error(error.message);
        } finally {
            setLoadingStates((prev) => ({ ...prev, [record.id]: null }));
            fetchData();
            // window.location.reload()
        }
    };




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
            render: (amount: number) => `$${amount.toFixed(2)}`
        },
        {
            title: "Paid",
            dataIndex: "duePaid",
            key: "duePaid",
            render: (paid: boolean) => paid ? "Yes" : "No",
        },
        {
            title: "Due Date",
            dataIndex: "dueDate",
            key: "dueDate",
            render: (date: string) => new Date(date).toLocaleDateString(),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: any) => {
                return (
                    <Space size="middle">

                        <Button type="link" onClick={() => {
                            setSelectedUserDues(record);
                            setSelectedUserName(`${record.firstname} ${record.lastname}`);
                            setIsModalVisible(true);
                        }}>
                            View Checked
                        </Button>

                        {role === "board member" && (
                            <Space>
                                <Select
                                    style={{ width: 150 }}
                                    placeholder="Select Status"
                                    onChange={(value) => handleUpdateStatus(record, value)}
                                    value={statusUpdates[record.id] || record.paidStatus}
                                    loading={loadingStates[record.id] === "updateStatus"}
                                    disabled={loadingStates[record.id] === "updateStatus"}
                                >
                                    <Option value="Paid">Paid</Option>
                                    <Option value="Pending">Pending</Option>
                                    <Option value="Unpaid">Unpaid</Option>
                                </Select>
                            </Space>
                        )}

                    </Space>
                );
            },
        },
    ];



    console.log(selectedUserDues)


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
                    title={`Check Image${selectedUserDues.length > 1 ? "s" : ""} for ${selectedUserName}`}
                    open={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    footer={null}
                >
                    <ul>
                        {selectedUserDues?.checkImage && (
                            <>
                                <Image
                                    src={selectedUserDues.checkImage}
                                    width={400}
                                    height={250}
                                    style={{ border: "1px solid #ccc" }}
                                    alt="check image"
                                />
                            </>
                        )}

                    </ul>
                </Modal>


            </div>


        </>
    );
};

export default CheckedDues;
