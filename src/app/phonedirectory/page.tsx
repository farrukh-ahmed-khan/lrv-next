"use client"

import React, { useEffect, useState } from "react";
import "./phonedirectory.scss"
import toast from "react-hot-toast";
import { Input, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import Header from "@/components/layout/Navbar";
import InnerBanner from "@/components/ui/InnerBanner";
import Footer from "@/components/layout/Footer";
import { getAllUsers } from "@/lib/UsersApi/api";
import ProtectedPage from "@/components/ProtectedPage";
import Link from "next/link";
import Image from "next/image";
import directoryimg from "@/assets/images/Directory-Image.png"
import pdficon from "@/assets/images/pdf-icon.webp"





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

const PhoneDirectory = () => {
    const [searchText, setSearchText] = useState<string>("");
    const [userData, setUserData] = useState<User[]>([]);
    const [filterData, setFilterData] = useState<User[]>([]);
    const token = localStorage.getItem("token")

    const columns: ColumnsType<User> = [
        {
            title: "First Name",
            dataIndex: "firstname",
            key: "firstname",
        },
        {
            title: "lastName",
            dataIndex: "lastname",
            key: "lastname",
        },
        {
            title: "E-Mail Address",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Role",
            dataIndex: "role",
            key: "role",
        },
        {
            title: "Mobile Phone",
            dataIndex: "phoneNumber",
            key: "phoneNumber",
        },
        {
            title: "Street Address",
            dataIndex: "streetAddress",
            key: "streetAddress",
        },

    ];

    const handleSearch = (value: string) => {
        setSearchText(value);
        const filtered = userData.filter((item) =>
            Object.values(item).some(
                (val) =>
                    typeof val === "string" &&
                    val.toLowerCase().includes(value.toLowerCase())
            )
        );
        setFilterData(filtered);
    };

    const fetchUserData = async () => {

        if (!token) {
            console.error("No token found.");
            return;
        }

        try {
            const data = await getAllUsers(token);

            const fetchedData = data.users.map((data: User, index: number) => ({
                id: data._id,
                firstname: data.firstname,
                lastname: data.lastname,
                email: data.email,
                phoneNumber: data.phoneNumber,
                streetAddress: data.streetAddress,
                role: data.role,
                status: data.status,
            }));
            setUserData(fetchedData)
            setFilterData(fetchedData)
            // toast.success(data.message);
        } catch (error: any) {
            console.error(error);
            toast.error("Error orders data:", error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    return (
        <ProtectedPage allowedRoles={["home owner", "home member", "board member", "admin"]}>
            <div className="phonedirectory-wrapper">
                <Header />
                <>
                    <InnerBanner title="LRV Phone Directory" />
                </>
                <section className="table-wrappper">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="para-wrap">
                                    <p>
                                        The LRV Directory is your connection to your LRV neighbors. This Directory is private and used exclusively and strictly for neighborly concerns and causes.
                                        This private directory is not to be used for commercial or business marketing purposes.
                                        <br />
                                        <br />
                                        Search Directory
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="table-wrap">
                                <div className="input">
                                    <Input
                                        placeholder="Search..."
                                        value={searchText}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        style={{ marginBottom: 16, width: 200 }}
                                    />
                                </div>
                                <div className="table">
                                    <Table
                                        className="responsive-table"
                                        columns={columns}
                                        dataSource={filterData}
                                        pagination={{
                                            pageSize: 50,
                                            showSizeChanger: true,
                                            pageSizeOptions: ["10", "20", "50", "100"],
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        {/* <div className="row">
                            <div className="col-lg-12 d-flex justify-center">
                                <div className="para-wrap"
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        width: "100%",
                                        margin: "20px 0"
                                    }}
                                >
                                    <p>
                                        To download & print the most current
                                        <br />
                                        LRV PhoneDirectory,
                                        <br />
                                        click on the PDF icon below...
                                        <br />
                                    </p>
                                    <div className="pdf-img-wrap d-flex justify-center">
                                        <div className="img-wrap">
                                            <Image src={pdficon} alt="directory img"></Image>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-12"
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    width: "100%",
                                }}
                            >
                                <Link href="https://www.lrvhoa.net/_files/ugd/eccc55_7c1edbea0ebf432d8530372b8d169a92.pdf">
                                    <Image src={directoryimg} alt="directory img"></Image>
                                </Link>
                            </div>
                        </div> */}
                    </div>
                </section>

                <Footer />
            </div>
        </ProtectedPage>
    );
};

export default PhoneDirectory;
