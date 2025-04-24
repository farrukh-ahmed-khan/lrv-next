"use client"
import Header from "@/components/layout/Navbar";
import InnerBanner from "@/components/ui/InnerBanner";
import Footer from "@/components/layout/Footer";
import ProtectedPage from "@/components/ProtectedPage";
import btnImg from "@/assets/images/btn_subscribe.gif"
import bottomimg from "@/assets/images/bottom-dues.jpg"
import Image from "next/image";


const Securiy = () => {
    return (
        <ProtectedPage allowedRoles={["home owner", "home member", "board member", "admin"]}>
            <div className="Dues-wrapper">
                <Header />
                <>
                    <InnerBanner title="LRVHOA.NET SECURITY" />
                </>
                <section className="dues-content">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="heading">
                                    <h4>
                                        A Word About Our LRVHOA.NET Website Security

                                    </h4>
                                </div>
                            </div>
                            <div className="col-lg-12">
                                <div className="content">
                                    <p>
                                        Here’s a few things you should know about LRVHOA.net
                                    </p>
                                    <ul>
                                        <li>
                                            It’s safe—and private—here. We have made this entire site secure and password protected, including each individual page.
                                        </li>
                                        <li>
                                            Our website also sports an SSL (Secure Socket Layer) certificate, also known as “HTTPS”, which is visible whenever you
                                            login in the upper left corner and indicated by a padlock image, depending on your browser.
                                        </li>
                                        <li>
                                            The entire website is hidden from Google searches.
                                        </li>
                                        <li>
                                            Only known, current LRV homeowners are granted access to our website.
                                        </li>
                                        <li>
                                            LRVHOA.net is tested, verified, and certified to be secure by the world’s largest dedicated security
                                            company, McAfee. There’s no phishing, malware, or malicious links.Check for the
                                            “McAfee Secure” badge in the lower -right corner of your screen.
                                        </li>
                                    </ul>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                <Footer />
            </div>
        </ProtectedPage>
    );
};

export default Securiy;
