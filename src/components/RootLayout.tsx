"use client"; // Mark this as a client component
import Head from "next/head";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/main.scss";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import Loader from "@/components/ui/Loader";
import "aos/dist/aos.css";
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const timer = setTimeout(() => {
      setLoading(false);
      document.body.style.overflow = "auto";
    }, 1500);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <html lang="en">
      <Head>
        {/* <link rel="icon" href="/favicon.ico" sizes="any" /> */}
        <link rel="icon" type="image/png" sizes="32x32" href="/images/logo.png" />
      </Head>
      <body>
        {loading ? (
          <Loader />
        ) : (
          <>
            <Toaster position="top-right" reverseOrder={false} />

            <AnimateOnScroll />
            {/* <Navbar /> */}
            <main>{children}</main>
            {/* <section className="care-wrap">
              <Footer />
            </section> */}
          </>
        )}
      </body>
    </html>
  );
}
