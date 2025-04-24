"use client";
import { useState } from 'react';

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


import one from "@/assets/images/photogallery/1.webp"
import two from "@/assets/images/photogallery/2.webp"
import three from "@/assets/images/photogallery/3.webp"
import four from "@/assets/images/photogallery/4.webp"
import five from "@/assets/images/photogallery/5.webp"
import six from "@/assets/images/photogallery/6.webp"
import seven from "@/assets/images/photogallery/7.webp"
import eight from "@/assets/images/photogallery/8.webp"
import nine from "@/assets/images/photogallery/9.webp"
import ten from "@/assets/images/photogallery/10.webp"
import eleven from "@/assets/images/photogallery/11.webp"
import twelve from "@/assets/images/photogallery/12.webp"
import thirteen from "@/assets/images/photogallery/13.webp"
import fourteen from "@/assets/images/photogallery/14.webp"
import fifteen from "@/assets/images/photogallery/15.webp"
import sixteen from "@/assets/images/photogallery/16.webp"
import seventeen from "@/assets/images/photogallery/17.webp"
import eighteen from "@/assets/images/photogallery/18.webp"
import nineteen from "@/assets/images/photogallery/19.webp"
import twenty from "@/assets/images/photogallery/20.webp"
import twentyone from "@/assets/images/photogallery/21.webp"
import twentytwo from "@/assets/images/photogallery/22.webp"
import twentythree from "@/assets/images/photogallery/23.webp"
import twentyfour from "@/assets/images/photogallery/24.webp"
import twentyfive from "@/assets/images/photogallery/25.webp"
import twentysix from "@/assets/images/photogallery/26.webp"
import twentyseven from "@/assets/images/photogallery/27.webp"
import twentyeight from "@/assets/images/photogallery/28.webp"
import twentynine from "@/assets/images/photogallery/29.webp"
import thirty from "@/assets/images/photogallery/30.webp"
import thirtyone from "@/assets/images/photogallery/31.webp"
import thirtytwo from "@/assets/images/photogallery/32.webp"
import thirtythree from "@/assets/images/photogallery/33.webp"
import thirtyfour from "@/assets/images/photogallery/34.webp"

const CarShow = () => {
    const septImages = [
        one, two, three, four, five, six, seven, eight, nine, ten,
        eleven, twelve, thirteen, fourteen, fifteen, sixteen, seventeen, eighteen,
        nineteen, twenty, twentyone, twentytwo, twentythree, twentyfour, twentyfive,
        twentysix, twentyseven, twentyeight, twentynine, thirty, thirtyone, thirtytwo,
        thirtythree, thirtyfour
    ];

    const [septThumbs, setSeptThumbs] = useState<SwiperClass | null>(null);

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
                                            <Image src={src} alt={`Sept thumb ${index}`} height={40} style={{ objectFit: 'cover', width: "100%", }} />
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
