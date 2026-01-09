"use client"
import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Upload, Space } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";
import { createEvent, deleteEvent, editEvent, RsvpEvents } from "@/lib/UpcomingEventsApi/api";
import type { ColumnsType } from "antd/es/table";
import ProtectedPage from "@/components/ProtectedPage";
import Navbar from "@/components/layout/dashboard/Navbar";
import Sidebar from "@/components/layout/dashboard/Sidebar";

interface RSVP {
    userId: { _id: string; name: string; email: string };
    status: "attended" | "not attended";
}


interface EventType {
    _id: string;
    eventname: string;
    date: string;
    description?: string;
    image?: string;
    rsvps?: RSVP[];
}

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
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleNav = () => {
        setIsNavClosed(!isNavClosed);
    };



    const [eventData, setEventData] = useState<EventType[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [editingEvent, setEditingEvent] = useState<EventType | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);


    const [deletingEventId, setDeletingEventId] = useState<string | null>(null);

    const [form] = Form.useForm();
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const fetchEventData = async () => {
        try {
            const data = await RsvpEvents();
            if (Array.isArray(data)) {
                setEventData(data);
            } else if (data?.events && Array.isArray(data.events)) {
                setEventData(data.events);
            } else {
                setEventData([]);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch events.");
        }
    };


    const handleSubmit = async (values: any) => {
        if (!token) return;

        setIsSubmitting(true);

        const imageFile = values.image?.[0]?.originFileObj || null;

        try {
            if (editingEvent) {
                await editEvent(
                    editingEvent._id,
                    values.eventname,
                    values.date,
                    values.description || "",
                    imageFile,
                    token
                );
                toast.success("Event updated successfully!");
            } else {
                if (!imageFile) {
                    toast.error("Please upload an image");
                    return;
                }

                await createEvent(
                    values.eventname,
                    values.date,
                    values.description || "",
                    imageFile,
                    token
                );
                toast.success("Event added successfully!");
            }

            setIsModalOpen(false);
            setEditingEvent(null);
            form.resetFields();
            fetchEventData();
        } catch (error) {
            console.error(error);
            toast.error("Operation failed");
        } finally {
            setIsSubmitting(false);
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

    const columns: ColumnsType<EventType> = [
        { title: "Event Name", dataIndex: "eventname", key: "eventname" },
        {
            title: "Attended Users",
            key: "attendedUsers",
            render: (_, record: any) => {
                const attended = record.rsvps?.filter((r: any) => r.status === "attended") || [];
                return attended.length > 0 ? (
                    <ul style={{ paddingLeft: "20px", margin: 0 }}>
                        {attended.map((r: any) => (
                            <li key={r.userId._id}>
                                {r.userId.name} ({r.userId.email})
                            </li>
                        ))}
                    </ul>
                ) : (
                    <span>No attendees yet</span>
                );
            },
        },
        {
            title: "Not Attended",
            key: "notAttended",
            render: (_, record: any) => {
                const notAttended = record.rsvps?.filter((r: any) => r.status === "not attended") || [];
                return notAttended.length > 0 ? (
                    <ul style={{ paddingLeft: "20px", margin: 0 }}>
                        {notAttended.map((r: any) => (
                            <li key={r.userId._id}>
                                {r.userId.name} ({r.userId.email})
                            </li>
                        ))}
                    </ul>
                ) : (
                    <span>None</span>
                );
            },
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button
                        danger
                        onClick={() => handleDeleteEvent(record._id)}
                        loading={deletingEventId === record._id}
                    >
                        Delete
                    </Button>

                    <Button
                        type="link"
                        onClick={() => {
                            setEditingEvent(record);

                            form.setFieldsValue({
                                eventname: record.eventname,
                                date: record.date
                                    ? new Date(record.date).toISOString().split("T")[0]
                                    : "",
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
        fetchEventData();
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
                                <h6>Upcoming Events</h6>
                                <Button onClick={() => setIsModalOpen(true)}>Add Event</Button>
                            </div>

                            <div className="event-table-wrap">
                                <Table
                                    className="mt-3"
                                    columns={columns}
                                    dataSource={eventData}
                                    rowKey="_id"
                                    expandable={{
                                        expandedRowRender: (record: any) => (
                                            <div className="rsvp-list">
                                                <h4 className="rsvp-title">Attended</h4>
                                                <ul className="rsvp-ul">
                                                    {record.rsvps
                                                        ?.filter((r: any) => r.status === "attended")
                                                        .map((r: any) => (
                                                            <li key={r.userId._id} className="rsvp-li attended">
                                                                {r.userId.name} <span className="email">({r.userId.email})</span>
                                                            </li>
                                                        ))}
                                                </ul>

                                                <h4 className="rsvp-title">Not Attended</h4>
                                                <ul className="rsvp-ul">
                                                    {record.rsvps
                                                        ?.filter((r: any) => r.status === "not attended")
                                                        .map((r: any) => (
                                                            <li key={r.userId._id} className="rsvp-li not-attended">
                                                                {r.userId.name} <span className="email">({r.userId.email})</span>
                                                            </li>
                                                        ))}
                                                </ul>
                                            </div>
                                        ),
                                    }}
                                />


                            </div>

                            <Modal
                                title={editingEvent ? "Edit Event" : "Add Event"}
                                open={isModalOpen}
                                onCancel={() => {
                                    setIsModalOpen(false);
                                    setEditingEvent(null);
                                    form.resetFields();
                                }}
                                footer={null}
                            >
                                <Form form={form} onFinish={handleSubmit} layout="vertical">
                                    <Form.Item
                                        label="Event Name"
                                        name="eventname"
                                        rules={[{ required: true }]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        label="Date"
                                        name="date"
                                        rules={[{ required: true }]}
                                    >
                                        <Input type="date" />
                                    </Form.Item>

                                    <Form.Item label="Description" name="description">
                                        <Input.TextArea rows={3} />
                                    </Form.Item>

                                    <Form.Item
                                        label={editingEvent ? "Update Image (optional)" : "Upload Image"}
                                        name="image"
                                        valuePropName="fileList"
                                        getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                                        rules={
                                            editingEvent
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
                                        {editingEvent ? "Update Event" : "Add Event"}
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

export default AddEvent;
