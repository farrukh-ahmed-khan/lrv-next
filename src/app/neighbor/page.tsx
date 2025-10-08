"use client"
import Header from "@/components/layout/Navbar";
import InnerBanner from "@/components/ui/InnerBanner";
import Footer from "@/components/layout/Footer";
import ProtectedPage from "@/components/ProtectedPage";
import topimg from "@/assets/images/neighbor-top.jpg"
import Image from "next/image";


const Securiy = () => {
    return (
        <ProtectedPage allowedRoles={["home owner", "home member", "board member", "admin"]}>
            <div className="Dues-wrapper">
                <Header />
                <>
                    <InnerBanner title="New Neighbors!" />
                </>
                <section className="dues-content">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="heading text-center">
                                    <h4>
                                        Welcome New Neighbors!
                                    </h4>
                                </div>
                            </div>
                            <div className="col-lg-12">
                                <div className="content">
                                    <p className="text-center">
                                        We're delighted you are here in Los Ranchos Verdes! Click the link or “Hi there!” image below for a special Welcome-To-LRV message!
                                    </p>

                                    {/* <div className="pay-btn-wrap mb-3 text-center">
                                        <button className="pay-now-btn">LRV WELCOME FLYER</button>
                                    </div> */}
                                </div>
                            </div>
                            <div className="col-lg-12">
                                <div className="bottom-img-wrap">
                                    <Image src={topimg} alt="" style={{ width: "100%" }} />
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
