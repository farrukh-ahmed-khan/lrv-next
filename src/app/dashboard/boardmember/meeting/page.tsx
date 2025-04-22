"use client";
import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Space, Table, Popconfirm } from "antd";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import toast from "react-hot-toast";
import ProtectedPage from "@/components/ProtectedPage";
import Navbar from "@/components/layout/dashboard/Navbar";
import Sidebar from "@/components/layout/dashboard/Sidebar";
import { Edit, Delete } from "@mui/icons-material";
import { getNewsletters, deleteNewsletter, updateNewsletter } from "@/lib/NewsLetterApi/api";
import TextArea from "antd/es/input/TextArea";
import { addMeeting } from "@/lib/MeetingApi/api";

const AddMeeting = () => {
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();

    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [isNavClosed, setIsNavClosed] = useState(false);
    const responsiveBreakpoint = 991;
    const token = sessionStorage.getItem("token");

    const [newsletterData, setNewsletterData] = useState<any[]>([]);

    interface Meeting {
        _id: string;
        description: string;
        title: string;
    }

    const getAllMeetings = async () => {
        if (!token) return toast.error("Please Login");
        try {
            const res = await getNewsletters(token);
            const fetchedData = res.newsletters.map((data: Meeting, index: number) => ({
                key: data._id,
                id: data._id,
                title: data.title,
                description: data.description
            }));
            setNewsletterData(fetchedData);
        } catch (error) {
            console.error("Fetch Error:", error);
        }
    };

    const handleAddMeeting = async (values: any) => {
        if (!token) return toast.error("Please Login");
        try {
            setLoading(true);
            const meetingData = {
                title: values.titlename, 
                description: values.description,
            };

            const res = await addMeeting(meetingData, token);
            toast.success(res.data.message || "Meeting uploaded successfully");
            form.resetFields();
            setModalVisible(false);
            getAllMeetings();
        } catch (error) {
            console.error("Upload Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!token) return toast.error("Please Login");
        try {
            await deleteNewsletter(id, token);
            toast.success("Meeting deleted");
            getAllMeetings();
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    const openEditModal = (record: any) => {
        setEditModalVisible(true);
        setEditingId(record.id);
        editForm.setFieldsValue({ titlename: record.title, description: record.description });
    };

    const handleUpdate = async (values: any) => {
        if (!token || !editingId) return toast.error("Login or ID missing");

        const formData = new FormData();
        formData.append("id", editingId)
        formData.append("titlename", values.titlename);
        formData.append("description", values.description);

        try {
            setLoading(true);
            await updateNewsletter(formData, token);
            toast.success("Meeting updated");
            setEditModalVisible(false);
            getAllMeetings();
        } catch (error) {
            toast.error("Update failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handleResize = () => {
            setIsNavClosed(window.innerWidth <= responsiveBreakpoint);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        getAllMeetings();
    }, []);

    const toggleNav = () => setIsNavClosed(!isNavClosed);

    const columns = [
        {
            title: "Title",
            dataIndex: "title",
            key: "title"
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: any) => (
                <Space>
                    <Button icon={<Edit />} onClick={() => openEditModal(record)} />
                    <Popconfirm title="Are you sure?" onConfirm={() => handleDelete(record.id)}>
                        <Button danger icon={<Delete />} />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <ProtectedPage allowedRoles={["board member"]}>
            <section className={`myheader ${isNavClosed ? "nav-closed" : ""}`}>
                <Navbar toggleNav={toggleNav} />
                <div className="main">
                    <Sidebar isNavClosed={isNavClosed} />
                    <div
                        className="page-content"
                        onClick={() =>
                            setIsNavClosed(window.innerWidth <= responsiveBreakpoint ? true : false)
                        }
                    >
                        <div className="row">
                            <div className="col-md-12">
                                <div className="row store-wrap">
                                    <div className="col-lg-6">
                                        <h6>Meetings List</h6>
                                    </div>
                                    <div className="col-lg-6 d-flex justify-content-end">
                                        <Button type="primary" icon={<AddOutlinedIcon />} onClick={() => setModalVisible(true)}>
                                            Add Meeting
                                        </Button>
                                    </div>
                                </div>

                                <div className="store-table-wrap active-table">
                                    <Table columns={columns} dataSource={newsletterData} />
                                </div>

                                <Modal
                                    title="Add Newsletter"
                                    open={modalVisible}
                                    onCancel={() => setModalVisible(false)}
                                    footer={null}
                                >
                                    <Form layout="vertical" form={form} onFinish={handleAddMeeting}>
                                        <Form.Item
                                            label="Title Name"
                                            name="titlename"
                                            rules={[{ required: true, message: "Please Enter Title Name" }]}
                                        >
                                            <Input />
                                        </Form.Item>

                                        <Form.Item
                                            label="Description"
                                            name="description"
                                            rules={[{ required: true, message: "Please Enter Description" }]}
                                        >
                                            <TextArea />
                                        </Form.Item>

                                        <Form.Item>
                                            <Button type="primary" htmlType="submit" block loading={loading}>
                                                Add Meeting
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                </Modal>

                                {/* Edit Modal */}
                                <Modal
                                    title="Edit Meeting"
                                    open={editModalVisible}
                                    onCancel={() => setEditModalVisible(false)}
                                    footer={null}
                                >
                                    <Form layout="vertical" form={editForm} onFinish={handleUpdate}>
                                        <Form.Item
                                            label="Title Name"
                                            name="titlename"
                                            rules={[{ required: true, message: "Please Enter Title Name" }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            label="Description"
                                            name="description"
                                            rules={[{ required: true, message: "Please Enter Description" }]}
                                        >
                                            <TextArea />
                                        </Form.Item>
                                        <Form.Item>
                                            <Button type="primary" htmlType="submit" block loading={loading}>
                                                Update Newsletter
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                </Modal>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </ProtectedPage>
    );
};

export default AddMeeting;
