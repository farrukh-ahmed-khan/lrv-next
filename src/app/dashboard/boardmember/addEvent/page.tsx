"use client"
import React, { useEffect, useState } from "react";
import SlateEditor from "@/components/ui/dashboard/TiptapEditor";


import { Table, Button, Modal, Form, Input } from "antd";
import toast from "react-hot-toast";
import { getEvents, createEvent, addEventDescription } from "@/lib/EventsApi/api"; // you'll define these
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

    const [eventData, setEventData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [description, setDescription] = useState('');
    const [currentEventId, setCurrentEventId] = useState<string | null>(null);
    const [descModalOpen, setDescModalOpen] = useState(false);

    const [form] = Form.useForm();
    const token = sessionStorage.getItem("token");

    interface EventType {
        _id: string;
        eventname: string;
        description?: string;
    }

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





    const columns: ColumnsType<EventType> = [
        { title: "Event Name", dataIndex: "eventname", key: "eventname" },
        { title: "Description", dataIndex: "description", key: "description" },
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
                        }}
                        style={{ marginRight: 8 }}
                    >
                        Add Description
                    </Button>
                </>
            )
        }
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

                                        <Table
                                            className="mt-3"
                                            columns={columns}
                                            dataSource={eventData}
                                            rowKey="_id"
                                        />

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
                                                if (!currentEventId || !token) return;
                                                try {
                                                    await addEventDescription(currentEventId, description, token);
                                                    toast.success("Description added!");
                                                    setDescModalOpen(false);
                                                    fetchEventData();
                                                } catch (error) {
                                                    console.error(error);
                                                    toast.error("Failed to add description.");
                                                }
                                            }}
                                        >
                                            <SlateEditor />

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
