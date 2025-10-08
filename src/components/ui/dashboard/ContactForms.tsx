import React, { useEffect, useState } from "react";
import { Button, Space, Table } from "antd";
import toast from "react-hot-toast";
import { deleteContactForms, getContactForms } from "@/lib/ContactFormApi/api";

interface User {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    message: string;
}


const ContactForms = () => {
    const [userData, setUserData] = useState([]);
    const [loadingStates, setLoadingStates] = useState<{ [key: string]: string | null }>({});

    const fetchUserData = async () => {
        try {
            const data = await getContactForms();
            const fetchedData = data.contacts
                .map((data: User, index: number) => ({
                    id: data._id,
                    fullName: data.fullName,
                    email: data.email,
                    phone: data.phone,
                    message: data.message,
                }));
            setUserData(fetchedData)
        } catch (error: any) {
            console.error(error);
            toast.error("Error orders data:", error);
        }
    };

    const handleDeleteContact = async (record: any) => {
        const token = localStorage.getItem("token");
        setLoadingStates((prev) => ({ ...prev, [record.id]: "deleteContact" }));
        if (!token) {
            console.error("No token found.");
            return;
        }
        try {
            await deleteContactForms(record.id);
            toast.success("Contact Info deleted successfully!");
        } catch (error: any) {
            toast.error("Error deleting Contact Info");
        } finally {
            setLoadingStates((prev) => ({ ...prev, [record.id]: null }));
            fetchUserData();
        }
    };

    const columns = [
        {
            title: "Full Name",
            dataIndex: "fullName",
            key: "fullName",
        },

        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Phone Number",
            dataIndex: "phone",
            key: "phone",
        },
        {
            title: "Message",
            dataIndex: "message",
            key: "message",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: any) => {
                return (
                    <Space size="middle">
                        <Space>
                            <Button
                                type="dashed"
                                loading={loadingStates[record.id] === "deleteContact"}
                                disabled={loadingStates[record.id] === "deleteContact"}
                                onClick={() => {
                                    handleDeleteContact(record);
                                }}
                            >
                                Delete
                            </Button>
                        </Space>
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
                                <h6>Contacts Users List</h6>
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

export default ContactForms;
