"use client"
import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Upload, Space } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";
import type { ColumnsType } from "antd/es/table";
import ProtectedPage from "@/components/ProtectedPage";
import Navbar from "@/components/layout/dashboard/Navbar";
import Sidebar from "@/components/layout/dashboard/Sidebar";
import { createDirector, deleteDirector, editDirector, getDirectors } from "@/lib/DirectorsApi/api";



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
    const [editingDirector, setEditingDirector] = useState<DirectorType | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);


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


    const handleSubmit = async (values: any) => {
        if (!token) return;

        setIsSubmitting(true);

        const imageFile = values.image?.[0]?.originFileObj || null;

        try {
            if (editingDirector) {
                // EDIT
                await editDirector(
                    editingDirector._id,
                    values.directorname,
                    values.designation,
                    values.description || "",
                    imageFile,
                    token
                );
                toast.success("Director updated successfully!");
            } else {
                // ADD
                if (!imageFile) {
                    toast.error("Please upload an image");
                    return;
                }

                await createDirector(
                    values.directorname,
                    values.designation,
                    values.description || "",
                    imageFile,
                    token
                );
                toast.success("Director added successfully!");
            }

            setIsModalOpen(false);
            setEditingDirector(null);
            form.resetFields();
            fetchDirectorData();
        } catch (error) {
            console.error(error);
            toast.error("Operation failed");
        } finally {
            setIsSubmitting(false);
        }
    };





    const handleDeleteDirector = async (directorId: string) => {
        if (!token) {
            toast.error("No token found.");
            return;
        }
        setDeletingDirectorId(directorId);

        try {
            await deleteDirector(directorId, token);
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
                <Space>
                    <Button
                        danger
                        onClick={() => handleDeleteDirector(record._id)}
                        loading={deletingDirectorId === record._id}
                        disabled={deletingDirectorId === record._id}
                    >
                        Delete
                    </Button>

                    <Button
                        type="link"
                        onClick={() => {
                            setEditingDirector(record);

                            form.setFieldsValue({
                                directorname: record.directorname,
                                designation: record.designation,
                                description: record.description,
                                image: record.image
                                    ? [
                                        {
                                            uid: "-1",
                                            name: "existing-image",
                                            status: "done",
                                            url: record.image,
                                        },
                                    ]
                                    : [],
                            });

                            setIsModalOpen(true);
                        }}
                    >
                        Edit
                    </Button>

                </Space>
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
                                <h6>Board Member Bio</h6>
                                <Button
                                    onClick={() => {
                                        form.resetFields();
                                        setEditingDirector(null);
                                        setIsModalOpen(true);
                                    }}
                                >
                                    Add Director
                                </Button>
                            </div>

                            <div className="event-table-wrap">
                                <Table
                                    className="mt-3"
                                    columns={columns}
                                    dataSource={directorData}
                                    rowKey="_id"
                                />
                            </div>

                            <Modal
                                title={editingDirector ? "Edit Director" : "Add Director"}
                                open={isModalOpen}
                                onCancel={() => {
                                    setIsModalOpen(false);
                                    setEditingDirector(null);
                                    form.resetFields();
                                }}
                                footer={null}
                            >
                                <Form form={form} onFinish={handleSubmit} layout="vertical">
                                    <Form.Item
                                        label="Director Name"
                                        name="directorname"
                                        rules={[{ required: true }]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        label="Designation"
                                        name="designation"
                                        rules={[{ required: true }]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item label="Description" name="description">
                                        <Input.TextArea rows={3} />
                                    </Form.Item>

                                    <Form.Item
                                        label={editingDirector ? "Update Image (optional)" : "Upload Image"}
                                        name="image"
                                        valuePropName="fileList"
                                        getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                                        rules={
                                            editingDirector
                                                ? []
                                                : [{ required: true, message: "Please upload an image" }]
                                        }
                                    >
                                        <Upload beforeUpload={() => false} maxCount={1}>
                                            <Button icon={<UploadOutlined />}>Upload</Button>
                                        </Upload>
                                    </Form.Item>

                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={isSubmitting}
                                        disabled={isSubmitting}
                                    >
                                        {editingDirector ? "Update Director" : "Add Director"}
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
