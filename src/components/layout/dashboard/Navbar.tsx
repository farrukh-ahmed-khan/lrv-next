"use client"
import React, { useState } from "react";
import person from "../../../assets/images/logo.png";
import Image from "next/image";



interface Navbar {
    toggleNav: () => void;
}

const Navbar: React.FC<Navbar> = ({ toggleNav }) => {
    const [profile, setProfile] = useState(null);
    return (
        <>
            <div className="header">
                <div className="header-logo">
                    <Image src={person} alt="" />
                </div>
                <div className="header-search">
                    <button className="button-menu" onClick={toggleNav}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 385 385">
                            <path d="M12 120.3h361a12 12 0 000-24H12a12 12 0 000 24zM373 180.5H12a12 12 0 000 24h361a12 12 0 000-24zM373 264.7H132.2a12 12 0 000 24H373a12 12 0 000-24z" />
                        </svg>
                    </button>

                    <div className="avatar d-flex justify-content-center align-items-center">
                        {/* <SearchIcon className="me-2" /> */}
                        {/* <NotificationsNoneIcon className="me-4" /> */}
                        <div className="d-flex flex-column gap-0 justify-content-center align-items-end me-2 text-right">
                            <h6>
                                <b> {profile}</b>
                            </h6>
                            {/* <p>
                {profile?.role === "employee"
                  ? "Store Employee"
                  : profile?.role === "storeOwner"
                  ? "Store Owner"
                  : profile?.role === "corporateOwner"
                  ? "Corporate Owner"
                  : profile?.role === "storeManager"
                  ? "Store Manager"
                  : profile?.role === "corporateAdmin"
                  ? "Corporate Admin"
                  : profile?.role === "superAdmin"
                  ? "Super Admin"
                  : profile?.role === "customerSupport"
                  ? "Customer Support"
                  : profile?.role === "salesperson"
                  ? "Sales Person"
                  : "Unknown Role"}
              </p> */}
                        </div>
                        {/* <img src={avatarOnline} alt="avatar" /> */}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;
