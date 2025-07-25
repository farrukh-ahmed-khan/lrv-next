"use client";
import React, { useEffect, useState } from "react";
import { Space, Table, Modal, Form, Input, Button, Select, Card } from "antd";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import axios from "axios";
import toast from "react-hot-toast";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Navbar";
import ProtectedPage from "@/components/ProtectedPage";
import InnerBanner from "@/components/ui/InnerBanner";
import { addMember, getMembers } from "@/lib/UsersApi/api";
import Link from 'next/link';


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
const Profile = () => {
    const [form] = Form.useForm();
    const [profileForm] = Form.useForm();
    const [modalVisible, setModalVisible] = useState(false);

    const user = JSON.parse(sessionStorage.getItem("user") || "{}");
    const token = sessionStorage.getItem("token")

    const [userData, setUserData] = useState<any>([]);
    const [presentData, setPresentData] = useState<any>([]);
    const [editingMember, setEditingMember] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);


    const [isSubmitting2, setIsSubmitting2] = useState(false);


    const handleEdit = (member: any) => {
        setEditingMember(member);
        setIsEditing(true);
        setModalVisible(true);
        form.setFieldsValue({
            firstname: member.firstname,
            lastname: member.lastname,
            email: member.email,
            phoneNumber: member.phonenumber,
        });
    };



    const fetchUserData = async () => {
        if (!token) {
            console.error("No token found.");
            return;
        }

        try {
            const data = await getMembers(token);

            const fetchedData = data.users.map((data: User, index: number) => ({
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
        } catch (error: any) {
            console.error(error);
            toast.error("Error orders data:", error);
        }
    };



    const handleAddMember = async (values: any) => {
        if (!token) {
            console.error("No token found.");
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                ...values,
                role: "home member",
                ownerId: user.id,
                streetAddress: user.streetAddress,
            };

            if (isEditing && editingMember) {
                await axios.put(
                    `/api/user/updateUser`,
                    {
                        ...payload,
                        id: editingMember.id,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                toast.success("Member updated successfully!");
            } else {
                await addMember(payload, token);
                toast.success("Member added successfully!");
            }

            fetchUserData();
            setModalVisible(false);
            form.resetFields();
            setIsEditing(false);
            setEditingMember(null);
        } catch (error: any) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Something went wrong!");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (memberId: string) => {
        if (!token) return;
        console.log(memberId)
        try {
            await axios.delete("/api/user/deleteUser", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                data: { id: memberId },
            });
            toast.success("Member deleted successfully");
            fetchUserData();
        } catch (error: any) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Failed to delete member");
        }
    };


    const handleResendEmail = async (userId: string) => {
        if (!token) return;

        try {
            await axios.post(
                "/api/user/resendResetEmail",
                { userId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success("Reset email sent successfully");
        } catch (error: any) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Failed to resend email");
        }
    };

    const handleSubmit = async (values: any) => {
        setIsSubmitting2(true);
        try {
            const res = await axios.put(
                "/api/user/update",
                { ...values, id: user.id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success("Profile updated successfully!");
            const updatedUser = { ...user, ...values };
            sessionStorage.setItem("user", JSON.stringify(updatedUser));
        } catch (error: any) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Something went wrong!");
        } finally {
            setIsSubmitting2(false);
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
            title: "Status",
            dataIndex: "status",
            key: "status",
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
            title: "Actions",
            key: "actions",
            render: (_: any, record: any) => (
                <Space size="middle">
                    <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
                    <Button type="link" danger onClick={() => handleDelete(record.id)}>Delete</Button>
                    <Button type="link" onClick={() => handleResendEmail(record.id)}>Resend Email</Button>
                </Space>
            ),
        }



    ];


    useEffect(() => {
        if (user) {
            setPresentData(user);
            profileForm.setFieldsValue({
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                phoneNumber: user.phoneNumber,
                streetAddress: user.streetAddress,
            });
        }
    }, []);

    useEffect(() => {
        fetchUserData();
    }, [])



    return (
        <ProtectedPage allowedRoles={["home owner", "home member", "board member", "admin"]}>
            <div className="contactus-wrapper">
                <Header />
                <InnerBanner title="My Profile" />
                <div className="container my-5">
                    <div className="row mt-5">
                        <Card title="Update Profile" style={{ maxWidth: 600, margin: "0 auto" }}>
                            <Form layout="vertical" form={profileForm} onFinish={handleSubmit}>
                                <Form.Item
                                    label="First Name"
                                    name="firstname"
                                    rules={[{ required: true, message: "Please enter first name" }]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    label="Last Name"
                                    name="lastname"
                                    rules={[{ required: true, message: "Please enter last name" }]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    label="Email"
                                    name="email"
                                    rules={[
                                        { required: true, type: "email", message: "Enter a valid email" },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    label="Phone Number"
                                    name="phoneNumber"
                                    rules={[{ required: true, message: "Please enter phone number" }]}
                                >
                                    <Input />
                                </Form.Item>


                                <Form.Item>
                                    <Button type="primary" htmlType="submit" block loading={isSubmitting2}>
                                        Update Profile
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </div>
                    {
                        user.role === "home owner" ? (
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="row store-wrap">
                                        <div className="col-lg-6 col-md-2">
                                            <h6>Members List</h6>
                                        </div>
                                        <div className="col-lg-6 col-md-10">
                                            <div className="d-flex justify-content-end search-wrap">
                                                <Button
                                                    type="primary"
                                                    icon={<AddOutlinedIcon />}
                                                    onClick={() => setModalVisible(true)}
                                                >
                                                    Add Members
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-3">
                                        <div className="store-table-wrap active-table">
                                            <Table
                                                className="responsive-table"
                                                columns={columns}
                                                dataSource={userData}
                                                rowKey="_id"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <></>
                        )
                    }
                </div>
                <Footer />
                <Modal
                    title={isEditing ? "Edit Member" : "Add Member"}
                    open={modalVisible}
                    onCancel={() => {
                        setModalVisible(false);
                        form.resetFields();
                        setIsEditing(false);
                        setEditingMember(null);
                    }}
                    footer={null}
                >
                    <Form
                        layout="vertical"
                        form={form}
                        onFinish={handleAddMember}
                    >
                        <Form.Item
                            label="First Name"
                            name="firstname"
                            rules={[{ required: true, message: "Please enter first name" }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Last Name"
                            name="lastname"
                            rules={[{ required: true, message: "Please enter last name" }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ required: true, type: "email", message: "Enter a valid email" }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Phone Number"
                            name="phoneNumber"
                            rules={[{ required: true, message: "Please enter phone number" }]}
                        >
                            <Input />
                        </Form.Item>



                        <Form.Item>
                            <Button type="primary" htmlType="submit" block loading={isSubmitting2}>
                                {isEditing ? "Edit Member" : "Add Member"}
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </ProtectedPage>
    );
};

export default Profile;
