"use client";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Navbar";
import ProtectedPage from "@/components/ProtectedPage";
import InnerBanner from "@/components/ui/InnerBanner";
import firstImg from "@/assets/images/christmas/1.jpg"
import secImg from "@/assets/images/christmas/2.jpg"
import Image, { StaticImageData } from "next/image";
import gallery1 from "@/assets/images/home/gallery1.png";
import gallery2 from "@/assets/images/home/gallery2.png";
import gallery3 from "@/assets/images/home/gallery3.png";
import gallery4 from "@/assets/images/home/gallery4.png";
import gallery5 from "@/assets/images/home/gallery5.png";
import gallery6 from "@/assets/images/home/gallery6.png";
import gallery7 from "@/assets/images/home/gallery7.png";
import gallery8 from "@/assets/images/home/gallery8.png";

import { useState } from "react";
import { FaArrowLeft, FaArrowRight, FaTimes } from "react-icons/fa";
import Link from "next/link";
const images: StaticImageData[] = [
    gallery1,
    gallery2,
    gallery3,
    gallery4,
    gallery5,
    gallery6,
    gallery7,
    gallery8,
    gallery5,
];

const StreetPortfoliio = () => {


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
        <ProtectedPage allowedRoles={["home owner", "home member", "board member", "admin"]}>
            <div className="street-wrapper">
                <Header />
                <InnerBanner title="LRV STREETS PORTFOLIO" />

                <section className="gallery-sec" style={{ margin: "30px 0" }}>
                    <div className="gallery">
                        <div className="gallery-grid">
                            <div className="container">

                                <div className="row" >
                                    {images.map((img, index) => (
                                        <div className="col-lg-4" key={index}>
                                            <Image
                                                key={index}
                                                src={img}
                                                alt={`Gallery ${index}`}
                                                onClick={() => openImage(index)}
                                                style={{ borderRadius: "0px" }}
                                            />
                                        </div>
                                    ))}


                                </div>
                            </div>
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
                </section>
                <Footer />
            </div>
        </ProtectedPage>
    );
};

export default StreetPortfoliio;
