"use client";
import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Upload, Space, Table, Popconfirm } from "antd";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import toast from "react-hot-toast";
import ProtectedPage from "@/components/ProtectedPage";
import Navbar from "@/components/layout/dashboard/Navbar";
import Sidebar from "@/components/layout/dashboard/Sidebar";
import { UploadOutlined, Edit, Delete } from "@mui/icons-material";
import { addNewsletter, getNewsletters, deleteNewsletter, updateNewsletter } from "@/lib/NewsLetterApi/api";

const AddNewsletter = () => {
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();
    const [file, setFile] = useState<File | null>(null);
    const [editFile, setEditFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [isNavClosed, setIsNavClosed] = useState(false);
    const responsiveBreakpoint = 991;
    const token = localStorage.getItem("token");

    const [newsletterData, setNewsletterData] = useState<any[]>([]);

    interface NewsLetter {
        _id: string;
        fileUrl: string;
        title: string;
    }

    const getAllNewsletters = async () => {
        if (!token) return toast.error("Please Login");
        try {
            const res = await getNewsletters(token);
            const fetchedData = res.newsletters.map((data: NewsLetter, index: number) => ({
                key: data._id,
                id: data._id,
                title: data.title,
                file: data.fileUrl
            }));
            setNewsletterData(fetchedData);
        } catch (error) {
            console.error("Fetch Error:", error);
        }
    };

    const handleAddNewsLetter = async (values: any) => {
        if (!file) return toast.error("Please upload a PDF file.");
        if (!token) return toast.error("Please Login");

        const formData = new FormData();
        formData.append("titlename", values.titlename);
        formData.append("file", file);

        try {
            setLoading(true);
            const res = await addNewsletter(formData, token);
            toast.success(res.data.message || "Newsletter uploaded successfully");
            form.resetFields();
            setFile(null);
            setModalVisible(false);
            getAllNewsletters();
        } catch (error) {
            console.error("Upload Error:", error);
        } finally {
            setLoading(false);
            window.location.reload()
        }
    };

    const handleDelete = async (id: string) => {
        if (!token) return toast.error("Please Login");
        try {
            await deleteNewsletter(id, token);
            toast.success("Newsletter deleted");
            getAllNewsletters();
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    const openEditModal = (record: any) => {
        setEditModalVisible(true);
        setEditingId(record.id);
        editForm.setFieldsValue({ titlename: record.title });
        setEditFile(null);
    };

    const handleUpdate = async (values: any) => {
        if (!token || !editingId) return toast.error("Login or ID missing");

        const formData = new FormData();
        formData.append("id", editingId)
        formData.append("titlename", values.titlename);
        if (editFile) formData.append("file", editFile);

        try {
            setLoading(true);
            await updateNewsletter(formData, token);
            toast.success("Newsletter updated");
            setEditModalVisible(false);
            getAllNewsletters();
        } catch (error) {
            toast.error("Update failed");
        } finally {
            setLoading(false);
            window.location.reload()
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
        getAllNewsletters();
    }, []);

    const toggleNav = () => setIsNavClosed(!isNavClosed);

    const columns = [
        {
            title: "Title",
            dataIndex: "title",
            key: "title"
        },
        {
            title: "File",
            dataIndex: "file",
            key: "file",
            render: (file: string) => (
                <a href={file} target="_blank" rel="noopener noreferrer">
                    View PDF
                </a>
            )
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
                                        <h6>Newsletters List</h6>
                                    </div>
                                    <div className="col-lg-6 d-flex justify-content-end">
                                        <Button type="primary" icon={<AddOutlinedIcon />} onClick={() => setModalVisible(true)}>
                                            Add Newsletter
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
                                    <Form layout="vertical" form={form} onFinish={handleAddNewsLetter}>
                                        <Form.Item
                                            label="Title Name"
                                            name="titlename"
                                            rules={[{ required: true, message: "Please Enter Title Name" }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item label="Upload PDF" required>
                                            <Upload
                                                beforeUpload={(file: any) => {
                                                    const isPdf = file.type === "application/pdf";
                                                    if (!isPdf) {
                                                        toast.error("Only PDF files are allowed.");
                                                        return Upload.LIST_IGNORE;
                                                    }
                                                    setFile(file);
                                                    return false;
                                                }}
                                                accept=".pdf"
                                                maxCount={1}
                                            >
                                                <Button icon={<UploadOutlined />}>Select PDF</Button>
                                            </Upload>
                                        </Form.Item>
                                        <Form.Item>
                                            <Button type="primary" htmlType="submit" block loading={loading}>
                                                Add Newsletter
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                </Modal>

                                <Modal
                                    title="Edit Newsletter"
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
                                        <Form.Item label="Upload New PDF (optional)">
                                            <Upload
                                                beforeUpload={(file: any) => {
                                                    const isPdf = file.type === "application/pdf";
                                                    if (!isPdf) {
                                                        toast.error("Only PDF files are allowed.");
                                                        return Upload.LIST_IGNORE;
                                                    }
                                                    setEditFile(file);
                                                    return false;
                                                }}
                                                accept=".pdf"
                                                maxCount={1}
                                            >
                                                <Button icon={<UploadOutlined />}>Select New PDF</Button>
                                            </Upload>
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

export default AddNewsletter;
