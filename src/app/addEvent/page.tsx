"use client"
import React, { useEffect, useState } from "react";

import { Table, Select, Button } from "antd";
import toast from "react-hot-toast";
import { getUsers } from "@/lib/UsersApi/api";
import Link from "next/link";

const addEvent = () => {
    const { Option } = Select;
    const [userData, setUserData] = useState([]);
    const user = JSON.parse(sessionStorage.getItem("user") || "{}");
    const token = sessionStorage.getItem("token")
    const role = user.role;

    interface Event {
        _id: string;
        eventname: string;
        description: string;
    }

    const fetchEventData = async () => {
        if (!token) {
            console.error("No token found.");
            return;
        }

        try {
            const data = await getUsers(token);


            // toast.success(data.message);
        } catch (error: any) {
            console.error(error);
            toast.error("Error orders data:", error);
        }
    };


    const columns = [
        {
            title: "Event Name",
            dataIndex: "eventname",
            key: "eventname",
        },
        {
            title: "Descripiton",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: any) => {
                return (
                    <Button>
                        Add Description
                    </Button>
                );
            },
        },
    ];

    useEffect(() => {
        fetchEventData();
    }, []);

    return (
        <>
            <div className="row">
                <div className="col-md-12">
                    <div className="row store-wrap">
                        <div className="col-lg-6 col-md-2">
                            <div>
                                <h6>Events List</h6>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-10">
                            <div className="d-flex justify-content-end search-wrap">
                                <Button>
                                    Add Event
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-3">
                        <div className={`store-table-wrap active-table`}>
                            <Table
                                className="responsive-table"
                                columns={columns}
                                dataSource={userData}
                            />
                        </div>
                    </div>
                </div>
            </div>


        </>
    );
};

export default addEvent;
