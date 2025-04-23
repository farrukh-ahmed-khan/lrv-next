"use client";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Navbar";
import ProtectedPage from "@/components/ProtectedPage";
import InnerBanner from "@/components/ui/InnerBanner";
import firstImg from "@/assets/images/halloween/topimg.jpg"
import Image, { StaticImageData } from "next/image";
import gallery1 from "@/assets/images/halloween/gallery1.webp";
import gallery2 from "@/assets/images/halloween/gallery2.webp";
import gallery3 from "@/assets/images/halloween/gallery3.webp";
import gallery4 from "@/assets/images/halloween/gallery4.webp";
import gallery5 from "@/assets/images/halloween/gallery5.webp";
import gallery6 from "@/assets/images/halloween/gallery6.webp";
import gallery7 from "@/assets/images/halloween/gallery7.webp";
import gallery8 from "@/assets/images/halloween/gallery8.webp";
import gallery9 from "@/assets/images/halloween/gallery9.webp";
import gallery10 from "@/assets/images/halloween/gallery10.webp";
import gallery11 from "@/assets/images/halloween/gallery11.webp";
import gallery12 from "@/assets/images/halloween/gallery12.webp";
import gallery13 from "@/assets/images/halloween/gallery13.webp";
import gallery14 from "@/assets/images/halloween/gallery14.webp";
import gallery15 from "@/assets/images/halloween/gallery15.webp";
import gallery16 from "@/assets/images/halloween/gallery16.webp";
import gallery17 from "@/assets/images/halloween/gallery17.webp";
import gallery18 from "@/assets/images/halloween/gallery18.webp";
import gallery19 from "@/assets/images/halloween/gallery19.webp";
import gallery20 from "@/assets/images/halloween/gallery20.webp";
import gallery21 from "@/assets/images/halloween/gallery21.webp";
import gallery22 from "@/assets/images/halloween/gallery22.webp";
import gallery23 from "@/assets/images/halloween/gallery23.webp";
import gallery24 from "@/assets/images/halloween/gallery24.webp";



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
    gallery9,
    gallery10,
    gallery11,
    gallery12,
    gallery13,
    gallery14,
    gallery15,
    gallery16,
    gallery17,
    gallery18,
    gallery19,
    gallery20,
    gallery21,
    gallery22,
    gallery23,
    gallery24,
];

const Halloween = () => {


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
                <InnerBanner title="Halloween Party" />
                <div className="container mb-5">
                    <div className="row">
                        <div className="content">
                            <h4>
                                Annual LRV Halloween Party
                            </h4>
                            <p>
                                The Los Ranchos Verdes Homeowners Association sponsors, in part, an annual LRV Halloween Party.
                            </p>
                            <p>
                                This children’s and adult event takes place on Halloween at the Cul
                                de Sac at 40 Santa Bella Road or at the intersection of Seacrest Road
                                and Shady Vista Road, and precedes trick-or-treating activities in LRV.
                                There are games, food (pizza), and soft drinks. The LRV Homeowners Association
                                subsidizes some of the Party expenses. Everyone brings a favorite dish or two.
                                We also include our adjacent neighbors from Ranchview Road.
                            </p>
                            <p>
                                To purchase tickets and get more detailed information, go to the LRV Events page, here!
                            </p>


                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="img-wrap mt-5" style={{ textAlign: "center", transform: "rotate(30deg)", marginTop: "50px", }}>
                                <Image src={firstImg} alt="firstImg" style={{ border: "2px solid #2d4736", margin: "50px 0" }} />
                            </div>
                        </div>

                    </div>

                </div>
                <section className="gallery-sec" style={{ padding: "0px" }}>
                    <div className="gallery">
                        <div className="gallery-grid">
                            <div className="container">

                                <div className="row">
                                    {images.map((img, index) => (
                                        <div className="col-lg-3" key={index}>
                                            <Image
                                                key={index}
                                                src={img}
                                                alt={`Gallery ${index}`}
                                                onClick={() => openImage(index)}
                                                style={{ height: "200px" }}
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

export default Halloween;
