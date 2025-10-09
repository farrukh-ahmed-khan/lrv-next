"use client";
import { useEffect, useState } from 'react';

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
import { getLibrarys } from '@/lib/GalleryApi/api';

const CarShow = () => {
    const [septImages, setSeptImages] = useState([])
    const [septThumbs, setSeptThumbs] = useState<SwiperClass | null>(null);

    const fetchLibraryData = async () => {
        try {
            const data = await getLibrarys();
            // console.log(data[0].images)
            setSeptImages(data[0].images || []);

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchLibraryData();
    }, []);

    return (
        <ProtectedPage allowedRoles={["home owner", "home member", "board member", "admin"]}>
            <div className="carShow-wrapper">
                <Header />
                <InnerBanner title="LRV PHOTO GALLERY" />
                <div className="container my-5">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className='sliderr-wrap'>
                                <Swiper
                                    modules={[Navigation, Thumbs]}
                                    navigation
                                    thumbs={{ swiper: septThumbs }}
                                    className="main-slider"
                                    style={{ width: "100%", height: 500 }}
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
                                    slidesPerView={10}
                                    className="thumb-slider"
                                    watchSlidesProgress

                                >
                                    {septImages.map((src, index) => (
                                        <SwiperSlide key={index}>
                                            <Image src={src} alt={`Sept thumb ${index}`} width={40} height={40} style={{ objectFit: 'cover', width: "100%", }} />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
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
