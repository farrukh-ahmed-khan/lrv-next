import Image, { StaticImageData } from "next/image";
import Link from "next/link";


interface Button {
    label: string;
    link: string;
}

interface AboutUsProps {
    title?: string;
    subtitle?: string;
    paragraphs?: string[];
    button?: Button;
    image?: string | StaticImageData;
}

const AboutUs: React.FC<AboutUsProps>  = ({ title, paragraphs = [], button, image }) => {
    return (
        <section className="aboutUs-wrapper">
            <div className="container">
                <div className="row">
                    <div className="col-lg-6">
                        <div className="content-wrap">
                            {title && <h4>{title}</h4>}
                            {paragraphs.map((text, index) => (
                                <p key={index}>{text}</p>
                            ))}
                            {button && (
                                <div className="btn-wrap">
                                    <Link href={button.link} className="btns-style">
                                        {button.label}
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="img-wrap">
                            {image && <Image src={image} alt="About Us" />}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutUs;
