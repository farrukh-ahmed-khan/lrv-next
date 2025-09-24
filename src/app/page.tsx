"use client";

import React, { useEffect, useState } from "react";

import aboutUsImg from "@/assets/images/aboutImg.png";
import payImg from "@/assets/images/home/pay-img.png";
import slide1 from "@/assets/images/home/slide1.png";
import slide2 from "@/assets/images/home/slide2.png";

import gallery1 from "@/assets/images/home/gallery1.png";
import gallery2 from "@/assets/images/home/gallery2.png";
import gallery3 from "@/assets/images/home/gallery3.png";
import gallery4 from "@/assets/images/home/gallery4.png";
import gallery5 from "@/assets/images/home/gallery5.png";
import gallery6 from "@/assets/images/home/gallery6.png";
import gallery7 from "@/assets/images/home/gallery7.png";
import gallery8 from "@/assets/images/home/gallery8.png";

import { FaArrowLeft, FaArrowRight, FaTimes } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/autoplay";


import { Autoplay } from "swiper/modules";

import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Navbar";
import HomeBanner from "@/components/ui/HomeBanner";
import AboutUs from "@/components/ui/AboutUs";
import { getDirectors } from "@/lib/DirectorsApi/api";

interface Director {
  id: number;
  name: string;
  designation: string;
  image: StaticImageData;
}



interface Event {
  id: number;
  img: StaticImageData;
  name: string;
  para1: string;
  para2: string;
}

const events: Event[] = [
  {
    id: 1,
    img: slide1,
    name: "HALLOWEEN PARTY",
    para1:
      "The Los Ranchos Verdes Homeowners Association sponsors, in part, an annual LRV Halloween Party.We also include our adjacent neighbors from Ranchview Road.",
    para2:
      "This children's and adult event takes place at the intersection of Seacrest Road and Shady Vista Road, and precedes trick-or-treating activities in LRV. There are games, prizes, food (pizza), and soft drinks.",
  },
  {
    id: 2,
    img: slide2,
    name: "CHRISTMAS PARTY",
    para1:
      "The Los Ranchos Verdes Homeowners Association sponsors, in part, an Annual LRV Christmas Party in December. All homeowners are invited to attend. Each year, the Christmas Party gathering is hosted by a volunteer homeowner.",
    para2:
      "Around 6:00PM, residents meet at the designated Christmas Party home for food, beverages, fun, voting for your favorite Christmas decorations, and perhaps a Santa visit for the kids!",
  },
  {
    id: 3,
    img: slide1,
    name: "CHRISTMAS PARTY",
    para1:
      "The Los Ranchos Verdes Homeowners Association sponsors, in part, an Annual LRV Christmas Party in December. All homeowners are invited to attend. Each year, the Christmas Party gathering is hosted by a volunteer homeowner.",
    para2:
      "Around 6:00PM, residents meet at the designated Christmas Party home for food, beverages, fun, voting for your favorite Christmas decorations, and perhaps a Santa visit for the kids!",
  },
  {
    id: 4,
    img: slide2,
    name: "CHRISTMAS PARTY",
    para1:
      "The Los Ranchos Verdes Homeowners Association sponsors, in part, an Annual LRV Christmas Party in December. All homeowners are invited to attend. Each year, the Christmas Party gathering is hosted by a volunteer homeowner.",
    para2:
      "Around 6:00PM, residents meet at the designated Christmas Party home for food, beverages, fun, voting for your favorite Christmas decorations, and perhaps a Santa visit for the kids!",
  },
];

interface DirectorType {
  _id: string;
  directorname: string;
  designation: string;
  description?: string;
  image?: string;
}


const images: StaticImageData[] = [
  gallery1,
  gallery2,
  gallery3,
  gallery4,
  gallery5,
  gallery6,
  gallery7,
  gallery8,
];


