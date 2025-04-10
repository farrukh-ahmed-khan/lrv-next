import Link from "next/link";
import bannerImage from "../../assets/images/home/home-banner.png";

interface Button {
    label: string;
    link: string;
}

interface HomeBannerProps {
    title: string;
    subtitle?: string;
    buttons?: Button[];
}

const HomeBanner: React.FC<HomeBannerProps> = ({ title, subtitle, buttons = [] }) => {
    return (
        <div className="homebanner-wrap"
        style={{ backgroundImage: `url(${bannerImage.src})` }}
        >
            <div className="overlay"></div>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="homebanner-content">
                            {subtitle && <h5>{subtitle}</h5>}
                            <h4>{title}</h4>
                            {buttons.length > 0 && (
                                <div className="btns-wrap">
                                    {buttons.map((btn, index) => (
                                        <Link key={index} href={btn.link} className="banner-btn">
                                            {btn.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeBanner;
