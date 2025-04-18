"use client"
import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Upload } from "antd";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import toast from "react-hot-toast";
import ProtectedPage from "@/components/ProtectedPage";
import Navbar from "@/components/layout/dashboard/Navbar";
import Sidebar from "@/components/layout/dashboard/Sidebar";
import { UploadOutlined } from "@mui/icons-material";
import axios from "axios";


const AddNewsletter = () => {
    const [form] = Form.useForm();
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const [isNavClosed, setIsNavClosed] = useState(false);
    const responsiveBreakpoint = 991;
    const token = sessionStorage.getItem("token")

    const [userData, setUserData] = useState<any>([]);

    

    const handleAddNewsLetter = async (values: any) => {
        console.log("hello")
        if (!file) {
            toast.error("Please upload a PDF file.");
            return;
        }

        const formData = new FormData();
        formData.append("titlename", values.titlename);
        formData.append("file", file);

        try {
            setLoading(true);
            const res = await axios.post("/api/newsletter/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            toast.success(res.data.message || "Newsletter uploaded successfully");
            form.resetFields();
            setFile(null);
            setModalVisible(false);
        } catch (error) {
            console.error("Upload Error:", error);
            // message.error(error?.response?.data?.message || "Upload failed");
        } finally {
            setLoading(false);
        }
    };







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
                                                    <h6>Newsletters List</h6>
                                                </div>
                                                <div className="col-lg-6 col-md-10">
                                                    <div className="d-flex justify-content-end search-wrap">
                                                        <Button
                                                            type="primary"
                                                            icon={<AddOutlinedIcon />}
                                                            onClick={() => setModalVisible(true)}
                                                        >
                                                            Add NewsLetter
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>

                                           
                                        </div>
                                    </div>
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
                            </div>
                        </div>
                    </div>
                </section>
            </ProtectedPage >
        </>
    );
};

export default AddNewsletter;
