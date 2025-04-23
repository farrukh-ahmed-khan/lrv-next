"use client";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Navbar";
import ProtectedPage from "@/components/ProtectedPage";
import InnerBanner from "@/components/ui/InnerBanner";
import { useEffect, useState } from "react";
import axios from "axios";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import Image from "next/image";
import pdfIcon from "@/assets/images/pdf-icon.webp"

const LrvLaws = () => {
    const [lrvLaws, setLrvLaws] = useState<any[]>([]);

    useEffect(() => {
        const fetchLaws = async () => {
            try {
                const res = await axios.get("/api/lrvLaw/getAll");

                const grouped = res.data.lrvlaw
                setLrvLaws(grouped);
            } catch (err) {
                console.error("Failed to fetch newsletters", err);
            }
        };

        fetchLaws();
    }, []);





    return (
        <ProtectedPage allowedRoles={["home owner", "home member", "board member", "admin"]}>
            <div className="law-wrapper">
                <Header />
                <InnerBanner title="LRVHOA By-Laws" />
                <div className="container mb-5">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="law-content">
                                <div className="heading">
                                    <h4>
                                        LRVHOA By-Laws Revision Project
                                    </h4>
                                </div>
                                <div className="content">
                                    <p>
                                        When the Los Ranchos Verdes Homeowners Association was incorporated 45 years ago on May 15, 1973, it was formed as a non-profit California corporation to manage a ‘common interest development’. In addition to the Articles of Incorporation, the Association’s homeowners created and ratified the Association’s By-Laws, dated November 6, 1972.
                                    </p>
                                    <p>
                                        Upon a recent review of LRV’s By-Laws by your Board, it was evident they needed revision to more accurately reflect how LRV operates today, compared to 1972.
                                    </p>
                                    <p>
                                        Summary of changes between Amendment #1 (2018) and Amendment #2 (2023)
                                    </p>
                                    <ul>
                                        <li>Article 2: Section 4 (A) DUES. Revised Dues to be payable in month of January and no later than January 31.</li>
                                        <li>Article 2: Section 5 FISCAL YEAR. Revise FY to January 1 – December 31 from November 1 – October 31.</li>
                                        <li>Article 2 Section 14 NEIGHBORHOOD WATCH: Revised to reflect a single Neighborhood Watch Captain and elimination of Watch Zones and Zone Leads.</li>
                                    </ul>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="row">
                        {
                            lrvLaws.map((pdf, index) => {
                                const fileName = pdf.fileUrl.split("/").pop(); 
                                return (
                                    <div className="col-lg-4" key={index}>
                                        <div className="pdfs-wrap" style={{ textAlign: "center" }}>
                                            <div className="title">{pdf.title}</div>
                                            <div className="pdf-wrap" >
                                                <a href={pdf.fileUrl} target="_blank">
                                                    <Image src={pdfIcon} alt="PDF Icon" />
                                                </a>
                                                <div className="pdf-name" style={{ marginTop: "8px", wordBreak: "break-word", fontSize: "14px" }}>
                                                    {fileName}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        }

                    </div>
                </div>
                <Footer />
            </div>
        </ProtectedPage>
    );
};

export default LrvLaws;
