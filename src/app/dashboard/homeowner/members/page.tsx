"use client"
import React, { useEffect, useState } from "react";
import { Space, Table, Modal, Form, Input, Button, Select } from "antd";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import toast from "react-hot-toast";
import Link from "next/link";
import ProtectedPage from "@/components/ProtectedPage";
import Navbar from "@/components/layout/dashboard/Navbar";
import Sidebar from "@/components/layout/dashboard/Sidebar";
import axios from "axios";
import { addMember, getMembers } from "@/lib/UsersApi/api";


const { Option } = Select;

const HouseMembers = () => {
    const [form] = Form.useForm();
    const [modalVisible, setModalVisible] = useState(false);

    const [isNavClosed, setIsNavClosed] = useState(false);
    const responsiveBreakpoint = 991;
    const user = JSON.parse(sessionStorage.getItem("user") || "{}");
    const token = sessionStorage.getItem("token")

    const [userData, setUserData] = useState<any>([]);

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

        try {
            const payload = {
                ...values,
                role: "home member",
                ownerId: user.id,
                streetAddress: user.streetAddress
            };

            addMember(payload, token)


            // await axios.post(
            //     "http://localhost:3000/api/add-member",
            //     payload,
            //     {
            //         headers: {
            //             "Content-Type": "application/json",
            //             Authorization: `Bearer ${token}`,
            //         },
            //     }
            // );
            fetchUserData()
            toast.success("Member added successfully!");
            setModalVisible(false);
            form.resetFields();

        } catch (error: any) {
            console.error(error);
            toast.error(
                error?.response?.data?.message || "Something went wrong!"
            );
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
    ];


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

    useEffect(() => {
        fetchUserData();
    }, [])
    const toggleNav = () => {
        setIsNavClosed(!isNavClosed);
    };

    return (
        <>
            <ProtectedPage allowedRoles={['home owner']}>
                <section className={`myheader ${isNavClosed ? 'nav-closed' : ''}`}>
                    <div className="">
                        <Navbar toggleNav={toggleNav} />
                        <div className="">
                            <div className="main">
                                <Sidebar isNavClosed={isNavClosed} />
                                <div className="page-content" onClick={() => setIsNavClosed(window.innerWidth <= responsiveBreakpoint ? true : false)}>
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
                                </div>


                                <Modal
                                    title="Add Member"
                                    visible={modalVisible}
                                    onCancel={() => setModalVisible(false)}
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
                                            <Button type="primary" htmlType="submit" block>
                                                Add Member
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                </Modal>
                            </div>
                        </div>
                    </div>
                </section>
            </ProtectedPage >
        </>
    );
};

export default HouseMembers;
