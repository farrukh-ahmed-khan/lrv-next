
"use client"
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Navbar';
import ProtectedPage from '@/components/ProtectedPage';
import InnerBanner from '@/components/ui/InnerBanner';
import { getMeetings } from '@/lib/MeetingApi/api';
import React, { useEffect, useState } from 'react'

const page = () => {
    const [meetingData, setMeetingData] = useState<any[]>([]);
    const [isNavClosed, setIsNavClosed] = useState(false);
    const token = sessionStorage.getItem("token");

    interface Meeting {
        _id: string;
        description: string;
        title: string;
    }

    const getAllMeetings = async () => {
        try {
            const res = await getMeetings();
            const fetchedData = res.meetings.map((data: Meeting, index: number) => ({
                key: data._id,
                id: data._id,
                title: data.title,
                description: data.description
            }));
            setMeetingData(fetchedData);
        } catch (error) {
            console.error("Fetch Error:", error);
        }
    };



    useEffect(() => {
        getAllMeetings();
    }, []);


    return (
        <ProtectedPage allowedRoles={["home owner", "home member", "board member", "admin"]}>
            <div className="meeting-wrapper">
                <Header />
                <>
                    <InnerBanner title="Board Meetings" />
                </>
                <section className="meeting-content-wrap">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                {
                                    meetingData.map((data: Meeting, index: number) => {
                                        return (
                                            <div className="meeting-content" key={index}>
                                                <h4>
                                                    {data.title}
                                                </h4>
                                                <p>
                                                    {data.description}
                                                </p>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </section>

                <Footer />
            </div>
        </ProtectedPage>
    )
}

export default page
