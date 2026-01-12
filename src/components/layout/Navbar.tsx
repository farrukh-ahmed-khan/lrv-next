"use client"
import React, { useState, useEffect } from "react";
import logo from "@/assets/images/logo.png"
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getEvents } from "@/lib/EventsApi/api";
import toast from "react-hot-toast";
import { Person } from "@mui/icons-material";

interface EventType {
  _id: string;
  eventname: string;
  description?: string;
  images?: string[];
}

const Header = () => {
  const [eventData, setEventData] = useState<EventType[]>([]);
  const local_token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const router = useRouter();

  const navbardata: any[] = [
    {
      id: 1,
      title: "Member Directory",
      link: "/phonedirectory",
    },
    {
      id: 2,
      title: "About LRV",
      link: "/about",
      hasSubmenu: true,
      submenu: [
        { title: "About Us", link: "/about" },
        { title: "Welcome Flyer", link: "/neighbor" },
        { title: "Bylaws", link: "/lrvlaw" },
        {
          title: "Neighborhood Watch",
          link: "/event/686eaf69226e06ff7b833d8b",
        },
        {
          title: "City of Rolling Hills Estates",
          link: "http://www.ci.rolling-hills-estates.ca.us/",
        },
      ],
    },
    {
      id: 3,
      title: "LRV Board",
      link: "/lrvboard",
      hasSubmenu: true,
      submenu: [
        { title: "Board Of Directors", link: "/lrvboard" },
        { title: "LRV Board Meetings", link: "/lrv-board-meeting" },
      ],
    },
    {
      id: 4,
      title: "Events",
      link: "#",
      hasSubmenu: true,
      submenu: [
        { title: "Upcoming Events", link: "/upcomingEvents" },
        ...eventData.map((event) => ({
          title: event.eventname,
          link: `/event/${event._id}`,
        })),
      ],
    },
    {
      id: 5,
      title: "My Dues",
      link: "/dues",
    },
    {
      id: 6,
      title: "Contact",
      link: "/contactus",
    },
  ];

  // {
  //   id: 1,
  //   title: "Home",
  //   link: "/",
  // },
  // {
  //   id: 2,
  //   title: "Services",
  //   link: "/services",
  //   submenu: [
  //     {
  //       title: "NewsLetter",
  //       link: "/newsletter",
  //     },
  //     {
  //       title: "Directory",
  //       link: "/phonedirectory",
  //     },
  //     {
  //       title: "Dues",
  //       link: "/dues",
  //     },
  //   ],
  //   hasSubmenu: true,
  // },
  // {
  //   id: 3,
  //   title: "LRV Board",
  //   link: "/lrvboard",
  //   submenu: [
  //     {
  //       title: "Board Of Directors",
  //       link: "/lrvboard",
  //     },
  //     {
  //       title: "LRV Board Meetings",
  //       link: "/lrv-board-meeting",
  //     },
  //     {
  //       title: "LRVHOA By laws",
  //       link: "/lrvlaw",
  //     },
  //   ],
  //   hasSubmenu: true,
  // },
  // {
  //   id: 4,
  //   title: "Community",
  //   link: "/community",
  //   submenu: [
  //     ...eventData.map((event) => ({
  //       title: event.eventname,
  //       link: `/event/${event._id}`,
  //     })),
  //   ],
  //   hasSubmenu: true,
  // },

  // {
  //   id: 5,
  //   title: "About LRV",
  //   link: "/about",
  //   submenu: [
  //     {
  //       title: "Contact LRV",
  //       link: "/contactus",
  //     },
  //     {
  //       title: "LRV streets Portfolio",
  //       link: "/streetportfolio",
  //     },
  //     {
  //       title: "LRVHOA.NET SECURITY",
  //       link: "/security",
  //     },
  //     {
  //       title: "New Neighbor Welcome Flyer",
  //       link: "/neighbor",
  //     },
  //     {
  //       title: "LRV PHOTO GALLERY",
  //       link: "/photoGallery",
  //     },
  //   ],
  //   hasSubmenu: true,
  // },
  // {
  //   id: 6,
  //   title: "Vote Candidate",
  //   link: "/vote-candidate",
  // },
  // {
  //   id: 7,
  //   title: "Upcoming Events",
  //   link: "/upcomingEvents",
  // },




  const [menuOpen, setMenuOpen] = useState(false);



  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    document.body.classList.toggle("ovr-hiddn");
  };


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login")
    window.location.reload()
  };


  const fetchEventData = async () => {
    try {
      const data = await getEvents();
      if (JSON.stringify(data) !== JSON.stringify(eventData)) {
        setEventData(data || []);
      }
    } catch (error) {
      console.error(error);
      // toast.error("Failed to fetch events.");
    }
  };

  const isExternalLink = (url: string) =>
    url.startsWith("http://") || url.startsWith("https://");

  useEffect(() => {
    return () => {
      document.body.classList.remove("ovr-hiddn");
      document.body.classList.remove("overflw");
    };
  }, []);

  useEffect(() => {
    fetchEventData();
  }, []);

  return (
    <div className="headers-wrapper">
      <div className="header-wrapper">
        <div className="container-fluid">
          <div
            className={`menu-Bar ${menuOpen ? "open" : ""}`}
            onClick={toggleMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="row d-flex align-items-center">
            <div className="col-lg-2">
              <div className="logo">
                <Link href="/">
                  <Image src={logo} alt="logo" />
                </Link>
              </div>
            </div>
            <div className="col-lg-7">
              <div className={`menu ${menuOpen ? "open" : ""}`} style={{ display: "flex", justifyContent: "center", }}>
                <ul className="menu">
                  {navbardata.map((data) => (
                    <li
                      key={data.id}
                      className={data.hasSubmenu ? "has-submenu" : ""}
                    >
                      <Link href={data.link}>
                        {data.title}
                        {data.hasSubmenu && (
                          <span className="arrow-down">▼</span>
                        )}
                      </Link>
                      {data.submenu && (
                        <ul className="submenu">
                          {data.submenu.map((subitem: any, subindex: number) => (
                            <li key={subindex}>
                              <Link
                                href={subitem.link}
                                target={isExternalLink(subitem.link) ? "_blank" : undefined}
                                rel={isExternalLink(subitem.link) ? "noopener noreferrer" : undefined}
                              >
                                {subitem.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}

                    </li>
                  ))}
                </ul>
                <div className="mobile-view">
                  <div className="accounts-wrap-cart">
                    <div className="accounts-wrap">
                      {local_token === null ? (
                        <div>
                          <i className="fa fa-user user-icon"></i>
                          <Link href="/login">Login</Link>
                        </div>
                      ) : (
                        <>

                          <div
                            className="wishlist-wrap"
                            style={{ textAlign: "left", marginLeft: "10px" }}
                          >
                            <Link href="/dashboard">
                              <p className="mb-0">
                                <i
                                  className="fa fa-tachometer"
                                  aria-hidden="true"
                                  style={{ marginRight: "10px" }}
                                ></i>
                                Dashboard
                              </p>
                            </Link>
                          </div>
                          <div></div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3">

              {local_token === null ? (
                <div className={`menu`}>
                  <ul className="menu">
                    <li className="btn-li">
                      <Link href="/login">Sign In</Link>
                    </li>
                    <li className="btn-li">
                      <Link href="/register">Sign Up</Link>
                    </li>
                  </ul>
                </div>
              ) : (<div className={`menu`}>
                <ul className="menu">

                  {
                    user.role === "home owner" || user.role === "home member" ? (
                      <>

                        <li className="btn-li">
                          <Link href="/profile"><Person /></Link>
                        </li>

                        <li className="btn-li" onClick={() => handleLogout()}>
                          <Link href="">Sign Out</Link>
                        </li>
                      </>
                    ) : (
                      <>

                        <li className="btn-li">
                          <Link href="/login">Dashboard</Link>
                        </li>

                        <li className="btn-li" onClick={() => handleLogout()}>
                          <Link href="">Sign Out</Link>
                        </li>
                      </>
                    )
                  }

                </ul>
              </div>)}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
