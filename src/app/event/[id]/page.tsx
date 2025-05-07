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

    console.log(eventData?.description)
  
    return (
        <ProtectedPage allowedRoles={["home owner", "home member", "board member", "admin"]}>
            <div className="carShow-wrapper">
                <Header />
                <InnerBanner title="Car Show" />
                <div className="container my-5">
                    <div className="row">
                        <div className="top-img-wrap">
                            <Image src={topImage} alt="topImage" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="content">
                            {eventData?.description && (
                                <div dangerouslySetInnerHTML={{ __html: eventData.description }} />
                            )}

                            {/* <p>
                                Open to all members of the LRV Homeowners Association, you are cordially invited to exhibit in or
                                observe the Annual LRV Car Show, currently running twice a year, March and September. Check the
                                LRV Events Calendar for specific dates.
                            </p> */}
                            {/* <p>
                                This neighborhood event isn’t “just a Car Show”, at its heart, it’s really a
                                Social Event for the LRV neighborhood and nearby neighbors!
                                Come out, meet and greet your LRV neighbors, enjoy the cars,
                                and soak in some complimentary coffee and donut holes!
                            </p>
                            <p>
                                There’s no cost to show off your special ride, nor to stop by to see and learn about all the ‘car stories’.
                            </p>
                            <p>
                                We welcome your attendance or participation!
                            </p> */}
                        </div>
                    </div>
                    <div className="row">
                        <div className="row">
                            <div className="col-lg-6">
                                <div className='sliderr-wrap'>
                                    <h2 style={{ textAlign: 'center' }}>March 2023</h2>
                                    <Swiper
                                        modules={[Navigation, Thumbs]}
                                        navigation
                                        thumbs={{ swiper: marchThumbs }}
                                        className="main-slider"
                                        style={{ width: "100%", height: 300 }}
                                    >
                                        {marchImages.map((src, index) => (
                                            <SwiperSlide key={index}>
                                                <Image src={src} alt={`March ${index}`} fill style={{ objectFit: 'cover' }} />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                    <Swiper
                                        onSwiper={setMarchThumbs}
                                        modules={[Thumbs]}
                                        spaceBetween={5}
                                        slidesPerView={4}
                                        className="thumb-slider"
                                        watchSlidesProgress
                                    >
                                        {marchImages.map((src, index) => (
                                            <SwiperSlide key={index}>
                                                <Image src={src} alt={`March thumb ${index}`} height={40} style={{ objectFit: 'cover', width: "100%", }} />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>
                            </div>

                            <div className="col-lg-6">
                                <div className='sliderr-wrap'>
                                    <h2 style={{ textAlign: 'center' }}>Sept. 2022</h2>
                                    <Swiper
                                        modules={[Navigation, Thumbs]}
                                        navigation
                                        thumbs={{ swiper: septThumbs }}
                                        className="main-slider"
                                        style={{ width: "100%", height: 300 }}
                                    >
                                        {septImages.map((src, index) => (
                                            <SwiperSlide key={index}>
                                                <Image src={src} alt={`Sept ${index}`} fill style={{ objectFit: 'cover' }} />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                    <Swiper
                                        onSwiper={setSeptThumbs}
                                        modules={[Thumbs]}
                                        spaceBetween={5}
                                        slidesPerView={4}
                                        className="thumb-slider"
                                        watchSlidesProgress

                                    >
                                        {septImages.map((src, index) => (
                                            <SwiperSlide key={index}>
                                                <Image src={src} alt={`Sept thumb ${index}`} height={40} style={{ objectFit: 'cover', width: "100%", }} />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
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

export default CarShow;
