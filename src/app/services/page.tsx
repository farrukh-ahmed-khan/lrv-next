
import Header from "@/components/layout/Navbar";
import aboutUsImg from "../../assets/images/aboutImg.png";
import HomeBanner from "@/components/ui/HomeBanner";
import AboutUs from "@/components/ui/AboutUs";
import Footer from "@/components/layout/Footer";

const Services = () => {
  return (
    <>
      <div className="home-wrapper">
        <Header />
        <section className="homeBanner-wrapper">
          <HomeBanner
            title="Services"
           
          />
        </section>
        <>
          <AboutUs
            title="DIRECTORY"
            paragraphs={[
              "Our LRV Phone Directory is your connection to your LRV neighbors. This Phone Directory is private and used exclusively and strictly for neighborly concerns and causes. Here’s a link to the most current LRV Phone Directory:",
            ]}
            button={{ label: "Read More", link: "#" }}
            image={aboutUsImg}
          />
        </>

        <Footer />
      </div>
    </>
  );
};

export default Services;
