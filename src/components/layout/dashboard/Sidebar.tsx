"use client"
import { useState, useEffect } from "react";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";

import {
    AddCard,
    ContactEmergency,
    Email,
    Event,
    MeetingRoom,
    Person,
    Receipt,
    ResetTvSharp,
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

    const userData = JSON.parse(localStorage.getItem("user") || "{}")

    const [role, setRole] = useState(
        userData.role
    );

    // const role = localStorage.getItem("role");
    const router = useRouter();


    const handleLogout = () => {
        router.push("/login")
        window.location.reload()
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    if (role == "board member") {
        const nav = [
            {
                title: "Dashboard ",
                icon: <HomeOutlinedIcon />,
                link: "/dashboard/boardmember",
            },
            {
                title: "Home Owners/ Board Members",
                icon: <Person />,
                link: "/dashboard/boardmember/homeAdmins",
            },
            {
                title: "Home Members",
                icon: <Person />,
                link: "/dashboard/boardmember/homeMembers",
            },
            {
                title: "Board Member",
                icon: <Person />,
                link: "/dashboard/boardmember/createBoardMember",
            },
            {
                title: "Board Member Bio",
                icon: <Person />,
                link: "/dashboard/boardmember/boardOfdirector",
            },
            {
                title: "Add Lrv Photo Gallery",
                icon: <Person />,
                link: "/dashboard/boardmember/lrvPhotoGallery",
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
                title: "Checked Dues",
                icon: <Receipt />,
                link: "/dashboard/boardmember/checkedDues",
            },
            {
                title: "Contact Forms",
                icon: <ContactEmergency />,
                link: "/dashboard/boardmember/contactForms",
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
                title: "LRV Bylaw",
                icon: <VerifiedUserRounded />,
                link: "/dashboard/boardmember/lrvhoa-law",
            },
            {
                title: "Add Events",
                icon: <AddCard />,
                link: "/dashboard/boardmember/addEvent",
            },
            {
                title: "Upcoming Events",
                icon: <Event />,
                link: "/dashboard/boardmember/upcomingEvents",
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
            {
                title: "Add Nominee",
                icon: <Person />,
                link: "/dashboard/boardmember/nominees",
            },
            {
                title: "Voting Result",
                icon: <ResetTvSharp />,
                link: "/dashboard/boardmember/votingResult",
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
