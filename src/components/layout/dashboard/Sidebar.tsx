"use client"
import { useState, useEffect } from "react";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";

import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

import PersonIcon from "@mui/icons-material/Person";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";

import {
    AirplaneTicketSharp,
    CatchingPokemon,
    PrecisionManufacturingOutlined,
    RequestQuote,
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
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
    };

    if (role == "superAdmin") {
        const nav = [
            {
                title: "Dashboard",
                icon: <HomeOutlinedIcon />,
                link: "/dashboard",
            },
            {
                title: "Sales Representative",
                icon: <PersonIcon />,
                link: "/admin/sales-rep",
            },
            {
                title: "Customer Support",
                icon: <PersonIcon />,
                link: "/admin/csr",
            },

            {
                title: "Orders",
                icon: <PersonIcon />,
                link: "/order-list",
            },

            {
                title: "Add Store Or Company",
                icon: <PersonIcon />,
                link: "/add-store-company",
            },

            {
                title: "Subscription Plan",
                icon: <LocalAtmIcon />,
                link: "/subscription-plan",
            },
            {
                title: "Corporate Analytics",
                icon: <VerifiedUserRounded />,
                link: "/admin/corporateanalytics",
            },
            {
                title: "Store Analytics",
                icon: <VerifiedUserRounded />,
                link: "/admin/storeanalytics",
            },
            {
                title: "Tickets",
                icon: <AirplaneTicketSharp />,
                link: "/admin/tickets",
            },
            {
                title: "Profiles",
                icon: <PrecisionManufacturingOutlined />,
                link: "/admin/profiles",
            },
            {
                title: "Offences",
                icon: <CatchingPokemon />,
                link: "/admin/offences",
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
                        <Link href="#" onClick={() => handleLogout()}>
                            <span>
                                <LogoutOutlinedIcon />
                            </span>
                            <span>Logout</span>
                        </Link>
                    </li>
                </ul>
            </div>
        );
    } else if (role == "board member") {
        const nav = [
            {
                title: "Users",
                icon: <VerifiedUserRounded />,
                link: "/dashboard/boardmember/users",
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
