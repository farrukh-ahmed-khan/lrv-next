"use client";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Navbar";
import ProtectedPage from "@/components/ProtectedPage";
import InnerBanner from "@/components/ui/InnerBanner";
import bottomImage from "@/assets/images/nextdoor-bottom.jpg"
import TopImage from "@/assets/images/nextdoor-top.jpg"
import Image from "next/image";

const NeighborhoodWatch = () => {
    return (
        <ProtectedPage allowedRoles={["home owner", "home member", "board member", "admin"]}>
            <div className="nextdoor-wrapper">
                <Header />
                <InnerBanner title="Nextdoor LRV Group" />
                <div className="container mb-5">

                    <div className="row">
                        <div className="col-lg-12">
                            <div className="nextdoor-content">
                                <div className="content">
                                    <div className="btn-wrap" style={{ textAlign: "center" }}>
                                        <button>Go to nextdoor Rolling Hills Estates</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="top-img-wrap">
                            <Image src={TopImage} alt="TopImage" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="nextdoor-content">
                                <div className="content">
                                    <h5>
                                        First, a few words about Nextdoor Rolling Hills Estates:
                                    </h5>
                                    <p>
                                        Beginning in 2013, a number of Rolling Hills Estates residents
                                        began to join the website “Nextdoor”. Nextdoor is the private
                                        social network for you, your neighbors and your community. It’s
                                        the easiest way for you and your neighbors to talk online and
                                        make all of your lives better in the real world. And it’s free.
                                        Further, your LRV HOA recommends that you join Nextdoor Rolling
                                        Hills Estates.
                                    </p>
                                    <p>
                                        Thousands of neighborhoods are already
                                        using Nextdoor to build happier, safer places to call home.
                                    </p>
                                    <p>
                                        People are using Nextdoor to:
                                    </p>
                                    <ul>
                                        <li>
                                            Quickly get the word out about a break-in
                                        </li>
                                        <li>
                                            Organize a Neighborhood Watch Group
                                        </li>
                                        <li>
                                            Track down a trustworthy babysitter
                                        </li>
                                        <li>
                                            Find out who does the best paint job in town
                                        </li>
                                        <li>
                                            Ask for help keeping an eye out for a lost dog
                                        </li>
                                        <li>
                                            Find a new home for an outgrown bike
                                        </li>
                                        <li>
                                            Finally call that nice man down the street by his first name
                                        </li>
                                    </ul>
                                    <p>
                                        Nextdoor’s mission is to use the power of technology to build stronger and safer neighborhoods.
                                    </p>
                                    <div className="btn-wrap">
                                        <button>Go to nextdoor Rolling Hills Estates</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row btm-row">
                        <div className="col-lg-12">
                            <div className="nextdoor-content">
                                <div className="content">
                                    <h5>
                                        Secondly, a few words about the LRV HOA Group in Nextdoor:
                                    </h5>
                                    <p>
                                        Starting in 2014, several LRV homeowners began to also join an exclusive and private “group” that was established inside of Nextdoor Rolling Hills Estates. This unique-to-LRV group, enables LRV homeowners to enjoy a ‘place’ on the Internet in which to exchange information and communicate privately among only other LRV homeowners.
                                    </p>
                                    <p>
                                        This Los Ranchos Verdes Homeowners Association group was established for all homeowners in the Los Ranchos Verdes development. You’ll find information about LRV, news, and current happenings in our community. And, just like Nextdoor Rolling Hills Estates, your LRV HOA also highly recommends that you become a member of the LRV HOA group.
                                    </p>
                                    <div className="btm-img-wrap">
                                        <Image src={bottomImage} alt="" />
                                    </div>
                                    <div className="btn-wrap">
                                        <button>Go to nextdoor Rolling Hills Estates</button>
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
