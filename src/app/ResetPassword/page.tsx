"use client"
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Navbar";
import InnerBanner from "@/components/ui/InnerBanner";
import { resetPassword } from "@/lib/UsersApi/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const ResetPassword = () => {
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState("");
    const token = new URLSearchParams(window.location.search).get("token");
    const router = useRouter();

    const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true)
        if (!token) {
            toast.error("Invalid or missing token.");
            return;
        }
        try {
            const data = await resetPassword({ token, password });
            toast.success(data.message);
        } catch (error: unknown) { 
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("An unknown error occurred.");
            }
        }
        finally {
            setLoading(false);
            router.push("/login")
        }
    };

    return (
        <>
            <section className="forget-pass-wrapper">
                <div className="signup-wrapper">
                    <Header />
                    <>
                        <InnerBanner
                            title="Reset Password"
                        />
                    </>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-4">

                            </div>
                            <div className="col-lg-4">
                                <>
                                    <div className="create-acc-wrap">
                                        <div className="tab-content">
                                            <div className="tab-pane active" role="tabpanel">
                                                <form onSubmit={handleReset}>


                                                    <div className="form-group row">
                                                        <label
                                                            htmlFor="password"
                                                            className="col-sm-12 col-form-label"
                                                        >
                                                            Password
                                                        </label>
                                                        <div className="col-sm-12">
                                                            <input type="password" placeholder="password" value={password}
                                                                onChange={(e) => setPassword(e.target.value)}
                                                                required />
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
                                                                Loading...
                                                            </>
                                                        ) : (
                                                            'Submit'
                                                        )}
                                                    </button>
                                                </form>
                                                <div className="sign-in-wrap">
                                                    <Link href="/register">Sign up now</Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </>
                            </div>
                        </div>
                        <div className="col-lg-4"></div>
                    </div>
                    {/* <form onSubmit={handleReset}>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <button type="submit">Reset Password</button>
                    </form> */}

                    <Footer />
                </div>
            </section>
        </>

    );
};

export default ResetPassword