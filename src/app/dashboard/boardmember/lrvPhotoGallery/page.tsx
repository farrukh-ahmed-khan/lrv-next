"use client"
import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input } from "antd";
import { Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";
import { getEvents, createEvent, deleteEvent, uploadImageToEvent } from "@/lib/EventsApi/api"; 
import type { ColumnsType } from "antd/es/table";
import ProtectedPage from "@/components/ProtectedPage";
import Navbar from "@/components/layout/dashboard/Navbar";
import Sidebar from "@/components/layout/dashboard/Sidebar";
import axios from "axios";



const AddEvent = () => {
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
    interface EventType {
        _id: string;
        eventname: string;
        description?: string;
        images?: string[];
    }
    const [eventData, setEventData] = useState<EventType[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [libraryModalOpen, setLibraryModalOpen] = useState(false);
    const [currentLibraryEventId, setCurrentLibraryEventId] = useState<string | null>(null);
    const [fileList, setFileList] = useState<any[]>([]);

    // loading states
    const [addingEvent, setAddingEvent] = useState(false);
    const [deletingEventId, setDeletingEventId] = useState<string | null>(null);

    const [form] = Form.useForm();
    const token = localStorage.getItem("token");



    const fetchEventData = async () => {
        try {
            const data = await getEvents();
            setEventData(data || []);

        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch events.");
        }
    };

    const handleAddEvent = async (values: { eventname: string }) => {
        if (!token) {
            console.error("No token found.");
            return;
        }
        setAddingEvent(true);
        try {
            await createEvent(values.eventname, token);
            toast.success("Event added!");
            form.resetFields();
            setIsModalOpen(false);
            fetchEventData();
        } catch (error) {
            console.error(error);
            toast.error("Failed to add event.");
        } finally {
            setAddingEvent(false);
        }
    };

    const handleDeleteEvent = async (eventId: string) => {
        if (!token) {
            toast.error("No token found.");
            return;
        }
        setDeletingEventId(eventId);

        try {
            await deleteEvent(eventId, token);
            toast.success("Event deleted successfully!");
            fetchEventData();
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete event.");
        } finally {
            setDeletingEventId(null);
        }
    };


    const handleUpload = async (file: File) => {
        if (!currentLibraryEventId || !token) return;
        const formData = new FormData();
        formData.append("eventId", currentLibraryEventId);
        formData.append("image", file);

        try {
            await uploadImageToEvent(currentLibraryEventId, formData, token);
            toast.success("Image uploaded successfully!");
            setLibraryModalOpen(false);
            fetchEventData();
        } catch (error) {
            console.error(error);
            toast.error("Image upload failed.");
        }
    };


    const deleteImage = async (eventId: string, imageUrl: string) => {
        if (!token) {
            toast.error("No token found.");
            return;
        }
        try {
            const response = await axios.delete('/api/events/deleteImages', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                data: {
                    eventId,
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


    const columns: ColumnsType<EventType> = [
        { title: "Event Name", dataIndex: "eventname", key: "eventname" },
        
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <>
                    <Button
                        onClick={() => {
                            setCurrentLibraryEventId(record._id);
                            setLibraryModalOpen(true);

                            const event = eventData.find(event => event._id === record._id);
                            if (event?.images?.length) {
                                const mappedImages = event.images.map((imgUrl, index) => ({
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
                        onClick={() => handleDeleteEvent(record._id)}
                        loading={deletingEventId === record._id}
                        disabled={deletingEventId === record._id}
                    >
                        Delete
                    </Button>
                </>

            ),
        },
    ];


    useEffect(() => {
        fetchEventData();
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
                                            <h6>Events List</h6>
                                            <Button onClick={() => setIsModalOpen(true)}>Add Event</Button>
                                        </div>

                                        <div className="event-table-wrap">
                                            <Table
                                                className="mt-3"
                                                columns={columns}
                                                dataSource={eventData}
                                                rowKey="_id"
                                            />
                                        </div>

                                        <Modal
                                            title="Add Event"
                                            open={isModalOpen}
                                            onCancel={() => setIsModalOpen(false)}
                                            footer={null}
                                        >
                                            <Form form={form} onFinish={handleAddEvent} layout="vertical">
                                                <Form.Item
                                                    label="Event Name"
                                                    name="eventname"
                                                    rules={[{ required: true, message: "Please enter event name" }]}
                                                >
                                                    <Input />
                                                </Form.Item>
                                                <Button type="primary" htmlType="submit" loading={addingEvent}>Submit</Button>
                                            </Form>
                                        </Modal>

                                        

                                        <Modal
                                            title="Upload Event Images"
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
                                                    if (!currentLibraryEventId || !file.url) return;
                                                    await deleteImage(currentLibraryEventId, file.url);
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

export default AddEvent;
