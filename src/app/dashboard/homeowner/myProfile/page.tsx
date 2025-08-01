"use client"
import React, { useEffect, useState } from "react";
import {  Form, Input, Button, Card } from "antd";
import toast from "react-hot-toast";
import ProtectedPage from "@/components/ProtectedPage";
import Navbar from "@/components/layout/dashboard/Navbar";
import Sidebar from "@/components/layout/dashboard/Sidebar";
import axios from "axios";




const HouseMembers = () => {
    const [isNavClosed, setIsNavClosed] = useState(false);
    const responsiveBreakpoint = 991;
    const [form] = Form.useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userData, setUserData] = useState<any>(null);

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        if (user) {
            setUserData(user);
            form.setFieldsValue({
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                phoneNumber: user.phoneNumber,
                streetAddress: user.streetAddress,
            });
        }
    }, []);

    const handleSubmit = async (values: any) => {
        setIsSubmitting(true);
        try {
            const res = await axios.put(
                "/api/user/update", 
                { ...values, id: user.id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success("Profile updated successfully!");

            const updatedUser = { ...user, ...values };
            localStorage.setItem("user", JSON.stringify(updatedUser));
        } catch (error: any) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Something went wrong!");
        } finally {
            setIsSubmitting(false);
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
            <ProtectedPage allowedRoles={["home owner", "home member", "board member"]}>
                <section className={`myheader ${isNavClosed ? 'nav-closed' : ''}`}>
                    <div className="">
                        <Navbar toggleNav={toggleNav} />
                        <div className="">
                            <div className="main">
                                <Sidebar isNavClosed={isNavClosed} />
                                <div className="page-content" onClick={() => setIsNavClosed(window.innerWidth <= responsiveBreakpoint ? true : false)}>
                                    <div className="container mt-5">
                                        <Card title="Update Profile" style={{ maxWidth: 600, margin: "0 auto" }}>
                                            <Form layout="vertical" form={form} onFinish={handleSubmit}>
                                                <Form.Item
                                                    label="First Name"
                                                    name="firstname"
                                                    rules={[{ required: true, message: "Please enter first name" }]}
                                                >
                                                    <Input />
                                                </Form.Item>

                                                <Form.Item
                                                    label="Last Name"
                                                    name="lastname"
                                                    rules={[{ required: true, message: "Please enter last name" }]}
                                                >
                                                    <Input />
                                                </Form.Item>

                                                <Form.Item
                                                    label="Email"
                                                    name="email"
                                                    rules={[{ required: true, type: "email", message: "Enter a valid email" }]}
                                                >
                                                    <Input />
                                                </Form.Item>

                                                <Form.Item
                                                    label="Phone Number"
                                                    name="phoneNumber"
                                                    rules={[{ required: true, message: "Please enter phone number" }]}
                                                >
                                                    <Input />
                                                </Form.Item>

                                                {/* <Form.Item
                                                    label="Street Address"
                                                    name="streetAddress"
                                                    rules={[{ required: true, message: "Please enter address" }]}
                                                >
                                                    <Input />
                                                </Form.Item> */}

                                                <Form.Item>
                                                    <Button type="primary" htmlType="submit" block loading={isSubmitting}>
                                                        Update Profile
                                                    </Button>
                                                </Form.Item>
                                            </Form>
                                        </Card>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </ProtectedPage >
        </>
    );
};

export default HouseMembers;
