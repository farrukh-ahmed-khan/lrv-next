"use client"
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Navbar";
import InnerBanner from "@/components/ui/InnerBanner";



interface Details {
    heading: string;
    description: string;
}
const details: Details[] = [
    {
        heading: "LRV Forum",
        description:
            "The Los Ranchos Verdes Forum is a place for LRV homeowners to post messages and comments, join in a neighborhood discussion, or just plain join in the conversations.",
    },
    {
        heading: "LRV Neighborhood Watch",
        description:
            "The community of Los Ranchos Verdes is made up of six streets. We also sport an active and effective LRV Neighborhood Watch made up of eight Watch 'Zones'. Let's take care of each other and take care of Los Ranchos Verdes!",
    },
    {
        heading: "City of Rolling Hills Estates",
        description:
            "Here you'll find a live connection to the official City of Rolling Hills Estates website.",
    },
    {
        heading: "LRV Annual Halloween Party",
        description:
            "The Los Ranchos Verdes Homeowners Association sponsors, in part, an annual LRV Halloween Party. This children’s and adult event takes place at the intersection of Seacrest Road and Shady Vista Road, and precedes trick-or-treating activities in LRV. There are games, food (pizza), and soft drinks. We also include our adjacent neighbors from Ranchview Road.",
    },
    {
        heading: "LRV Annual Christmas Party",
        description:
            "The Los Ranchos Verdes Homeowners Association sponsors, in part, an Annual LRV Christmas Party in December. All homeowners are invited to attend. Each year, the Christmas Party gathering is hosted by a volunteer homeowner.",
    },
];

const Community: React.FC = () => {
    return (
        <>
            <div>
                <Header />

                <>
                    <InnerBanner title="Community" />
                </>

                <section className="community-detail">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="heading-wrap">
                                    <h4>LRV Community Activities & Resources</h4>
                                </div>
                                <div className="detail-wrap">
                                    <div className="row">
                                        <div className="col-lg-12">
                                            {details.map((detail, index) => (
                                                <div key={index} className="detail-box">
                                                    <h5>{detail.heading}</h5>
                                                    <p>{detail.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <Footer />
            </div>
        </>
    );
};

export default Community;