const Home: React.FC = () => {
  const [directorData, setDirectorData] = useState<DirectorType[]>([]);
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

  const fetchDirectorData = async () => {
    try {
      const data = await getDirectors();
      if (Array.isArray(data)) {
        setDirectorData(data);
      } else if (data?.directors && Array.isArray(data.directors)) {
        setDirectorData(data.directors);
      } else {
        setDirectorData([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDirectorData();
  }, []);

  return (
    <>
      <div className="home-wrapper">
        <Header />
        <section className="homeBanner-wrapper">
          <HomeBanner
            title="LOS RANCHOS VERDES HOA"
            subtitle="Welcome To"
            buttons={[
              { label: "Board Member Voting", link: "#" },
              { label: "Pay My LRVHOA Dues", link: "#" },
            ]}
          />
        </section>
        <>
          <AboutUs
            title="About Us"
            paragraphs={[
              "Los Ranchos Verdes is a small community in Rolling Hills Estates, California. Los Ranchos Verdes is Spanish, meaning 'The Green Ranches'.",
              "Los Ranchos Verdes is located very close to the intersection of Hawthorne Boulevard and Palos Verdes Drive North. We are also 'just-down-road' from Rolling Hills Estates City Hall, located at the NW corner of Palos Verdes Drive North and Crenshaw Boulevard.",
              "Our small, beautiful, country-like community consists of 151 households. We have an active Homeowners Association, a Board of Directors, and an effective Neighborhood Watch Program.",
            ]}
            button={{ label: "Read More", link: "#" }}
            image={aboutUsImg}
          />
        </>
        <section className="services-wrapper">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="heading-wrap">
                  <h4>Services</h4>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6" style={{ paddingRight: "0px" }}>
                <div className="service-card-wrap first">
                  <h4>DIRECTORY</h4>
                  <p>
                    Our LRV Phone Directoryis your connection to your LRV
                    neighbors. This Phone Directory is private and used
                    exclusively and strictly for neighborly concerns and causes.
                  </p>
                  <p>Here's a link to the most current LRV Phone Directory:</p>
                  <div className="btn-wrap">
                    <Link href="#" className="btns-style green">
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-lg-6" style={{ paddingLeft: "0px" }}>
                <div className="service-card-wrap">
                  <h4>DUES</h4>
                  <p>
                    LRV Homeowner Association dues are payable annually in
                    January, by January 31st. Your $30.00 in annual dues helps
                    to pay for a variety of LRV HOA expenses, i.e., landscaping,
                    electricity & lighting for the common entry area, and
                    maintenance at the corners of Palos Verdes Drive North &
                    Silver Saddle Lane.
                  </p>
                  <div className="btn-wrap">
                    <Link href="#" className="btns-style green">
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="dues-sec-wrapper">
          <div className="container">
            <div className="row">
              <div className="col-lg-3"></div>
              <div className="col-lg-6">
                <div className="heading-wrap">
                  <h4>Pay My LRVHOA Dues</h4>
                  <p>
                    Keeping your community running smoothly requires timely
                    contributions from all homeowners. At LRVHOA, we've made it
                    easy and secure for you to pay your Homeowners Association
                    (HOA) dues online or by other convenient methods.
                  </p>
                  <div className="btn-wrap">
                    <Link href="#" className="btns-style">
                      Pay My LRVHOA Dues
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-lg-3"></div>
              <div className="col-lg-12">
                <div className="img-wrap">
                  <Image src={payImg} alt="" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="board-director">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="heading-wrap">
                  <h4>our lrv board of directors</h4>
                </div>
              </div>
            </div>
            <div className="row d-flex justify-content-center">
              
              {directorData.map((member, index) => (
                <div className="col-lg-3" key={member._id || index}>
                  <div className="director-card">
                    <div className="img-wrap">
                      <Image
                        src={member.image || "/images/person-icon.png"} // fallback image
                        alt={member.directorname || "director"}
                        width={200}
                        height={200}
                      />
                    </div>
                    <div className="content-wrap">
                      <h4>{member.directorname}</h4>
                      <p>{member.designation}</p>
                      {member?.description ? (
                        <p>{member.description}</p>
                      ) : (
                        <p></p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="upcoming-sec">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="heading-wrap">
                  <h4>upcoming events</h4>
                </div>
              </div>
            </div>
            <div className="row">
              <Swiper
                slidesPerView={2}
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
                    slidesPerView: 2,
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
                {events.map((member, index) => (
                  <>
                    <SwiperSlide key={index}>
                      <div className="slide-wrapper">
                        <div className="slide-img">
                          <Image src={member.img} alt="" />
                        </div>
                        <div className="slide-content">
                          <h4>{member.name}</h4>
                          <p>{member.para1}</p>
                          <p>{member.para2}</p>
                          <div className="btn-wrap">
                            <Link href="#" className="btns-style">
                              See Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  </>
                ))}

                {/* <SwiperSlide>Slide 2</SwiperSlide>
                <SwiperSlide>Slide 3</SwiperSlide>
                <SwiperSlide>Slide 4</SwiperSlide>
                <SwiperSlide>Slide 5</SwiperSlide>
                <SwiperSlide>Slide 6</SwiperSlide>
                <SwiperSlide>Slide 7</SwiperSlide>
                <SwiperSlide>Slide 8</SwiperSlide>
                <SwiperSlide>Slide 9</SwiperSlide> */}
              </Swiper>
            </div>
          </div>
        </section>

        <section className="gallery-sec">
          <div className="gallery">
            <div className="gallery-grid">
              <div className="container">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="heading-wrap">
                      <h4>Explore gallery</h4>
                    </div>
                  </div>
                </div>
                <div className="row">
                  {images.map((img, index) => (
                    <div className="col-lg-3" key={index}>
                      <Image
                        key={index}
                        src={img}
                        alt={`Gallery ${index}`}
                        onClick={() => openImage(index)}
                      />
                    </div>
                  ))}

                  <div className="btn-wrap">
                    <Link href="#" className="btns-style green">
                      Read More
                    </Link>
                  </div>
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

        <section className="contact-us-wrapper">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="heading-wrap">
                  <h4>Contact Us</h4>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-4"></div>
              <div className="col-lg-4">
                <div className="form-wrapper">
                  <form className="contact-form">
                    <input type="text" placeholder="Enter Your Full Name..." />
                    <input
                      type="text"
                      placeholder="Enter Your Email Address..."
                    />
                    <input
                      type="text"
                      placeholder="Enter Your Phone Number..."
                    />
                    <textarea
                      name="message"
                      id="message"
                      placeholder="Enter Your Message..."
                    ></textarea>
                    <div className="btn-wrap">
                      <button className="btns-style green">
                        Contact Us
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              <div className="col-lg-4"></div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
};

export default Home;
