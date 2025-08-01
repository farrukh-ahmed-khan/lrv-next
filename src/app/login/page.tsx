
"use client"
import React, { useEffect, useState } from "react";
import reg from "../../assets/images/reg-left.png";




import { toast } from "react-hot-toast";
import InnerBanner from "@/components/ui/InnerBanner";
import Header from "@/components/layout/Navbar";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import { loginUser } from "@/lib/UsersApi/api";
import { useRouter } from 'next/navigation';

const Login = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);


    const router = useRouter();
    //   const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true)
        try {
            const data = await loginUser(formData);
            toast.success(data.message);


            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("token", (data.token));
            window.location.reload()

            if (data.user.role === "admin") {
                router.push("/admin/dashboard")
            } else if (data.user.role === "home owner") {
                router.push("/")
            } else if (data.user.role === "home member") {
                router.push("/")
            } else if (data.user.role === "board member") {
                router.push("/dashboard/boardmember/")
            } else {
                router.push('/');
            }
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
                    router.push("/")
                    break;
                case 'home member':
                    router.push('/');
                    break;
                case 'board member':
                    router.push('/dashboard/boardmember/');
                    break;
                default:
                    router.push('/');
            }
        } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, []);


    return (
        <>
            <Header />
            <InnerBanner title="Login" />
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
                                <div className="tabs-wrapper"></div>
                                <div className="tab-content">
                                    <div className="tab-pane active" role="tabpanel">
                                        <form onSubmit={handleSubmit}>
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

                                            <button
                                                type="submit"
                                                className="signup-btn"
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                        Signing In...
                                                    </>
                                                ) : (
                                                    'Sign In'
                                                )}
                                            </button>
                                        </form>
                                        <div className="sign-in-wrap">
                                            <Link href="/register">Sign up now</Link>
                                            <Link href="/forgetPassword">Forget Password</Link>
                                        </div>
                                    </div>
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

export default Login;
