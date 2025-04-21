"use client";
import "./newsletter.scss";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Navbar";
import ProtectedPage from "@/components/ProtectedPage";
import InnerBanner from "@/components/ui/InnerBanner";
import { useEffect, useState } from "react";
import axios from "axios";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const NewsLetter = () => {
  const [newslettersByYear, setNewslettersByYear] = useState<{ [year: string]: any[] }>({});
  const [openFolders, setOpenFolders] = useState<{ [year: string]: boolean }>({});
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [selectedPdfs, setSelectedPdfs] = useState<{ [id: string]: any }>({});

  useEffect(() => {
    const fetchNewsletters = async () => {
      try {
        const res = await axios.get("/api/newsletter/getAll");
        const grouped: { [year: string]: any[] } = {};

        res.data.newsletters.forEach((newsletter: any) => {
          const year = new Date(newsletter.createdAt).getFullYear();
          if (!grouped[year]) grouped[year] = [];
          grouped[year].push(newsletter);
        });

        setNewslettersByYear(grouped);
      } catch (err) {
        console.error("Failed to fetch newsletters", err);
      }
    };

    fetchNewsletters();
  }, []);

  const toggleFolder = (year: string) => {
    setOpenFolders(prev => ({ ...prev, [year]: !prev[year] }));
  };

  const handleYearSelect = (year: string, checked: boolean) => {
    setSelectedYears(prev => checked ? [...prev, year] : prev.filter(y => y !== year));

    if (checked) {
      const allPdfs = newslettersByYear[year].reduce((acc, pdf) => {
        acc[pdf._id] = pdf;
        return acc;
      }, {} as { [id: string]: any });
      setSelectedPdfs(prev => ({ ...prev, ...allPdfs }));
    } else {
      setSelectedPdfs(prev => {
        const updated = { ...prev };
        newslettersByYear[year].forEach(pdf => delete updated[pdf._id]);
        return updated;
      });
    }
  };

  const handlePdfSelect = (pdf: any, checked: boolean) => {
    setSelectedPdfs(prev => {
      const updated = { ...prev };
      if (checked) updated[pdf._id] = pdf;
      else delete updated[pdf._id];
      return updated;
    });
  };

  const downloadSelected = async () => {
    const selectedItems = Object.values(selectedPdfs);
    if (selectedItems.length === 0) return;

    if (selectedItems.length === 1) {
      const file = selectedItems[0];
      const response = await fetch(file.fileUrl);
      const blob = await response.blob();
      saveAs(blob, `${file.title}.pdf`);
    } else {
      const zip = new JSZip();
      for (let file of selectedItems) {
        const response = await fetch(file.fileUrl);
        const blob = await response.blob();
        zip.file(`${file.title}.pdf`, blob);
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, "Newsletters.zip");
    }
  };

  return (
    <ProtectedPage allowedRoles={["home owner", "home member", "board member", "admin"]}>
      <div className="newsletter-wrapper">
        <Header />
        <InnerBanner title="Newsletter" />
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="newsletter-content px-8 py-6">
                {Object.keys(newslettersByYear)
                  .sort((a, b) => Number(b) - Number(a))
                  .map((year) => (
                    <div key={year} className="folder-block">
                      <div className="folder-row" onClick={() => toggleFolder(year)}>
                        <input
                          type="checkbox"
                          onChange={(e) => handleYearSelect(year, e.target.checked)}
                          checked={selectedYears.includes(year)}
                        />
                        <div className="folder-icon" />
                        <span className="folder-name">{year} Folder</span>
                        <span className="folder-date">
                          {new Date(newslettersByYear[year][0]?.createdAt).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>

                      {openFolders[year] && (
                        <div className="newsletter-folder">
                          <div className="newsletter-header">
                            <span className="item-name">Item name</span>
                            <span className="last-updated">Last updated</span>
                          </div>

                          {newslettersByYear[year].map((nl) => (
                            <div className="newsletter-item" key={nl._id}>
                              <div className="left">
                                <input
                                  type="checkbox"
                                  checked={!!selectedPdfs[nl._id]}
                                  onChange={(e) => handlePdfSelect(nl, e.target.checked)}
                                />
                                <div className="pdf-icon">PDF</div>
                                <span className="title">{nl.title}</span>
                              </div>
                              <div className="right">
                                <span className="date">
                                  {new Date(nl.createdAt).toLocaleDateString(undefined, {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                {Object.keys(selectedPdfs).length > 0 && (
                  <div className="download-bar">
                    <button className="btn btn-success" onClick={downloadSelected}>
                      Download {Object.keys(selectedPdfs).length > 1 ? "All as ZIP" : "PDF"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </ProtectedPage>
  );
};

export default NewsLetter;
