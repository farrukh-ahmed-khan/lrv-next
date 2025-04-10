"use client"
import React, { useState, useEffect } from "react";
import logo from "@/assets/images/logo.png"
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Header = () => {
  const local_token = sessionStorage.getItem("token");
  const router = useRouter();
  const navbardata = [
    {
      id: 1,
      title: "Home",
      link: "/",
    },
    {
      id: 2,
      title: "Services",
      link: "/services",
      submenu: [
        {
          title: "NewsLetter",
          link: "/newsletter",
        },
        {
          title: "Directory",
          link: "/phonedirectory",
        },
        {
          title: "Dues",
          link: "https://frank-ojo-wp.devdesignbuild.com/grants/",
        },
      ],
      hasSubmenu: true,
    },
    {
      id: 3,
      title: "LRV Board",
      link: "/lrvboard",
      submenu: [
        {
          title: "Board Of Directors",
          link: "https://frank-ojo-wp.devdesignbuild.com/foundation-donor/",
        },
        {
          title: "LRV Board Meetings",
          link: "https://frank-ojo-wp.devdesignbuild.com/foundation-grants/",
        },
        {
          title: "LRVHOA By laws",
          link: "https://frank-ojo-wp.devdesignbuild.com/grants/",
        },
      ],
      hasSubmenu: true,
    },

    {
      id: 4,
      title: "Community",
      link: "/community",
      submenu: [
        {
          title: "Neighborhood Watch",
          link: "https://frank-ojo-wp.devdesignbuild.com/foundation-donor/",
        },
        {
          title: "City of Rulling Hills Estate",
          link: "https://frank-ojo-wp.devdesignbuild.com/foundation-grants/",
        },
        {
          title: "Nextdoor LRV Group",
          link: "https://frank-ojo-wp.devdesignbuild.com/grants/",
        },
        {
          title: "Nextdoor LRV Group",
          link: "https://frank-ojo-wp.devdesignbuild.com/grants/",
        },
        {
          title: "Christmas Party",
          link: "https://frank-ojo-wp.devdesignbuild.com/grants/",
        },
        {
          title: "Halloween Party",
          link: "https://frank-ojo-wp.devdesignbuild.com/grants/",
        },
        {
          title: "Car Show",
          link: "https://frank-ojo-wp.devdesignbuild.com/grants/",
        },
      ],
      hasSubmenu: true,
    },
    {
      id: 5,
      title: "About LRV",
      link: "/about",
      submenu: [
        {
          title: "Contact LRV",
          link: "https://frank-ojo-wp.devdesignbuild.com/foundation-donor/",
        },
        {
          title: "LRV streets Portfolio",
          link: "https://frank-ojo-wp.devdesignbuild.com/foundation-grants/",
        },
        {
          title: "LRVHOA.NET SECURITY",
          link: "https://frank-ojo-wp.devdesignbuild.com/grants/",
        },
        {
          title: "New Neighbor Welcome Flyer",
          link: "https://frank-ojo-wp.devdesignbuild.com/grants/",
        },
        {
          title: "LRV PHOTO GALLERY",
          link: "https://frank-ojo-wp.devdesignbuild.com/grants/",
        },
      ],
      hasSubmenu: true,
    },
  ];


  //   const toggleDrawer = (open) => () => {
  //     setDrawerOpen(open);
  //   };

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    document.body.classList.toggle("ovr-hiddn");
  };
  //   const toggleCollapse = () => {
  //     setCollapsed(!collapsed);
  //   };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    router.push("/login")
  };

  useEffect(() => {
    return () => {
      document.body.classList.remove("ovr-hiddn");
      document.body.classList.remove("overflw");
    };
  }, []);

  return (
    <div className="headers-wrapper">
      <div className="header-wrapper">
        <div className="container">
          <div
            className={`menu-Bar ${menuOpen ? "open" : ""}`}
            onClick={toggleMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="row d-flex align-items-center">
            <div className="col-lg-3">
              <div className="logo">
                <Link href="/">
                  <Image src={logo} alt="logo" />
                </Link>
              </div>
            </div>
            <div className="col-lg-6">
              <div className={`menu ${menuOpen ? "open" : ""}`}>
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
                          {data.submenu.map((subitem, subindex) => (
                            <li key={subindex}>
                              <Link href={subitem.link}>{subitem.title}</Link>
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
                      {/* <div>
                        <i className="fa fa-user user-icon"></i>
                        <Link to="/login">Login</Link>
                      </div>
                      <div>
                        <Link to="/register">Register</Link>
                      </div> */}
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
                  <li className="btn-li">
                    <Link href="/login">Dashboard</Link>
                  </li>
                  <li className="btn-li" onClick={() => handleLogout()}>
                    <Link href="">Sign Out</Link>
                  </li>
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
