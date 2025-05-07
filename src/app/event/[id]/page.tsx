"use client";
import { useEffect, useState } from 'react';
import { useParams } from "next/navigation";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Navbar";
import ProtectedPage from "@/components/ProtectedPage";
import InnerBanner from "@/components/ui/InnerBanner";
import topImage from "@/assets/images/carshow/carshow-top.png";
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperClass } from 'swiper';
import { Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import Image from "next/image";

import firstImg from "@/assets/images/carshow/1.jpg";
import secImg from "@/assets/images/carshow/2.jpg";
import thirdImg from "@/assets/images/carshow/3.jpg";
import fourthImg from "@/assets/images/carshow/4.jpg";
import fifthImg from "@/assets/images/carshow/5.jpg";
import sixthImg from "@/assets/images/carshow/6.jpg";
import seventhImg from "@/assets/images/carshow/7.jpg";
import eightImg from "@/assets/images/carshow/8.jpg";
import nineImg from "@/assets/images/carshow/9.jpg";
import tenImg from "@/assets/images/carshow/10.jpg";
import elevenImg from "@/assets/images/carshow/11.jpg";
import twelveImg from "@/assets/images/carshow/12.jpg";
import { getEvents } from '@/lib/EventsApi/api';
import toast from 'react-hot-toast';
import { FaArrowLeft, FaArrowRight, FaTimes } from 'react-icons/fa';


interface EventType {
    _id: string;
    eventname: string;
    description?: string;
    images?: string[];
}

const CarShow = () => {
    const marchImages = [firstImg, secImg, thirdImg, fourthImg, fifthImg, sixthImg];
    const septImages = [seventhImg, eightImg, nineImg, tenImg, elevenImg, twelveImg];
    const token = sessionStorage.getItem("token");

    const params = useParams();
    const eventId = params?.id as string;

    const [eventData, setEventData] = useState<EventType | null>(null);
    const [marchThumbs, setMarchThumbs] = useState<SwiperClass | null>(null);
    const [septThumbs, setSeptThumbs] = useState<SwiperClass | null>(null);



    const fetchEventData = async () => {
        try {
            const allEvents = await getEvents();
            const matchedEvent = allEvents?.find((e: any) => e._id === eventId);
            if (matchedEvent) {
                setEventData(matchedEvent);
            } else {
                toast.error("Event not found.");
            }
        } catch (error) {
            console.error("Failed to fetch events", error);
            toast.error("Failed to fetch events.");
        }
    };


    useEffect(() => {
        fetchEventData();
    }, []);




    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const [currentIndex, setCurrentIndex] = useState<number | null>(null);



    const closeImage = () => {
        setSelectedImage(null);
        setCurrentIndex(null);
    };

    const openImage = (index: number) => {
        const images = eventData?.images ?? [];
        setSelectedImage(images[index]);
        setCurrentIndex(index);
    };

    const prevImage = () => {
        if (currentIndex !== null && currentIndex > 0) {
            const images = eventData?.images ?? [];
            setCurrentIndex(currentIndex - 1);
            setSelectedImage(images[currentIndex - 1]);
        }
    };

    const nextImage = () => {
        const images = eventData?.images ?? [];
        if (currentIndex !== null && currentIndex < images.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setSelectedImage(images[currentIndex + 1]);
        }
    };




    return (
        <ProtectedPage allowedRoles={["home owner", "home member", "board member", "admin"]}>
            <div className="carShow-wrapper">
                <Header />
                {eventData?.eventname && (
                    <InnerBanner title={eventData?.eventname} />
                )}
                <div className="container my-5">
                    
                    <div className="row">
                        <div className="content">
                            {eventData?.description && (
                                <div dangerouslySetInnerHTML={{ __html: eventData.description }} />
                            )}
                        </div>
                    </div>
                    {eventData?.eventname == "Car Show" && eventData?.images && (
                        <div className="row">
                            <div className="col-lg-12">
                                <div className='sliderr-wrap'>
                                    <h2 style={{ textAlign: 'center' }}>March 2023</h2>
                                    <Swiper
                                        modules={[Navigation, Thumbs]}
                                        navigation
                                        thumbs={{ swiper: marchThumbs }}
                                        className="main-slider"
                                        style={{ width: "100%", height: 500 }}
                                    >
                                        {eventData?.images.map((src, index) => (
                                            <SwiperSlide key={index}>
                                                <Image src={src} alt={`March ${index}`} fill style={{ objectFit: 'cover' }} />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                    <Swiper
                                        onSwiper={setMarchThumbs}
                                        modules={[Thumbs]}
                                        spaceBetween={5}
                                        slidesPerView={10}
                                        className="thumb-slider"
                                        watchSlidesProgress
                                    >
                                        {eventData?.images.map((src, index) => (
                                            <SwiperSlide key={index}>
                                                <img src={src} alt={`March thumb ${index}`} height={40} style={{ objectFit: 'contain', width: "100%", }} />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>
                            </div>
                        </div>

                    )}

                    {eventData?.eventname != "Car Show" && eventData?.images && (
                        <section className="gallery-sec" style={{ padding: "0px" }}>
                            <div className="gallery">
                                <div className="gallery-grid">
                                    <div className="container">

                                        <div className="row">
                                            {eventData?.images.map((img, index) => (
                                                <div className="col-lg-3" key={index}>
                                                    <img
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
                                        <img
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
                                            disabled={currentIndex === eventData?.images?.length - 1}
                                        >
                                            <FaArrowRight />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </section>

                    )}
                </div>
                <Footer />
            </div>
        </ProtectedPage>
    );
};

export default CarShow;
