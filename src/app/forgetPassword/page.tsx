"use client"
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Navbar';
import InnerBanner from '@/components/ui/InnerBanner';
import { forgetPassword } from '@/lib/UsersApi/api';
import Link from 'next/link';
import React, { useState } from 'react'
import toast from 'react-hot-toast';


const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true)
        try {
            const data = await forgetPassword({ email });
            toast.success(data.message);
        } catch (error: any) {
            toast.error(error.message);
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <>
            <section className="forget-pass-wrapper">
                <div className="signup-wrapper">
                    <Header />
                    <>
                        <InnerBanner
                            title="Forgot Password"
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
                                                <form onSubmit={handleSubmit}>


                                                    <div className="form-group row">
                                                        <label
                                                            htmlFor="email"
                                                            className="col-sm-12 col-form-label"
                                                        >
                                                            Email
                                                        </label>
                                                        <div className="col-sm-12">
                                                            <input type="email" placeholder='Enter Your Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
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
                                    {/* <form onSubmit={handleSubmit}>
                        <input type="email" placeholder='Enter Your Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <button type="submit">Send Reset Link</button>
                    </form> */}
                                </>
                            </div>
                        </div>
                        <div className="col-lg-4"></div>
                    </div>

                    <Footer />
                </div>
            </section>
        </>

    );
};



export default ForgotPassword
