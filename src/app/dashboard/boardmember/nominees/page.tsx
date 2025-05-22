"use client"
import React, { useEffect, useState } from "react";
import { Space, Table, Modal, Form, Input, Button, Select } from "antd";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import toast from "react-hot-toast";
import ProtectedPage from "@/components/ProtectedPage";
import Navbar from "@/components/layout/dashboard/Navbar";
import Sidebar from "@/components/layout/dashboard/Sidebar";
import axios from "axios";
import { addnominee, deleteNominee, getAllNominee } from "@/lib/VotingApi/api";
import { getUsers } from "@/lib/UsersApi/api";


const { Option } = Select;

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

const page = () => {
    const [form] = Form.useForm();

    const [isNavClosed, setIsNavClosed] = useState(false);
    const responsiveBreakpoint = 991;
    const user = JSON.parse(sessionStorage.getItem("user") || "{}");
    const token = sessionStorage.getItem("token")
    const [isModalVisible, setIsModalVisible] = useState(false);


    const [userData, setUserData] = useState<any>([]);
    const [usersData, setUsersData] = useState<any>([]);


    const fetchData = async () => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            console.error("No token found.");
            return;
        }

        try {
            const usersRes = await getUsers(token);
            const filteredUsers = usersRes.users.filter((user: User) => user.role === "home owner" && user.status === "approved");
            const users = filteredUsers.map((user: User) => {
                return {
                    id: user._id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    phonenumber: user.phoneNumber,
                    streetAddress: user.streetAddress,
                    role: user.role,
                };
            });

            setUsersData(users);
        } catch (error: any) {
            console.error("Failed to fetch users or dues", error);
            toast.error("Failed to fetch user or due data");
        }
    };

    const fetchNomineeData = async () => {
        if (!token) {
            console.error("No token found.");
            return;
        }

        try {
            const data = await getAllNominee(token);
            const fetchedData = data.nominees.map((data: User, index: number) => ({
                id: data._id,
                firstname: data.firstname,
                lastname: data.lastname,
                email: data.email,
                phonenumber: data.phoneNumber,
                streetAddress: data.streetAddress,
                role: data.role,
            }));
            setUserData(fetchedData)
        } catch (error: any) {
            console.error(error);
        }
    };

    const handleAddNominee = async (values: any) => {
        if (!token) {
            console.error("No token found.");
            return;
        }

        const selectedUser = usersData.find((u: any) => u.email === values.nomineeId);
        if (!selectedUser) {
            toast.error("Selected user not found.");
            return;
        }

        try {
            const payload = {
                firstname: selectedUser.firstname,
                lastname: selectedUser.lastname,
                role: selectedUser.role,
                email: selectedUser.email,
                phoneNumber: selectedUser.phonenumber,
                streetAddress: selectedUser.streetAddress,
            };

            await addnominee(payload, token);
            toast.success("Member added successfully!");
            fetchNomineeData();
            form.resetFields();
        } catch (error: any) {
            toast.error(error?.message || "Something went wrong!");
        }
    };


    const handleDelete = async (nomineeId: string) => {
        if (!token) {
            toast.error("No token found");
            return;
        }

        try {
            await deleteNominee(nomineeId, token);
            toast.success("Nominee deleted successfully!");
            fetchNomineeData();
        } catch (error: any) {
            toast.error(error.message);
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
            title: "Actions",
            key: "actions",
            render: (_: any, record: any) => (
                <Space size="middle">

                    <Button type="link" danger onClick={() => handleDelete(record.id)}>Delete</Button>
                </Space>
            ),
        }


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
        fetchData()
        fetchNomineeData();
    }, [])
    const toggleNav = () => {
        setIsNavClosed(!isNavClosed);
    };

    return (
        <>
            <ProtectedPage allowedRoles={['board member']}>
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
                                                    <h6>Nominees List</h6>
                                                </div>
                                                <div className="col-lg-6 col-md-10">
                                                    <div className="d-flex justify-content-end search-wrap">
                                                        <Button
                                                            type="primary"
                                                            icon={<AddOutlinedIcon />}
                                                            onClick={() => setIsModalVisible(true)}
                                                        >
                                                            Add Nominee
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

                                    <Modal
                                        title="Add Nominee"
                                        open={isModalVisible}
                                        onCancel={() => setIsModalVisible(false)}
                                        onOk={() => form.submit()}
                                        okText="Add"
                                    >
                                        <Form
                                            form={form}
                                            layout="vertical"
                                            onFinish={(values) => {
                                                handleAddNominee(values);
                                                setIsModalVisible(false);
                                            }}
                                        >
                                            <Form.Item
                                                name="nomineeId"
                                                label="Select Homeowner"
                                                rules={[{ required: true, message: "Please select a homeowner" }]}
                                            >
                                                <Select
                                                    showSearch
                                                    placeholder="Search by name or email"
                                                    filterOption={(input, option) =>
                                                        (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
                                                    }
                                                    options={usersData.map((user: any) => ({
                                                        label: `${user.firstname} ${user.lastname} (${user.email})`,
                                                        value: user.email,
                                                    }))}
                                                />
                                            </Form.Item>
                                        </Form>
                                    </Modal>

                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </ProtectedPage >
        </>
    );
};

export default page;
