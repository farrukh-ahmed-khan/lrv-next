"use client";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Navbar";
import ProtectedPage from "@/components/ProtectedPage";
import InnerBanner from "@/components/ui/InnerBanner";
import firstImg from "@/assets/images/christmas/1.jpg"
import secImg from "@/assets/images/christmas/2.jpg"
import Image, { StaticImageData } from "next/image";
import gallery1 from "@/assets/images/christmas/gallery1.webp";
import gallery2 from "@/assets/images/christmas/gallery2.webp";
import gallery3 from "@/assets/images/christmas/gallery3.webp";
import gallery4 from "@/assets/images/christmas/gallery4.webp";
import gallery5 from "@/assets/images/christmas/gallery5.webp";
import gallery6 from "@/assets/images/christmas/gallery6.webp";

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
];

const NeighborhoodWatch = () => {


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
            <div className="christmas-wrapper">
                <Header />
                <InnerBanner title="Annual LRV Christmas Party" />
                <div className="container mb-5">
                    <div className="row">
                        <div className="content">
                            <h4>
                                Annual LRV Christmas Party
                            </h4>
                            <p>
                                The Los Ranchos Verdes Homeowners Association sponsors, in part, an Annual LRV Christmas Party
                                in December. All homeowners are invited to attend. Each year, the Christmas Party gathering
                                is hosted by a volunteer homeowner.
                            </p>
                            <p>
                                The Holiday festivities begin at 5:00PM with a drive around the
                                LRV properties to view the Christmas decorations because everyone
                                gets to vote on the best-decorated house in the neighborhood
                                (a little friendly rivalry!).
                            </p>
                            <p>
                                Go HERE to register/RSVP for the Annual LRV Christmas Party!
                            </p>
                            <p>
                                Around 6:00PM, residents meet at the designated Christmas Party home for food, beverages, fun, and voting for your favorite Christmas decorations.
                            </p>
                            <p>
                                Beverages are always welcome, along with appetizers and side-dishes, but please no desserts!
                            </p>

                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="img-wrap">
                                <Image src={firstImg} alt="firstImg" />
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="img-wrap">
                                <Image src={secImg} alt="secImg" />
                            </div>
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="content">
                            <h5>
                                LRV Zone 4 Neighbor Dessert Bake Off Get Together at the Mairs — December 2016
                            </h5>
                            <p>
                                A BIG THANKS to Ron And Bev Mairs for hosting the get together
                                at their lovely home and a BIG THANK YOU to Victoria Bueno for
                                organizing the event. THANK YOU!!
                            </p>
                            <p>
                                Here’s a few photos from the get-together..,
                            </p>
                        </div>
                    </div>
                </div>
                <section className="gallery-sec" style={{padding: "0px"}}>
                    <div className="gallery">
                        <div className="gallery-grid">
                            <div className="container">
                                
                                <div className="row">
                                    {images.map((img, index) => (
                                        <div className="col-lg-4" key={index}>
                                            <Image
                                                key={index}
                                                src={img}
                                                alt={`Gallery ${index}`}
                                                onClick={() => openImage(index)}
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

export default NeighborhoodWatch;
