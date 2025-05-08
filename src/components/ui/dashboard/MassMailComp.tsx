import React, { useEffect, useMemo, useState } from "react";
import { Space, Select, Button, Input } from "antd";
import toast from "react-hot-toast";
import { getUsers } from "@/lib/UsersApi/api";
import axios from "axios";

const SendMassMail = () => {
    const { Option } = Select;
    const { TextArea } = Input;

    interface User {
        _id: string;
        firstname: string;
        lastname: string;
        email: string;
        phoneNumber: string;
        streetAddress: string;
        status: string;
        role: string;
    }

    const [userData, setUserData] = useState<User[]>([]);
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const [emailMode, setEmailMode] = useState<string>("all");
    const [selectedStreet, setSelectedStreet] = useState<string>("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false); // <-- Add this state


    const user = JSON.parse(sessionStorage.getItem("user") || "{}");
    const token = sessionStorage.getItem("token");
    const role = user.role;

    const fetchUserData = async () => {
        if (!token) {
            console.error("No token found.");
            return;
        }



        try {
            const data = await getUsers(token);
            const fetchedData = data.users
                .filter((user: User) => user.role === "home owner")
                .map((data: User) => ({
                    _id: data._id,
                    firstname: data.firstname,
                    lastname: data.lastname,
                    email: data.email,
                    phoneNumber: data.phoneNumber,
                    streetAddress: data.streetAddress,
                    role: data.role,
                    status: data.status,
                }));
            setUserData(fetchedData);
        } catch (error: any) {
            console.error(error);
            toast.error("Error fetching user data");
        }
    };

    const handleSendEmails = async () => {
        if (!subject || !message) {
            toast.error("Subject and message are required");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                recipientType:
                    emailMode === "all"
                        ? "all"
                        : emailMode === "street"
                            ? "street"
                            : "specific",
                street: emailMode === "street" ? selectedStreet : undefined,
                userIds: emailMode === "specific" ? selectedUserIds : undefined,
                subject,
                message,
            };

            await axios.post("/api/send-mass-email", payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            toast.success("Email sent successfully!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to send email");
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const uniqueStreets = useMemo(() => {
        return Array.from(new Set(userData.map((user) => user.streetAddress)));
    }, [userData]);

    useEffect(() => {
        fetchUserData();
    }, []);

    return (
        <div className="row">
            <div className="col-md-12">
                {role === "board member" && (
                    <div className="mt-4 mb-4">
                        <h6>Send Mass Email</h6>
                        <Space direction="vertical" style={{ width: "100%" }}>
                            <Select
                                value={emailMode}
                                onChange={setEmailMode}
                                style={{ width: 300 }}
                            >
                                <Option value="all">All Homeowners</Option>
                                <Option value="street">By Street</Option>
                                <Option value="specific">Select Specific Users</Option>
                            </Select>

                            {emailMode === "street" && (
                                <Select
                                    placeholder="Select Street"
                                    value={selectedStreet}
                                    onChange={setSelectedStreet}
                                    style={{ width: 300 }}
                                >
                                    {uniqueStreets.map((street) => (
                                        <Option key={street} value={street}>
                                            {street}
                                        </Option>
                                    ))}
                                </Select>
                            )}

                            {emailMode === "specific" && (
                                <Select
                                    mode="multiple"
                                    allowClear
                                    style={{ width: "100%" }}
                                    placeholder="Select Homeowners"
                                    value={selectedUserIds}
                                    onChange={setSelectedUserIds}
                                >
                                    {userData.map((u) => (
                                        <Option key={u._id} value={u._id}>
                                            {u.firstname} {u.lastname} ({u.email})
                                        </Option>
                                    ))}
                                </Select>
                            )}

                            <Input
                                placeholder="Email Subject"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                            />
                            <TextArea
                                placeholder="Email Message"
                                rows={4}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <Button type="primary" onClick={handleSendEmails} loading={loading}>
                                Send Email
                            </Button>
                        </Space>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SendMassMail;
