"use client"
import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";
import { createEvent, deleteEvent, RsvpEvents } from "@/lib/UpcomingEventsApi/api";
import type { ColumnsType } from "antd/es/table";
import ProtectedPage from "@/components/ProtectedPage";
import Navbar from "@/components/layout/dashboard/Navbar";
import Sidebar from "@/components/layout/dashboard/Sidebar";
import { createDirector, getDirectors } from "@/lib/DirectorsApi/api";



interface DirectorType {
    _id: string;
    directorname: string;
    designation: string;
    description?: string;
    image?: string;
}


const BoardOfDirector = () => {
    const [isNavClosed, setIsNavClosed] = useState(false);

    const [directorData, setDirectorData] = useState<DirectorType[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [addingDirector, setAddingDirector] = useState(false);
    const [deletingDirectorId, setDeletingDirectorId] = useState<string | null>(null);

    const [form] = Form.useForm();
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const responsiveBreakpoint = 991;

    const fetchDirectorData = async () => {
        try {
            const data = await getDirectors();
            if (Array.isArray(data)) {
                setDirectorData(data);
            } else if (data?.directors && Array.isArray(data.directors)) {
                setDirectorData(data.directors);
            } else {
                setDirectorData([]);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch Director.");
        }
    };

    const handleAddDirector = async (values: {
        directorname: string;
        designation: string; description?: string; image?: any[]
    }) => {
        if (!token) {
            console.error("No token found.");
            return;
        }

        const imageFile = values.image?.[0]?.originFileObj;
        if (!imageFile) {
            toast.error("Please upload an image");
            return;
        }

        setAddingDirector(true);
        try {
            await createDirector(
                values.directorname, values.designation, values.description || "",
                imageFile, token);
            toast.success("Director added!");
            form.resetFields();
            setIsModalOpen(false);
            fetchDirectorData();
        } catch (error) {
            console.error(error);
            toast.error("Failed to add Director.");
        } finally {
            setAddingDirector(false);
        }
    };


    const handleDeleteDirector = async (directorId: string) => {
        if (!token) {
            toast.error("No token found.");
            return;
        }
        setDeletingDirectorId(directorId);

        try {
            await deleteEvent(directorId, token);
            toast.success("Director deleted successfully!");
            fetchDirectorData();
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete Director.");
        } finally {
            setDeletingDirectorId(null);
        }
    };

    const columns: ColumnsType<DirectorType> = [
        {
            title: "Display Image",
            dataIndex: "image",
            key: "image",
            render: (image: string) =>
                image ? (
                    <img
                        src={image}
                        alt="Director"
                        style={{ width: 60, height: 60, objectFit: "cover", borderRadius: "50%" }}
                    />
                ) : (
                    <span>No Image</span>
                ),
        },
        { title: "Name", dataIndex: "directorname", key: "directorname" },
        { title: "Designation", dataIndex: "designation", key: "designation" },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            render: (text: string) => text && text.trim() !== "" ? text : "N/A",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Button
                    danger
                    onClick={() => handleDeleteDirector(record._id)}
                    loading={deletingDirectorId === record._id}
                    disabled={deletingDirectorId === record._id}
                >
                    Delete
                </Button>
            ),
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
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleNav = () => {
        setIsNavClosed(!isNavClosed);
    };

    useEffect(() => {
        fetchDirectorData();
    }, []);

    return (
        <ProtectedPage allowedRoles={["board member"]}>
            <section className={`myheader ${isNavClosed ? "nav-closed" : ""}`}>
                <Navbar toggleNav={toggleNav} />
                <div className="main">
                    <Sidebar isNavClosed={isNavClosed} />
                    <div
                        className="page-content"
                        onClick={() => setIsNavClosed(window.innerWidth <= responsiveBreakpoint ? true : false)}
                    >
                        <div className="store-wrap">
                            <div className="d-flex justify-content-between align-items-center">
                                <h6>Events List</h6>
                                <Button onClick={() => setIsModalOpen(true)}>Add Director</Button>
                            </div>

                            <div className="event-table-wrap">
                                <Table
                                    className="mt-3"
                                    columns={columns}
                                    dataSource={directorData}
                                    rowKey="_id"
                                />
                            </div>

                            <Modal title="Add Director" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
                                <Form form={form} onFinish={handleAddDirector} layout="vertical">
                                    <Form.Item
                                        label="Director Name"
                                        name="directorname"
                                        rules={[{ required: true, message: "Please enter name" }]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        label="Designation"
                                        name="designation"
                                        rules={[{ required: true, message: "Please enter designation" }]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item label="Description" name="description">
                                        <Input.TextArea rows={3} />
                                    </Form.Item>
                                    <Form.Item
                                        label="Upload Image"
                                        name="image"
                                        valuePropName="fileList"
                                        getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                                        rules={[{ required: true, message: "Please upload an image" }]}
                                    >
                                        <Upload beforeUpload={() => false} maxCount={1}>
                                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                        </Upload>
                                    </Form.Item>

                                    <Button type="primary" htmlType="submit" loading={addingDirector}>
                                        Submit
                                    </Button>
                                </Form>
                            </Modal>
                        </div>
                    </div>
                </div>
            </section>
        </ProtectedPage>
    );
};

export default BoardOfDirector;
