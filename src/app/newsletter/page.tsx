import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Navbar";
import InnerBanner from "@/components/ui/InnerBanner";

const NewsLetter = () => {
    return (
        <>
            <div className="newsletter-wrapper">
                <Header />
                <>
                    <InnerBanner
                        title="Newsletter"
                    />
                </>
                <Footer />
            </div>
        </>
    );
};

export default NewsLetter;
