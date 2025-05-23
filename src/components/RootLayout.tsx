"use client"; // Mark this as a client component
import Head from "next/head";
import Script from "next/script";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/main.scss";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import Loader from "@/components/ui/Loader";
import "aos/dist/aos.css";
import { Toaster } from "react-hot-toast";
import { Providers } from "@/app/providers";
import DueBanner from "./ui/DueBanner";
import Link from "next/link";

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
        {/* &intent=subscription */}
        <Script
          src="https://www.paypal.com/sdk/js?client-id=AQ9bqBZ_lXaFs7pwoLAwK_UqbavGVomOhAZtrQAY1YrMILVEbJn-MnD2L1y7Y3SHsoxjjg-PP2GHfIp4&components=buttons&vault=true"
          strategy="beforeInteractive"
        />
        {loading ? (
          <Loader />
        ) : (
          <>
            <Toaster position="top-right" reverseOrder={false} />

            <AnimateOnScroll />
            {/* <Navbar /> */}
            <Providers>
              <DueBanner />
              <main>{children}</main>
            </Providers>
            {/* <section className="care-wrap">
              <Footer />
            </section> */}
          </>
        )}
      </body>
    </html>
  );
}
