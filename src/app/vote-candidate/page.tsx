
import Header from "@/components/layout/Navbar";
import HomeBanner from "@/components/ui/HomeBanner";
import Footer from "@/components/layout/Footer";
import NomineeVote from "@/components/ui/dashboard/VotingNominees";

const Vote = () => {
    return (
        <>
            <div className="home-wrapper">
                <Header />
                <section className="homeBanner-wrapper">
                    <HomeBanner
                        title="Vote Candidate"

                    />
                </section>
                <>
                    <NomineeVote />
                </>

                <Footer />
            </div>
        </>
    );
};

export default Vote;
