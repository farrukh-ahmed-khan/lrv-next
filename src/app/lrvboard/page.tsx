
import director1 from "@/assets/images/directors/director1.png";
import director2 from "@/assets/images/directors/director2.png";
import director3 from "@/assets/images/directors/director3.png";
import director4 from "@/assets/images/directors/director4.png";
import director5 from "@/assets/images/directors/director5.png";
import director6 from "@/assets/images/directors/director6.png";
import director7 from "@/assets/images/directors/director7.png";
import director8 from "@/assets/images/directors/director8.jpg";
import personIcon from "../../../public/images/person-icon.png"
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Navbar";
import InnerBanner from "@/components/ui/InnerBanner";


import Image from "next/image";

const director = [
  {
    id: 1,
    name: "Steve Moe",
    designation: "President",
    image: personIcon,
  },
  {
    id: 2,
    name: "Jeff Romanelli",
    designation: "Vice President",
    para: "54 Upper Silver Saddle Lane 310-375-9093 Spouse - Amy LRV homeowner since 2004 Retired Boeing Engineer Community Services for RHE",

    image: director2,
  },
  {
    id: 3,
    name: "Tom Wynne",
    designation: "Secretary",
    para: "12 Palos Verdes Lane 310-373-5522 Spouse - Kathy LRV homeowner since 1993 Construction Management/Consulting Parishioners Federal Credit Union Board Mary & Joseph Retreat Center Board",
    image: director3,
  },
  {
    id: 4,
    name: "Praveen Gattu",
    designation: "Treasurer",
    para: "58 Silver Saddle Lane 303-880-7455 Spouse - Aga LRV homeowner since 2015 Management Consultant",
    image: director4,
  },
  // {
  //   id: 5,
  //   name: "Neil Chhabria",
  //   designation: "Director",
  //   para: "23 Santa Bella Road 310-902-7227 Spouse - Sanam LRV homeowner since 2021 Real Estate Broke",

  //   image: director5,
  // },
  {
    id: 6,
    name: "Dave Luzan",
    designation: "Director",
    para: "34 Silver Saddle Lane 310-245-8590 Partner - Louise LRV homeowner since 1986 Retired Mechanical Engineer & Business Owner",
    image: director6,
  },
  {
    id: 7,
    name: "Meg Puccinelli",
    designation: "Director",
    para: "36 Silver Saddle Lane 310-351-4999 Spouse - Brian LRV Homeowner - 23 years Retired Del Taco Food Scientist Realtor & Office Manager",
    image: director7,
  },
  {
    id: 8,
    name: "Keith",
    designation: "Director",
    para: "Spouse - Lisa - LRV Homeowner - since 2018 - Business owner - Real Estate",
    image: director8,
  },
];

const LrvBoard = () => {
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
              {director.map((member, index) => (
                <div className="col-lg-3">
                  <div className="director-card">
                    <div className="img-wrap">
                      <Image src={member.image} alt="" />
                    </div>
                    <div className="content-wrap">
                      <h4>{member.name}</h4>
                      <p>{member.designation}</p>
                      {member.para ? (
                        <>
                          <p>{member.para}</p>
                        </>
                      ) : (
                        <></>
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
