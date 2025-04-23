"use client";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Navbar";
import ProtectedPage from "@/components/ProtectedPage";
import InnerBanner from "@/components/ui/InnerBanner";
import bottomImage from "@/assets/images/city-bottom.jpg"
import Image from "next/image";

const NeighborhoodWatch = () => {

    return (
        <ProtectedPage allowedRoles={["home owner", "home member", "board member", "admin"]}>
            <div className="neigh-wrapper">
                <Header />
                <InnerBanner title="City of Rolling Hills Estates" />
                <div className="container mb-5">

                    <div className="row">
                        <div className="col-lg-12">
                            <div className="neigh-content">
                                <div className="content">
                                    <p>
                                        Today there are 30 neighborhood areas within Rolling Hills Estates,
                                        each with its own special character, architectural style, and Homeowners’ Association.
                                        These Associations, like the LRV HOA, often represent citizens directly
                                        before the City Council and serve as neighborhood social organizations as well.
                                    </p>
                                    <p>
                                        The City of Rolling Hills Estates website is “live” and directly connected here:
                                    </p>
                                    <p>
                                        <a href="mailto:https://www.rollinghillsestates.gov/">

                                            <span>City of Rolling Hills Estates</span>
                                        </a>
                                    </p>
                                </div>

                            </div>

                        </div>
                    </div>
                    <div className="row">
                        <div className="bottom-img-wrap">
                            <Image src={bottomImage} alt="bottomImage" />
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </ProtectedPage>
    );
};

export default NeighborhoodWatch;
