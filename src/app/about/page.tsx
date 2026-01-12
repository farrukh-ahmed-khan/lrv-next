"use client"
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";

import gallery1 from "@/assets/images/home/gallery1.png";
import gallery2 from "@/assets/images/home/gallery2.png";
import gallery3 from "@/assets/images/home/gallery3.png";
import gallery4 from "@/assets/images/home/gallery4.png";
import gallery5 from "@/assets/images/home/gallery5.png";
import gallery6 from "@/assets/images/home/gallery6.png";
import gallery7 from "@/assets/images/home/gallery7.png";
import gallery8 from "@/assets/images/home/gallery8.png";
import aboutUsImg from "@/assets/images/aboutImg.png";
import mapImg from "@/assets/images/map-pic.jpg";
import { FaArrowLeft, FaArrowRight, FaTimes } from "react-icons/fa";
import Image, { StaticImageData } from "next/image";
import Header from "@/components/layout/Navbar";
import HomeBanner from "@/components/ui/HomeBanner";
import AboutUs from "@/components/ui/AboutUs";
import Footer from "@/components/layout/Footer";

const images = [
    gallery1,
    gallery2,
    gallery3,
    gallery4,
    gallery5,
    gallery6,
    gallery7,
    gallery8,
];
const AboutLrv: React.FC = () => {
    const [selectedImage, setSelectedImage] = useState<StaticImageData | null>(null);
    const [currentIndex, setCurrentIndex] = useState<number | null>(null);

    const openImage = (index: number) => {
        setSelectedImage(images[index]);
        setCurrentIndex(index);
    };

    const closeImage = () => {
        setSelectedImage(null);
        setCurrentIndex(null);
    };

    const prevImage = () => {
        if (currentIndex !== null && currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setSelectedImage(images[currentIndex - 1]);
        }
    };

    const nextImage = () => {
        if (currentIndex !== null && currentIndex < images.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setSelectedImage(images[currentIndex + 1]);
        }
    };

    return (
        <>
            <div className="home-wrapper">
                <Header />
                <section className="homeBanner-wrapper">
                    <HomeBanner title="About Us" />
                </section>
                <>
                    <AboutUs
                        // title="About Us"
                        paragraphs={[
                            "Los Ranchos Verdes is a small community in Rolling Hills Estates, California. Los Ranchos Verdes is Spanish, meaning “The Green Ranches”",
                            "Los Ranchos Verdes is located very close to the intersection of Hawthorne Boulevard and Palos Verdes Drive North. We are also ‘just-down-road’ from Rolling Hills Estates City Hall, located at the NW corner of Palos Verdes Drive North and Crenshaw Boulevard.",
                            "Our small, beautiful, country-like community consists of 151 households. We have an active Homeowners Association, a Board of Directors, and an effective Neighborhood Watch Program.",
                            "We are very close to public transportation, including one stop within our LRV boundary and one stop at Hawthorne Boulevard and Palos Verdes Drive North.",
                        ]}
                        // button={{ label: "Read More", link: "#" }}
                        image={aboutUsImg}
                    />
                </>
                <section className="lrvstreet">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="heading-wrap">
                                    <h4>LRV STREETS</h4>
                                    <p>
                                       LRV HOA serves homeowners on the following streets.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="row d-flex justify-content-center align-items-center">
                            <div className="col-lg-6">
                                <ul className="list-style-wrap first-list">
                                    <li>
                                        <span>
                                            <svg
                                                aria-hidden="true"
                                                className="e-font-icon-svg e-fas-circle"
                                                viewBox="0 0 512 512"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z"></path>
                                            </svg>
                                        </span>
                                        <span>Silver Saddle Lane</span>
                                    </li>
                                    <li>
                                        <span>
                                            <svg
                                                aria-hidden="true"
                                                className="e-font-icon-svg e-fas-circle"
                                                viewBox="0 0 512 512"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z"></path>
                                            </svg>
                                        </span>
                                        <span>Palos Verdes Lane</span>
                                    </li>
                                    <li>
                                        <span>
                                            <svg
                                                aria-hidden="true"
                                                className="e-font-icon-svg e-fas-circle"
                                                viewBox="0 0 512 512"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z"></path>
                                            </svg>
                                        </span>
                                        <span>Shady Vista Road</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="col-lg-6">
                                <ul className="list-style-wrap">
                                    {/* <li>
                                        <span>
                                            <svg
                                                aria-hidden="true"
                                                className="e-font-icon-svg e-fas-circle"
                                                viewBox="0 0 512 512"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z"></path>
                                            </svg>
                                        </span>
                                        <span>Golden Spar Place</span>
                                    </li> */}
                                    <li>
                                        <span>
                                            <svg
                                                aria-hidden="true"
                                                className="e-font-icon-svg e-fas-circle"
                                                viewBox="0 0 512 512"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z"></path>
                                            </svg>
                                        </span>
                                        <span>Santa Bella Road</span>
                                    </li>
                                    <li>
                                        <span>
                                            <svg
                                                aria-hidden="true"
                                                className="e-font-icon-svg e-fas-circle"
                                                viewBox="0 0 512 512"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z"></path>
                                            </svg>
                                        </span>
                                        <span>Seahurst Road</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="row">
                            <div className="about-gallery">
                                <Swiper
                                    slidesPerView={3}
                                    spaceBetween={10}
                                    loop={true}
                                    grabCursor={true}
                                    autoplay={{
                                        delay: 1,
                                        disableOnInteraction: false,
                                    }}
                                    breakpoints={{
                                        640: {
                                            slidesPerView: 1,
                                            spaceBetween: 10,
                                        },
                                        768: {
                                            slidesPerView: 1,
                                            spaceBetween: 10,
                                        },
                                        1024: {
                                            slidesPerView: 3,
                                            spaceBetween: 10,
                                        },
                                    }}
                                    freeMode={true}
                                    speed={3000}
                                    modules={[Autoplay]}
                                    // pagination={{
                                    //   clickable: true,
                                    // }}
                                    // modules={[Pagination]}
                                    className="mySwiper"
                                >
                                    {images.map((img, index) => (
                                        <>
                                            <SwiperSlide key={index}>
                                                <Image
                                                    key={index}
                                                    src={img}
                                                    alt={`Gallery ${index}`}
                                                    onClick={() => openImage(index)}
                                                />
                                            </SwiperSlide>
                                        </>
                                    ))}
                                </Swiper>
                            </div>
                            {selectedImage && (
                                <div className="lightbox">
                                    <span className="close-btn" onClick={closeImage}>
                                        <FaTimes />
                                    </span>
                                    <Image
                                        src={selectedImage}
                                        alt="Large Preview"
                                        className="lightbox-image"
                                    />
                                    <button
                                        className="prev-btn"
                                        onClick={prevImage}
                                        disabled={currentIndex === 0}
                                    >
                                        <FaArrowLeft />
                                    </button>
                                    <button
                                        className="next-btn"
                                        onClick={nextImage}
                                        disabled={currentIndex === images.length - 1}
                                    >
                                        <FaArrowRight />
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="row">
                            <div className="col-lg-4">
                                <div className="lrvstreet-det">
                                    <h4>SCHOOLS</h4>
                                    <p>
                                        We are very close to several of the finest schools in the
                                        nation:
                                    </p>
                                    <p>Palos Verdes Peninsula High School</p>
                                    <p>Rancho Vista Elementary School</p>
                                    <p>Rolling Hills Country Day School</p>
                                    <p>Dapplegray Elementary School</p>
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="lrvstreet-det">
                                    <h4>MARKETS</h4>
                                    <p>
                                        There are three convenient supermarkets about a mile away:
                                    </p>
                                    <p>Ralph's</p>
                                    <p>Pavillion's</p>
                                    <p>Bristol Farms</p>
                                    <p>And several pharmacies:</p>
                                    <p>CVS</p>
                                    <p>Rite-Aid</p>
                                    <p>Walgreen's</p>
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="lrvstreet-det">
                                    <h4>SHOPPING</h4>
                                    <p>Shopping Centers are also close by:</p>
                                    <p>Del Amo Mall</p>
                                    <p>Peninsula Center Rolling Hills Plaza</p>
                                    <p>Promenade on the Peninsula</p>
                                    <p>Country Hills Shopping Center</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="lrv-model-map">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="heading-wrap">
                                    <h4>LRV BORDER MAP</h4>
                                    <p>Click on the border map below to expand the image</p>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-2"></div>
                            <div className="col-lg-8">
                                <div className="map-wrap">
                                    <Image src={mapImg} alt="" />
                                </div>
                            </div>
                            <div className="col-lg-2"></div>
                        </div>
                    </div>
                </section>

                <Footer />
            </div>
        </>
    );
};

export default AboutLrv;
