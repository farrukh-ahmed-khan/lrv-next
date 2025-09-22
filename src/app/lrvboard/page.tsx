"use client"
import { useEffect, useState } from "react";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Navbar";
import InnerBanner from "@/components/ui/InnerBanner";
import Image from "next/image";
import { getDirectors } from "@/lib/DirectorsApi/api";



interface DirectorType {
  _id: string;
  directorname: string;
  designation: string;
  description?: string;
  image?: string;
}

const LrvBoard = () => {
  const [directorData, setDirectorData] = useState<DirectorType[]>([]);

  const fetchDirectorData = async () => {
    try {
      const data = await getDirectors();
      if (Array.isArray(data)) {
        setDirectorData(data);
      } else if (data?.directors && Array.isArray(data.directors)) {
        setDirectorData(data.directors);
      } else {
        setDirectorData([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDirectorData();
  }, []);


  return (
    <>
      <div>
        <Header />

        <>
          <InnerBanner title="LRV Board of Directors" />
        </>

        <section className="board-director">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                {/* <div className="heading-wrap">
                  <h4>our lrv board of directors</h4>
                </div> */}
              </div>
            </div>
            <div className="row d-flex justify-content-center">
              {directorData.map((member, index) => (
                <div className="col-lg-3" key={member._id || index}>
                  <div className="director-card">
                    <div className="img-wrap">
                      <Image
                        src={member.image || "/images/person-icon.png"} // fallback image
                        alt={member.directorname || "director"}
                        width={200}
                        height={200}
                      />
                    </div>
                    <div className="content-wrap">
                      <h4>{member.directorname}</h4>
                      <p>{member.designation}</p>
                      {member?.description ? (
                        <p>{member.description}</p>
                      ) : (
                        <p></p> 
                      )}
                    </div>
                  </div>
                </div>
              ))}

            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default LrvBoard;
