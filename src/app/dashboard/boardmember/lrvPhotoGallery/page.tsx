"use client"
import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input } from "antd";
import { Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";
import { getLibrarys, createLibrary, deleteLibrary, uploadImageToLibrary } from "@/lib/GalleryApi/api";
import type { ColumnsType } from "antd/es/table";
import ProtectedPage from "@/components/ProtectedPage";
import Navbar from "@/components/layout/dashboard/Navbar";
import Sidebar from "@/components/layout/dashboard/Sidebar";
import axios from "axios";



const AddLibrary = () => {
    const [isNavClosed, setIsNavClosed] = useState(false);
    const responsiveBreakpoint = 991;
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
    interface LibraryType {
        _id: string;
        libraryname: string;
        description?: string;
        images?: string[];
    }
    const [libraryData, setLibraryData] = useState<LibraryType[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [libraryModalOpen, setLibraryModalOpen] = useState(false);
    const [currentLibraryLibraryId, setCurrentLibraryLibraryId] = useState<string | null>(null);
    const [fileList, setFileList] = useState<any[]>([]);

    // loading states
    const [addingLibrary, setAddingLibrary] = useState(false);
    const [deletingLibraryId, setDeletingLibraryId] = useState<string | null>(null);

    const [form] = Form.useForm();
    const token = localStorage.getItem("token");



    const fetchLibraryData = async () => {
        try {
            const data = await getLibrarys();
            setLibraryData(data || []);

        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch librarys.");
        }
    };

    const handleAddLibrary = async (values: { libraryname: string }) => {
        if (!token) {
            console.error("No token found.");
            return;
        }
        setAddingLibrary(true);
        try {
            await createLibrary(values.libraryname, token);
            toast.success("Library added!");
            form.resetFields();
            setIsModalOpen(false);
            fetchLibraryData();
        } catch (error) {
            console.error(error);
            toast.error("Failed to add library.");
        } finally {
            setAddingLibrary(false);
        }
    };

    const handleDeleteLibrary = async (libraryId: string) => {
        if (!token) {
            toast.error("No token found.");
            return;
        }
        setDeletingLibraryId(libraryId);

        try {
            await deleteLibrary(libraryId, token);
            toast.success("Library deleted successfully!");
            fetchLibraryData();
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete library.");
        } finally {
            setDeletingLibraryId(null);
        }
    };


    const handleUpload = async (file: File) => {
        if (!currentLibraryLibraryId || !token) return;
        const formData = new FormData();
        formData.append("libraryId", currentLibraryLibraryId);
        formData.append("image", file);

        try {
            await uploadImageToLibrary(formData, token);
            toast.success("Image uploaded successfully!");
            setLibraryModalOpen(false);
            fetchLibraryData();
        } catch (error) {
            console.error(error);
            toast.error("Image upload failed.");
        }
    };


    const deleteImage = async (libraryId: string, imageUrl: string) => {
        if (!token) {
            toast.error("No token found.");
            return;
        }
        try {
            const response = await axios.delete('/api/librarys/deleteImages', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                data: {
                    libraryId,
                    imageUrl,
                },
            });

            if (response.status === 200) {
                console.log('Image deleted successfully:', response.data);
            } else {
                console.error('Error deleting image:', response.data.message);
            }
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };


    const columns: ColumnsType<LibraryType> = [
        { title: "Library Name", dataIndex: "libraryname", key: "libraryname" },

        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <>
                    <Button
                        onClick={() => {
                            setCurrentLibraryLibraryId(record._id);
                            setLibraryModalOpen(true);

                            const library = libraryData.find(library => library._id === record._id);
                            if (library?.images?.length) {
                                const mappedImages = library.images.map((imgUrl, index) => ({
                                    uid: String(-index),
                                    name: `image-${index}`,
                                    status: 'done',
                                    url: imgUrl,
                                }));
                                setFileList(mappedImages);
                            } else {
                                setFileList([]);
                            }
                        }}
                        style={{ marginRight: 8 }}
                    >
                        Add Library
                    </Button>

                    <Button
                        danger
                        onClick={() => handleDeleteLibrary(record._id)}
                        loading={deletingLibraryId === record._id}
                        disabled={deletingLibraryId === record._id}
                    >
                        Delete
                    </Button>
                </>

            ),
        },
    ];


    useEffect(() => {
        fetchLibraryData();
    }, []);



    return (
        <ProtectedPage allowedRoles={['board member']}>
            <section className={`myheader ${isNavClosed ? 'nav-closed' : ''}`}>
                <div className="">
                    <Navbar toggleNav={toggleNav} />
                    <div className="">
                        <div className="main">
                            <Sidebar isNavClosed={isNavClosed} />
                            <div className="page-content" onClick={() => setIsNavClosed(window.innerWidth <= responsiveBreakpoint ? true : false)}>
                                <>
                                    <div className="store-wrap">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <h6>Librarys List</h6>
                                            <Button onClick={() => setIsModalOpen(true)}>Add Library</Button>
                                        </div>

                                        <div className="library-table-wrap">
                                            <Table
                                                className="mt-3"
                                                columns={columns}
                                                dataSource={libraryData}
                                                rowKey="_id"
                                            />
                                        </div>

                                        <Modal
                                            title="Add Library"
                                            open={isModalOpen}
                                            onCancel={() => setIsModalOpen(false)}
                                            footer={null}
                                        >
                                            <Form form={form} onFinish={handleAddLibrary} layout="vertical">
                                                <Form.Item
                                                    label="Library Name"
                                                    name="libraryname"
                                                    rules={[{ required: true, message: "Please enter library name" }]}
                                                >
                                                    <Input />
                                                </Form.Item>
                                                <Button type="primary" htmlType="submit" loading={addingLibrary}>Submit</Button>
                                            </Form>
                                        </Modal>



                                        <Modal
                                            title="Upload Library Images"
                                            open={libraryModalOpen}
                                            onCancel={() => {
                                                setLibraryModalOpen(false);
                                                setFileList([]);
                                            }}
                                            footer={null}
                                        >
                                            <Upload
                                                listType="picture-card"
                                                fileList={fileList}
                                                customRequest={({ file, onSuccess, onError }) => {
                                                    handleUpload(file as File)
                                                        .then(() => onSuccess && onSuccess("ok"))
                                                        .catch(onError);
                                                }}
                                                onRemove={async (file) => {
                                                    if (!currentLibraryLibraryId || !file.url) return;
                                                    await deleteImage(currentLibraryLibraryId, file.url);
                                                    setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
                                                }}
                                                showUploadList={{ showRemoveIcon: true }}
                                                multiple
                                                // beforeUpload={() => false}
                                                beforeUpload={(file) => {
                                                    handleUpload(file);
                                                    return false;
                                                }}
                                            >
                                                {/* {fileList.length >= 8 ? null : ( */}
                                                <div>
                                                    <PlusOutlined />
                                                    <div style={{ marginTop: 8 }}>Upload</div>
                                                </div>
                                                {/* )} */}
                                            </Upload>
                                        </Modal>



                                    </div>
                                </>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </ProtectedPage >
    );
};

export default AddLibrary;
