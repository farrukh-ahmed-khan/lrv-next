"use client"
import { useState, useEffect } from "react";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";

import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

import PersonIcon from "@mui/icons-material/Person";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";

import {
    AddCard,
    Email,
    MeetingRoom,
    Person,
    Receipt,
    VerifiedUserRounded,
} from "@mui/icons-material";
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';


interface SidebarProps {
    isNavClosed: boolean;
}


const Sidebar: React.FC<SidebarProps> = ({ isNavClosed }) => {
    const pathname = usePathname();
    const [activeLink, setActiveLink] = useState(pathname);

    useEffect(() => {
        setActiveLink(pathname);
    }, [pathname]);

    const handleLinkClick = (link: any) => {
        setActiveLink(link);
    };

    const userData = JSON.parse(sessionStorage.getItem("user") || "{}")

    const [role, setRole] = useState(
        userData.role
    );

    // const role = localStorage.getItem("role");
    const router = useRouter();


    const handleLogout = () => {
        router.push("/login")
        window.location.reload()
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
    };

    if (role == "board member") {
        const nav = [
            {
                title: "Dashboard",
                icon: <HomeOutlinedIcon />,
                link: "/dashboard/boardmember",
            },
            {
                title: "Home Owners",
                icon: <Person />,
                link: "/dashboard/boardmember/homeAdmins",
            },
            {
                title: "Your Dues",
                icon: <Receipt />,
                link: "/dashboard/boardmember/ownerDues",
            },
            {
                title: "Dues",
                icon: <Receipt />,
                link: "/dashboard/boardmember/allDues",
            },
            {
                title: "Home Members",
                icon: <Person />,
                link: "/dashboard/boardmember/homeMembers",
            },

            {
                title: "Newsletter",
                icon: <LocalAtmIcon />,
                link: "/dashboard/boardmember/newsletter",
            },
            {
                title: "Meeting",
                icon: <MeetingRoom />,
                link: "/dashboard/boardmember/meeting",
            },
            {
                title: "Lrv Law",
                icon: <VerifiedUserRounded />,
                link: "/dashboard/boardmember/lrvhoa-law",
            },
            {
                title: "Add Events",
                icon: <AddCard />,
                link: "/dashboard/boardmember/addEvent",
            },
            {
                title: "Send Email",
                icon: <Email />,
                link: "/dashboard/boardmember/sendMail",
            },
            {
                title: "My Profile",
                icon: <Person />,
                link: "/dashboard/boardmember/myProfile",
            },
        ];
        return (
            <div className={`sidebar ${isNavClosed ? "nav-closed" : ""}`}>
                <ul>
                    {nav.map((item) => (
                        <li
                            key={item.link}
                            className={item.link === activeLink ? "active" : ""}
                        >
                            <Link href={item.link} onClick={() => handleLinkClick(item.link)}>
                                <span>{item.icon}</span>
                                <span>{item.title}</span>
                            </Link>
                        </li>
                    ))}
                    <li>
                        <Link href="" onClick={() => handleLogout()}>
                            <span>
                                <LogoutOutlinedIcon />
                            </span>
                            <span>Logout</span>
                        </Link>
                    </li>

                    <li>
                        <Link href="/">
                            <span>
                                <LogoutOutlinedIcon />
                            </span>
                            <span>Back To Home</span>
                        </Link>
                    </li>
                </ul>
            </div>
        );
    } else if (role == "home owner") {
        const nav = [

            {
                title: "Dashboard",
                icon: <HomeOutlinedIcon />,
                link: "/dashboard/homeowner/members",
            },
            {
                title: "My Profile",
                icon: <Person />,
                link: "/dashboard/homeowner/myProfile",
            },
            {
                title: "Your Dues",
                icon: <Receipt />,
                link: "/dashboard/homeowner/ownerDues",
            },
        ];
        return (
            <div className={`sidebar ${isNavClosed ? "nav-closed" : ""}`}>
                <ul>
                    {nav.map((item) => (
                        <li
                            key={item.link}
                            className={item.link === activeLink ? "active" : ""}
                        >
                            <Link href={item.link} onClick={() => handleLinkClick(item.link)}>
                                <span>{item.icon}</span>
                                <span>{item.title}</span>
                            </Link>
                        </li>
                    ))}
                    <li>
                        <Link href="" onClick={() => handleLogout()}>
                            <span>
                                <LogoutOutlinedIcon />
                            </span>
                            <span>Logout</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/">
                            <span>
                                <LogoutOutlinedIcon />
                            </span>
                            <span>Back To Home</span>
                        </Link>
                    </li>
                </ul>
            </div>
        );
    } else if (role == "home member") {
        const nav = [
            {
                title: "Dashboard",
                icon: <HomeOutlinedIcon />,
                link: "/dashboard/homemember/",
            },
            {
                title: "My Profile",
                icon: <Person />,
                link: "/dashboard/homemember/myProfile",
            },
            {
                title: "Your Dues",
                icon: <Receipt />,
                link: "/dashboard/homemember/ownerDues",
            },
        ];
        return (
            <div className={`sidebar ${isNavClosed ? "nav-closed" : ""}`}>
                <ul>
                    {nav.map((item) => (
                        <li
                            key={item.link}
                            className={item.link === activeLink ? "active" : ""}
                        >
                            <Link href={item.link} onClick={() => handleLinkClick(item.link)}>
                                <span>{item.icon}</span>
                                <span>{item.title}</span>
                            </Link>
                        </li>
                    ))}
                    <li>
                        <Link href="" onClick={() => handleLogout()}>
                            <span>
                                <LogoutOutlinedIcon />
                            </span>
                            <span>Logout</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/">
                            <span>
                                <LogoutOutlinedIcon />
                            </span>
                            <span>Back To Home</span>
                        </Link>
                    </li>
                </ul>
            </div>
        );
    }
};

export default Sidebar;
