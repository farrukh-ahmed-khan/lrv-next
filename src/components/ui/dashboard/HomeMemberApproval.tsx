// import "./addstorecompany.css";
import React, { useEffect, useState } from "react";

import { Space, Table, Select } from "antd";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import toast from "react-hot-toast";
import Link from "next/link";
import { getUsers, updateUserStatus } from "@/lib/UsersApi/api";

const UsersApproval = () => {
    const { Option } = Select;
    const [statusUpdates, setStatusUpdates] = useState<{ [key: string]: string }>({});
    const [loadingStates, setLoadingStates] = useState<{ [key: string]: string | null }>({});
    const [userData, setUserData] = useState([]);
    const user = JSON.parse(sessionStorage.getItem("user") || "{}");
    const token = sessionStorage.getItem("token")
    const role = user.role;

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

    const fetchUserData = async () => {
        if (!token) {
            console.error("No token found.");
            return;
        }

        try {
            const data = await getUsers(token);

            const fetchedData = data.users
                .filter((user: User) => user.role === "home member")
                .map((data: User, index: number) => ({
                    id: data._id,
                    firstname: data.firstname,
                    lastname: data.lastname,
                    email: data.email,
                    phonenumber: data.phoneNumber,
                    streetAddress: data.streetAddress,
                    role: data.role,
                    status: data.status,
                }));
            setUserData(fetchedData)
            // toast.success(data.message);
        } catch (error: any) {
            console.error(error);
            toast.error("Error orders data:", error);
        }
    };

    const handleUpdateStatus = async (record: any, status: any) => {
        const token = sessionStorage.getItem("token");
        setLoadingStates((prev) => ({ ...prev, [record.id]: "updateStatus" }));

        if (!token) {
            console.error("No token found.");
            return;
        }

        try {
            await updateUserStatus(token, status, record.id);


            toast.success("Status updated successfully!");


        } catch (error: any) {
            toast.error("Error updating status"
            );
        } finally {
            setLoadingStates((prev) => ({ ...prev, [record.id]: null }));
            fetchUserData();
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
            title: "Actions",
            key: "actions",
            render: (_: any, record: any) => {
                return (
                    <Space size="middle">
                        {role === "board member" && (
                            <Space>
                                <Select
                                    style={{ width: 150 }}
                                    placeholder="Select Status"
                                    onChange={(value) => handleUpdateStatus(record, value)}
                                    value={statusUpdates[record.id] || record.status}
                                    loading={loadingStates[record.id] === "updateStatus"}
                                    disabled={loadingStates[record.id] === "updateStatus"}
                                >
                                    <Option value="pending">Pending</Option>
                                    <Option value="rejected">Rejected</Option>
                                    <Option value="approved">Approved</Option>
                                </Select>
                            </Space>
                        )}
                    </Space>
                );
            },
        },
    ];

    useEffect(() => {
        fetchUserData();
    }, []);

    return (
        <>
            <div className="row">
                <div className="col-md-12">
                    <div className="row store-wrap">
                        <div className="col-lg-6 col-md-2">
                            <div>
                                <h6>Orders List</h6>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-10">
                            <div className="d-flex justify-content-end search-wrap">
                                <Link href="/place-order">
                                    {" "}
                                    <AddOutlinedIcon />
                                    Place An Orders
                                </Link>
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
            </div>


        </>
    );
};

export default UsersApproval;
