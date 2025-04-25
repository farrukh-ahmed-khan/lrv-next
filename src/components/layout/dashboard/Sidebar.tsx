"use client"
import { useState, useEffect } from "react";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";

import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

import PersonIcon from "@mui/icons-material/Person";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";

import {
    MeetingRoom,
    Person,
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
                title: "Home Owners",
                icon: <Person />,
                link: "/dashboard/boardmember/homeAdmins",
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
            }
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
                link: "/single-store/dashboard",
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
