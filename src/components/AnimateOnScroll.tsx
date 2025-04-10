"use client"; // ✅ AOS must be used in a Client Component

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function AnimateOnScroll() {
    useEffect(() => {
        AOS.init({
            duration: 1000, 
            once: true, 
        });
    }, []);

    return null; 
}
