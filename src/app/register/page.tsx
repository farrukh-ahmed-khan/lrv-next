
"use client"
import React, { useEffect, useState } from "react";
import reg from "../../assets/images/reg-left.png";


import { toast } from "react-hot-toast";
import InnerBanner from "@/components/ui/InnerBanner";
import Header from "@/components/layout/Navbar";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import { registerUser } from "@/lib/UsersApi/api";
import { useRouter } from 'next/navigation';

const Signup = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [activeTab, setActiveTab] = useState("Admin");
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        streetAddress: "",
        phoneNumber: "",
        confirmPassword: "",
        role: "",
    });
    const [loading, setLoading] = useState(false);


    const router = useRouter();


    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        formData.role = "home owner"

        try {
            setLoading(true)
            const data = await registerUser(formData);
            toast.success(data.message);
            router.push("/login");
        } catch (error: any) {
            toast.error(error.message);
        }
        finally {
            setLoading(false);
        }
    };

    const handleSubmit2 = async (e: any) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }
        formData.role = "home member"

        try {
            setLoading(true)
            const data = await registerUser(formData);
            toast.success(data.message);
            router.push("/login");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }

    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');

        if (token && user?.role) {
            switch (user.role) {
                case 'admin':
                    router.push('/admin/dashboard');
                    break;
                case 'home owner':
                    router.push('/dashboard/homeowner');
                    break;
                case 'home member':
                    router.push('/dashboard/homemember');
                    break;
                case 'board member':
                    router.push('/dashboard/boardmember/users');
                    break;
                default:
                    router.push('/');
            }
        } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, []);

    const streetOptions = ["123 Main St", "456 Oak Ave", "789 Pine Blvd", "1010 Maple Dr", "2020 Elm St"];


    return (
        <>
            <Header />
            <InnerBanner title="Sign Up" />
            <section className="signup-wrapper">
                <div className="container">
                    <div className="row d-flex align-items-center">
                        <div className="col-lg-7">
                            <div className="img-wrap">
                                <Image src={reg} alt="" />
                            </div>
                        </div>
                        <div className="col-lg-5">
                            <div className="create-acc-wrap">
                                <div className="head">
                                    <h2>Create your account</h2>
                                </div>
                                <div className="tabs-wrapper mb-3">
                                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                                        <li className="" role="presentation">
                                            <button
                                                className={`${activeTab === "Admin" ? "active" : ""
                                                    }`}
                                                onClick={() => handleTabClick("Admin")}
                                                role="tab"
                                                aria-selected={activeTab === "Admin"}
                                            >
                                                Owner
                                            </button>
                                        </li>
                                        {/* <li className="nav-item" role="presentation">
                                            <button
                                                className={`${activeTab === "Member" ? "active" : ""
                                                    }`}
                                                onClick={() => handleTabClick("Member")}
                                                role="tab"
                                                aria-selected={activeTab === "Member"}
                                            >
                                                Member
                                            </button>
                                        </li> */}
                                    </ul>
                                </div>
                                <div className="tab-content">
                                    {activeTab === "Admin" && (
                                        <div className="tab-pane active" role="tabpanel">
                                            <form onSubmit={handleSubmit}>
                                                <div className="form-group row">
                                                    <label
                                                        htmlFor="First Name"
                                                        className="col-sm-12 col-form-label"
                                                    >
                                                        First Name
                                                    </label>
                                                    <div className="col-sm-12">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="firstname"
                                                            name="firstname"
                                                            required
                                                            value={formData.firstname}
                                                            onChange={handleChange}
                                                            placeholder="First Name"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="form-group row">
                                                    <label
                                                        htmlFor="Last Name"
                                                        className="col-sm-12 col-form-label"
                                                    >
                                                        Last Name
                                                    </label>
                                                    <div className="col-sm-12">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="lastname"
                                                            name="lastname"
                                                            required
                                                            value={formData.lastname}
                                                            onChange={handleChange}
                                                            placeholder="Last Name"
                                                        />
                                                    </div>
                                                </div>

                                                {/* <div className="form-group row">
                                                    <label
                                                        htmlFor="streetAddress"
                                                        className="col-sm-12 col-form-label"
                                                    >
                                                        Street Address
                                                    </label>
                                                    <div className="col-sm-12">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="streetAddress"
                                                            name="streetAddress"
                                                            required
                                                            value={formData.streetAddress}
                                                            onChange={handleChange}
                                                            placeholder="streetAddress"
                                                        />
                                                    </div>
                                                </div> */}

                                                <div className="form-group row">
                                                    <div className="col-lg-12">
                                                        <label
                                                            htmlFor="streetAddress"
                                                            className="col-sm-12 col-form-label"
                                                        >
                                                            Street Address
                                                        </label>
                                                        <select
                                                            className="form-control"
                                                            id="streetAddress"
                                                            name="streetAddress"
                                                            required
                                                            value={formData.streetAddress}
                                                            onChange={handleChange}
                                                        >
                                                            <option value="">Select Street Address</option>
                                                            {streetOptions.map((address, index) => (
                                                                <option key={index} value={address}>
                                                                    {address}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="form-group row">
                                                    <label
                                                        htmlFor="phoneNumber"
                                                        className="col-sm-12 col-form-label"
                                                    >
                                                        Phone Number
                                                    </label>
                                                    <div className="col-sm-12">
                                                        <input
                                                            type="tel"
                                                            className="form-control"
                                                            id="phoneNumber"
                                                            name="phoneNumber"
                                                            required
                                                            value={formData.phoneNumber}
                                                            onChange={handleChange}
                                                            placeholder="phoneNumber"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="form-group row">
                                                    <label
                                                        htmlFor="email"
                                                        className="col-sm-12 col-form-label"
                                                    >
                                                        Email
                                                    </label>
                                                    <div className="col-sm-12">
                                                        <input
                                                            type="email"
                                                            className="form-control"
                                                            id="email"
                                                            name="email"
                                                            required
                                                            value={formData.email}
                                                            onChange={handleChange}
                                                            placeholder="Email"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="form-group row">
                                                    <label
                                                        htmlFor="password"
                                                        className="col-sm-12 col-form-label"
                                                    >
                                                        Password
                                                    </label>
                                                    <div className="col-sm-12 position-relative">
                                                        <input
                                                            type={passwordVisible ? "text" : "password"}
                                                            className="form-control"
                                                            id="password"
                                                            name="password"
                                                            required
                                                            value={formData.password}
                                                            onChange={handleChange}
                                                            placeholder="Password"
                                                        />
                                                        <i
                                                            className={`fa ${passwordVisible ? "fa-eye-slash" : "fa-eye"
                                                                } password-toggle-icon`}
                                                            onClick={togglePasswordVisibility}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label
                                                        htmlFor="password_confirmation"
                                                        className="col-sm-12 col-form-label"
                                                    >
                                                        Confirm Password
                                                    </label>
                                                    <div className="col-sm-12 position-relative">
                                                        <input
                                                            type={confirmPasswordVisible ? "text" : "password"}
                                                            className="form-control"
                                                            id="password_confirmation"
                                                            name="confirmPassword"
                                                            required
                                                            value={formData.confirmPassword}
                                                            onChange={handleChange}
                                                            placeholder="Confirm Password"
                                                        />
                                                        <i
                                                            className={`fa ${confirmPasswordVisible ? "fa-eye-slash" : "fa-eye"
                                                                } password-toggle-icon`}
                                                            onClick={toggleConfirmPasswordVisibility}
                                                        />
                                                    </div>
                                                </div>
                                                <button
                                                    type="submit"
                                                    className="signup-btn"
                                                    disabled={loading}
                                                >
                                                    {loading ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                            Signing Up...
                                                        </>
                                                    ) : (
                                                        'Sign Up'
                                                    )}
                                                </button>
                                            </form>
                                            <div className="sign-in-wrap">
                                                <Link href="/login">Sign in now</Link>
                                            </div>
                                        </div>
                                    )}
                                    {/* {activeTab === "Member" && (
                                        <div className="tab-pane active" role="tabpanel">
                                            <form onSubmit={handleSubmit2}>
                                                <div className="form-group row">
                                                    <label
                                                        htmlFor="First Name"
                                                        className="col-sm-12 col-form-label"
                                                    >
                                                        First Name
                                                    </label>
                                                    <div className="col-sm-12">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="firstname"
                                                            name="firstname"
                                                            required
                                                            value={formData.firstname}
                                                            onChange={handleChange}
                                                            placeholder="First Name"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="form-group row">
                                                    <label
                                                        htmlFor="Last Name"
                                                        className="col-sm-12 col-form-label"
                                                    >
                                                        Last Name
                                                    </label>
                                                    <div className="col-sm-12">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="lastname"
                                                            name="lastname"
                                                            required
                                                            value={formData.lastname}
                                                            onChange={handleChange}
                                                            placeholder="Last Name"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="form-group row">
                                                    <div className="col-lg-12">
                                                        <label
                                                            htmlFor="streetAddress"
                                                            className="col-sm-12 col-form-label"
                                                        >
                                                            Street Address
                                                        </label>
                                                        <select
                                                            className="form-control"
                                                            id="streetAddress"
                                                            name="streetAddress"
                                                            required
                                                            value={formData.streetAddress}
                                                            onChange={handleChange}
                                                        >
                                                            <option value="">Select Street Address</option>
                                                            {streetOptions.map((address, index) => (
                                                                <option key={index} value={address}>
                                                                    {address}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="form-group row">
                                                    <label
                                                        htmlFor="phoneNumber"
                                                        className="col-sm-12 col-form-label"
                                                    >
                                                        Phone Number
                                                    </label>
                                                    <div className="col-sm-12">
                                                        <input
                                                            type="tel"
                                                            className="form-control"
                                                            id="phoneNumber"
                                                            name="phoneNumber"
                                                            required
                                                            value={formData.phoneNumber}
                                                            onChange={handleChange}
                                                            placeholder="phoneNumber"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="form-group row">
                                                    <label
                                                        htmlFor="email"
                                                        className="col-sm-12 col-form-label"
                                                    >
                                                        Email
                                                    </label>
                                                    <div className="col-sm-12">
                                                        <input
                                                            type="email"
                                                            className="form-control"
                                                            id="email"
                                                            name="email"
                                                            required
                                                            value={formData.email}
                                                            onChange={handleChange}
                                                            placeholder="Email"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="form-group row">
                                                    <label
                                                        htmlFor="password"
                                                        className="col-sm-12 col-form-label"
                                                    >
                                                        Password
                                                    </label>
                                                    <div className="col-sm-12 position-relative">
                                                        <input
                                                            type={passwordVisible ? "text" : "password"}
                                                            className="form-control"
                                                            id="password"
                                                            name="password"
                                                            required
                                                            value={formData.password}
                                                            onChange={handleChange}
                                                            placeholder="Password"
                                                        />
                                                        <i
                                                            className={`fa ${passwordVisible ? "fa-eye-slash" : "fa-eye"
                                                                } password-toggle-icon`}
                                                            onClick={togglePasswordVisibility}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label
                                                        htmlFor="password_confirmation"
                                                        className="col-sm-12 col-form-label"
                                                    >
                                                        Confirm Password
                                                    </label>
                                                    <div className="col-sm-12 position-relative">
                                                        <input
                                                            type={confirmPasswordVisible ? "text" : "password"}
                                                            className="form-control"
                                                            id="password_confirmation"
                                                            name="confirmPassword"
                                                            required
                                                            value={formData.confirmPassword}
                                                            onChange={handleChange}
                                                            placeholder="Confirm Password"
                                                        />
                                                        <i
                                                            className={`fa ${confirmPasswordVisible ? "fa-eye-slash" : "fa-eye"
                                                                } password-toggle-icon`}
                                                            onClick={toggleConfirmPasswordVisibility}
                                                        />
                                                    </div>
                                                </div>
                                                <button
                                                    type="submit"
                                                    className="signup-btn"
                                                    disabled={loading}
                                                >
                                                    {loading ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                            Signing Up...
                                                        </>
                                                    ) : (
                                                        'Sign Up'
                                                    )}
                                                </button>
                                            </form>
                                            <div className="sign-in-wrap">
                                                <Link href="/login">Sign in now</Link>
                                            </div>
                                        </div>
                                    )} */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
};

export default Signup;
