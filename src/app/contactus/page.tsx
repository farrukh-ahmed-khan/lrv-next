"use client";
import { useState } from 'react';

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Navbar";
import ProtectedPage from "@/components/ProtectedPage";
import InnerBanner from "@/components/ui/InnerBanner";
import topImage from "@/assets/images/carshow/carshow-top.png";

import Image from "next/image";
import Link from 'next/link';


const CarShow = () => {

    return (
        <ProtectedPage allowedRoles={["home owner", "home member", "board member", "admin"]}>
            <div className="contactus-wrapper">
                <Header />
                <InnerBanner title="Contact us" />
                <div className="container my-5">

                    <div className="row ">
                        <div className="col-lg-6">
                            <div className="content">
                                <h4>
                                    CONTACT LRV
                                </h4>
                                <p>
                                    LRV is greatly interested in and appreciates your:
                                </p>
                                <ul>
                                    <li>Questions</li>
                                    <li>Comments</li>
                                    <li>Suggestions</li>
                                    <li>
                                        Service Provider Recommendations
                                        (we’ll post your favorites on a separate future page,
                                        “LRV Marketplace”…stay tuned for that upcoming feature!)
                                    </li>
                                </ul>
                                <h4>
                                    E-mail the webmaster at:
                                </h4>
                                <p>
                                    <Link href="mailto:LRVHomeowners@gmail.com">
                                        <i className="fa fa-envelope" aria-hidden="true"></i>
                                        LRVHomeowners@gmail.com
                                    </Link>
                                </p>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="form-wrapper">
                                <form action="">
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <input type="text" placeholder='Name' name="Name" id="Name" />
                                        </div>
                                        <div className="col-lg-12">

                                            <input type="text" placeholder='Email' name="Email" id="Email" />
                                        </div>
                                        <div className="col-lg-12">

                                            <input type="text" placeholder='Subject' name="Subject" id="Subject" />
                                        </div>
                                        <div className="col-lg-12">

                                            <textarea name="Message" id="Message" placeholder='Message'></textarea>
                                        </div>
                                        <div className="col-lg-12">
                                            <div className="btn-wrap">
                                                <button>Send</button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-12">
                            <div className="map-wrapper">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d317896.2199826681!2d-0.119484!3d51.502864!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487604b900d26973%3A0x4291f3172409ea92!2slastminute.com%20London%20Eye!5e0!3m2!1sen!2sus!4v1745510009863!5m2!1sen!2sus"
                                    width="100%" height="450" loading="lazy">
                                </iframe>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </ProtectedPage>
    );
};

export default CarShow;
