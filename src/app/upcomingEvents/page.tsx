"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import EventCard from "@/components/ui/EventCard";
import ProtectedPage from "@/components/ProtectedPage";
import Header from "@/components/layout/Navbar";
import InnerBanner from "@/components/ui/InnerBanner";
import Footer from "@/components/layout/Footer";
import { getEvents } from "@/lib/UpcomingEventsApi/api";
import toast from "react-hot-toast";

interface EventType {
    _id: string;
    eventname: string;
    description?: string;
    images?: string[];
}


function EventsList() {
    const [eventData, setEventData] = useState<EventType[]>([]);
    const token = localStorage.getItem("token") || "";

    useEffect(() => {
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

        fetchEventData();
    }, [token]);

    return (
        <ProtectedPage allowedRoles={["home owner", "home member", "board member", "admin"]}>
            <div className="christmas-wrapper">
                <Header />
                <InnerBanner title="Upcoming Events" />
                <div className="container">
                    <div className="events-grid row">
                        {eventData.map((event: any) => (
                            <div className="col-lg-4">
                                <EventCard key={event._id} event={event} token={token} />
                            </div>
                        ))}
                    </div>
                </div>
                <Footer />
            </div>
        </ProtectedPage>
    );
}

export default EventsList;
