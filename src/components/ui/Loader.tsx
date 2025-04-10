"use client"; 
import Image from "next/image";
import loaderImg from "@/assets/images/loader-img.png";

const Loader = () => {
    return (
        <div className="loader">
            <Image src={loaderImg} alt="Loading..." />
        </div>
    );
};

export default Loader;
