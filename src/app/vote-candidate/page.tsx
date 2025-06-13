
import Header from "@/components/layout/Navbar";
import HomeBanner from "@/components/ui/HomeBanner";
import Footer from "@/components/layout/Footer";
import NomineeVote from "@/components/ui/dashboard/VotingNominees";
import ProtectedPage from "@/components/ProtectedPage";

const Vote = () => {
    return (
        <>
            <ProtectedPage allowedRoles={["home owner", "home member", "board member", "admin"]}>
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
            </ProtectedPage>
        </>
    );
};

export default Vote;
