"use client"
import React, { useEffect, useRef, useState } from "react";

// import SlateEditor from "@/components/ui/dashboard/TiptapEditor";
import "quill/dist/quill.core.css";
import Quill from 'quill';

const Delta = Quill.import('delta');
import { Table, Button, Modal, Form, Input } from "antd";
import { Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";


import toast from "react-hot-toast";
import { getEvents, createEvent, addEventDescription, deleteEvent, uploadImageToEvent } from "@/lib/EventsApi/api"; // you'll define these
import type { ColumnsType } from "antd/es/table";
import ProtectedPage from "@/components/ProtectedPage";
import Navbar from "@/components/layout/dashboard/Navbar";
import Sidebar from "@/components/layout/dashboard/Sidebar";
import Editor from "@/components/ui/dashboard/editor";
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
    const [description, setDescription] = useState('');
    const [currentEventId, setCurrentEventId] = useState<string | null>(null);
    const [descModalOpen, setDescModalOpen] = useState(false);
    const [libraryModalOpen, setLibraryModalOpen] = useState(false);
    const [currentLibraryEventId, setCurrentLibraryEventId] = useState<string | null>(null);
    const [fileList, setFileList] = useState<any[]>([]);

    const [range, setRange] = useState();
    const [lastChange, setLastChange] = useState();
    const [readOnly, setReadOnly] = useState(false);



    const quillRef = useRef<Quill | null>(null);



    const [form] = Form.useForm();
    const token = sessionStorage.getItem("token");



    const fetchEventData = async () => {
        if (!token) return;
        try {
            const data = await getEvents(token);
            console.log(data)
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
        try {
            await createEvent(values.eventname, token);
            toast.success("Event added!");
            form.resetFields();
            setIsModalOpen(false);
            fetchEventData();
        } catch (error) {
            console.error(error);
            toast.error("Failed to add event.");
        }
    };

    const handleDeleteEvent = async (eventId: string) => {
        if (!token) {
            toast.error("No token found.");
            return;
        }

        try {
            await deleteEvent(eventId, token);
            toast.success("Event deleted successfully!");
            fetchEventData();
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete event.");
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
            title: "Description",
            dataIndex: "description",
            key: "description",
            render: (text: string | undefined) =>
                text ? (
                    <div dangerouslySetInnerHTML={{ __html: text.length > 100 ? text.slice(0, 10) + "..." : text }} />
                ) : (
                    <em>No description</em>
                ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <>
                    <Button
                        onClick={() => {
                            setCurrentEventId(record._id);
                            setDescription(record.description || "");
                            setDescModalOpen(true);
                            setTimeout(() => {
                                if (quillRef.current) {
                                    const quill = quillRef.current;
                                    const delta = quill.clipboard.convert({ html: record.description || "" });
                                    quill.setContents(delta, 'silent');
                                }
                            }, 0);
                        }}
                        style={{ marginRight: 8 }}
                    >
                        {record.description ? "Edit Description" : "Add Description"}
                    </Button>
                    {/* <Button
                        onClick={() => {
                            setCurrentLibraryEventId(record._id);
                            setLibraryModalOpen(true);
                        }}
                        style={{ marginRight: 8 }}
                    >
                        Add Library
                    </Button> */}

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
                                                <Button type="primary" htmlType="submit">Submit</Button>
                                            </Form>
                                        </Modal>

                                        <Modal
                                            title="Add Description"
                                            open={descModalOpen}
                                            onCancel={() => setDescModalOpen(false)}
                                            onOk={async () => {
                                                if (!currentEventId || !token || !quillRef.current) return;
                                                const quill = quillRef.current;
                                                const htmlDescription = quill.root.innerHTML;
                                                try {
                                                    await addEventDescription(currentEventId, htmlDescription, token);
                                                    toast.success("Description added!");
                                                    setDescModalOpen(false);
                                                    fetchEventData();
                                                } catch (error) {
                                                    console.error(error);
                                                    toast.error("Failed to add description.");
                                                }
                                            }}
                                        >
                                            <Editor
                                                ref={quillRef}
                                                readOnly={readOnly}
                                                defaultValue={description}
                                                onSelectionChange={setRange}
                                                onTextChange={setLastChange}
                                            />
                                        </Modal>
                                        {/* <Upload
                                                listType="picture-card"
                                                showUploadList={true}
                                                multiple
                                                beforeUpload={(file) => {
                                                    handleUpload(file); // loop in handleUpload if needed
                                                    return false;
                                                }}
                                            >
                                                <div>
                                                    <PlusOutlined />
                                                    <div style={{ marginTop: 8 }}>Upload</div>
                                                </div>
                                            </Upload> */}
                                        {/* <Modal
                                            title="Upload Event Images"
                                            open={libraryModalOpen}
                                            onCancel={() => setLibraryModalOpen(false)}
                                            footer={null}
                                        >
                                            

                                            <Upload
                                                listType="picture-card"
                                                showUploadList={true}
                                                multiple
                                                fileList={fileList}
                                                onChange={({ fileList: newFileList }) => setFileList(newFileList)}
                                                beforeUpload={(file) => {
                                                    handleUpload(file);
                                                    return false; // Prevent automatic upload
                                                }}
                                            >
                                                <div>
                                                    <PlusOutlined />
                                                    <div style={{ marginTop: 8 }}>Upload</div>
                                                </div>
                                            </Upload>

                                        </Modal> */}

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
                                                beforeUpload={() => false} // prevent automatic upload
                                            >
                                                {fileList.length >= 8 ? null : (
                                                    <div>
                                                        <PlusOutlined />
                                                        <div style={{ marginTop: 8 }}>Upload</div>
                                                    </div>
                                                )}
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
