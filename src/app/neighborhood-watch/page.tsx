"use client";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Navbar";
import ProtectedPage from "@/components/ProtectedPage";
import InnerBanner from "@/components/ui/InnerBanner";
import TopImage from "@/assets/images/ne-top-image.jpg"
import Image from "next/image";

const NeighborhoodWatch = () => {





    return (
        <ProtectedPage allowedRoles={["home owner", "home member", "board member", "admin"]}>
            <div className="neigh-wrapper">
                <Header />
                <InnerBanner title="LRVHOA By-Laws" />
                <div className="container mb-5">
                    <div className="row">
                        <div className="top-img-wrap">
                            <Image src={TopImage} alt="TopImage" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="neigh-content">
                                <div className="content">
                                    <p>
                                        Our neighborhood is a safe place to live thanks to our vigilant and caring neighbors who actively look out for each other.
                                        By working together, we have created a strong sense of community and security. We believe that it’s important to continue
                                        this tradition of looking out for one another and encourage everyone to stay alert and report any suspicious activity
                                        to our Neighborhood Watch Captain. Together, we can ensure that our neighborhood remains a safe and welcoming place for everyone.
                                    </p>
                                </div>
                                <div className="heading">
                                    <h4>
                                        LRV Neighborhood Watch Captain
                                    </h4>

                                </div>
                                <div className="content">
                                    <p>
                                        Jeff Romanelli
                                    </p>
                                    <p>
                                        310 375-9093 Res

                                    </p>
                                    <p>
                                        424 327-7252 Cell

                                    </p>
                                    <p>
                                        <a href="mailto:jeff.romanelli@cox.net">

                                            <span>jeff.romanelli@cox.net</span>
                                        </a>
                                    </p>
                                    <div className="bottom-anchor">
                                        <a href="https://myemail-api.constantcontact.com/Virtual-Neighborhood-Watch-Meeting-Re-cap-April-2-Meeting.html?soid=1130019834312&aid=EutSvaq1uDQ">
                                            Neighborhood Watch Update - April 2024
                                        </a>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
                <Footer />
            </div>
        </ProtectedPage>
    );
};

export default NeighborhoodWatch;
