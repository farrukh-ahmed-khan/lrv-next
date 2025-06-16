"use client"

import { useEffect, useState } from "react";
import { Card, Button, Spin, message } from "antd";
import axios from "axios";
import { getAllNominee } from "@/lib/VotingApi/api";
import { FaUser } from "react-icons/fa";

const NomineeVote = () => {
    const [nominees, setNominees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [voted, setVoted] = useState(false);

    const token = sessionStorage.getItem("token");

    const fetchNominees = async () => {
        if (!token) {
            console.error("No token found.");
            return;
        }
        setLoading(true);
        try {
            const data = await getAllNominee(token);
            setNominees(data.nominees || []);
        } catch (err: any) {
            message.error("Failed to load nominees");
        } finally {
            setLoading(false);
        }
    };

    const handleVote = async (nomineeId: string) => {
        try {
            await axios.post(
                "/api/voting/voteCandidate",
                { nomineeId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            message.success("Vote submitted successfully!");
            setVoted(true);
        } catch (err: any) {
            message.error(err?.response?.data?.message || "Vote failed");
        }
    };

    useEffect(() => {
        fetchNominees();
    }, []);

    return (
        <section className="votenominees-wrap">
            <div className="container">
                <div>
                    {loading ? (
                        <div className="loader-wrap" style={{ display: "flex", justifyContent: "center", height: "50vh" }}>
                            <Spin />
                        </div>
                    ) : (
                        <div className="row">
                            {nominees.map((nominee: any, index) => (
                                <div className="col-lg-4 my-4" key={index}>
                                    <Card
                                        title={
                                            <span>
                                                <FaUser style={{ marginRight: 8 }} />
                                                {`${nominee.firstname} ${nominee.lastname}`}
                                            </span>
                                        }
                                    >
                                        <p><b>Email:</b> {nominee.email}</p>
                                        <p><b>Role:</b> {nominee.role}</p>
                                        <p><b>Address:</b> {nominee.streetAddress}</p>
                                        <Button
                                            type="dashed"
                                            disabled={voted}
                                            onClick={() => handleVote(nominee._id)}
                                        >
                                            {voted ? "Already Voted" : "Vote for this candidate"}
                                        </Button>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default NomineeVote;
