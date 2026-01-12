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
import toast from "react-hot-toast";
import { uploadContactForms } from "@/lib/ContactFormApi/api";
import { getEvents } from "@/lib/UpcomingEventsApi/api";
import { getLibrarys } from "@/lib/GalleryApi/api";

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

interface DirectorType {
  _id: string;
  directorname: string;
  designation: string;
  description?: string;
  image?: string;
}


// const images: StaticImageData[] = [
//   gallery1,
//   gallery2,
//   gallery3,
//   gallery4,
//   gallery5,
//   gallery6,
//   gallery7,
//   gallery8,
// ];

interface EventType {
  _id: string;
  eventname: string;
  description?: string;
  image: string;
}



const Home: React.FC = () => {
  const [directorData, setDirectorData] = useState<DirectorType[]>([]);
  const [selectedImage, setSelectedImage] = useState<StaticImageData | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [eventData, setEventData] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState([])

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });


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

  const fetchEventData = async () => {
    try {
      const data = await getEvents();
      if (Array.isArray(data)) {
        setEventData(data);
      } else if (data?.events && Array.isArray(data.events)) {
        setEventData(data.events);
      } else {
        setEventData([]);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch events.");
    }
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true)
      const data = await uploadContactForms(formData);
      setFormData({ fullName: "", email: "", phone: "", message: "" });
      toast.success(data.message);
    } catch (error: any) {
      toast.error(error.message);
    }
    finally {
      setLoading(false);
    }
  };

  const fetchLibraryData = async () => {
    try {
      const data = await getLibrarys();
      // console.log(data[0].images)
      setImages(data[0].images || []);

    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch librarys.");
    }
  };

  useEffect(() => {
    fetchLibraryData();
    fetchEventData();
    fetchDirectorData();
  }, []);

  return (
    <>
      <div className="home-wrapper">
        <Header />
        <section className="homeBanner-wrapper">
          <HomeBanner
            title="LOS RANCHOS VERDES HOA"
          // subtitle="Welcome To"
          // buttons={[
          //   { label: "Board Member Voting", link: "/vote-candidate" },
          //   { label: "Pay My LRVHOA Dues", link: "/dues" },
          // ]}
          />
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
                className="mySwiper"
              >
                {eventData.map((member) => (
                  <SwiperSlide key={member._id}>
                    <div className="slide-wrapper">
                      <div className="slide-img relative w-full h-[300px]">
                        <Image
                          src={member.image}
                          alt={member.eventname}
                          width={500}
                          height={300}
                        // fill
                        // className="object-cover rounded-lg"
                        />
                      </div>
                      <div className="slide-content">
                        <h4>{member.eventname}</h4>
                        <p>{member.description}</p>
                        <div className="btn-wrap">
                          <Link href="/upcomingEvents" className="btns-style">
                            See Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}

              </Swiper>
            </div>
          </div>
        </section>

        <>
          <AboutUs
            title="About Us"
            paragraphs={[
              "Los Ranchos Verdes is a small community in Rolling Hills Estates, California. Los Ranchos Verdes is Spanish, meaning 'The Green Ranches'.",
              "Los Ranchos Verdes is located very close to the intersection of Hawthorne Boulevard and Palos Verdes Drive North. We are also 'just-down-road' from Rolling Hills Estates City Hall, located at the NW corner of Palos Verdes Drive North and Crenshaw Boulevard.",
              "Our small, beautiful, country-like community consists of 151 households. We have an active Homeowners Association, a Board of Directors, and an effective Neighborhood Watch Program.",
            ]}
            // button={{ label: "Read More", link: "/about" }}
            image={aboutUsImg}
          />
        </>



        <section className="services-wrapper">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="heading-wrap">
                  <h4>DIRECTORY</h4>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12" style={{ paddingRight: "0px" }}>
                <div className="service-card-wrap first">
                  {/* <h4>DIRECTORY</h4> */}
                  <p>
                    Our LRV Directory is your connection to your LRV neighbors. This Directory is private and used exclusively and strictly for neighborly concerns and causes.

                  </p>
                  <p>Click below for the most current LRV Directory:</p>
                  <div className="btn-wrap">
                    <Link href="/phonedirectory" className="btns-style green">
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
              {/* <div className="col-lg-6" style={{ paddingLeft: "0px" }}>
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
                    <Link href="/dues" className="btns-style green">
                      Read More
                    </Link>
                  </div>
                </div>
              </div> */}
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
                    <Link href="/dues" className="btns-style">
                      Pay My LRVHOA Dues
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-lg-3"></div>
              {/* <div className="col-lg-12">
                <div className="img-wrap">
                  <Image src={payImg} alt="" />
                </div>
              </div> */}
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
                  {images.slice(0, 12).map((img, index) => (
                    <div className="col-lg-3" key={index}>
                      <Image
                        key={index}
                        src={img}
                        alt={`Gallery ${index}`}
                        onClick={() => openImage(index)}
                        width={400}
                        height={400}
                      />
                    </div>
                  ))}

                  <div className="btn-wrap">
                    <Link href="/photoGallery" className="btns-style green">
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
                  width={400}
                  height={400}
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
                  <form className="contact-form" onSubmit={handleSubmit}>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Enter Your Full Name..."
                      value={formData.fullName}
                      onChange={handleChange}
                    />
                    <input
                      type="text"
                      name="email"
                      placeholder="Enter Your Email Address..."
                      value={formData.email}
                      onChange={handleChange}
                    />
                    <input
                      type="text"
                      name="phone"
                      placeholder="Enter Your Phone Number..."
                      value={formData.phone}
                      onChange={handleChange}
                    />
                    <textarea
                      name="message"
                      placeholder="Enter Your Message..."
                      value={formData.message}
                      onChange={handleChange}
                    />
                    <div className="btn-wrap">
                      <button
                        type="submit"
                        className="btns-style green"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Sending...
                          </>
                        ) : (
                          "Contact Us"
                        )}
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
