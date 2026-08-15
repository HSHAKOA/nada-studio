import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import IntroOverlayLoader from "@/components/IntroOverlayLoader";
import BeforeAfter from "@/components/sections/BeforeAfter";
import WhatWeDo from "@/components/sections/WhatWeDo";
import PortfolioTeaser from "@/components/sections/PortfolioTeaser";
import Pricing from "@/components/sections/Pricing";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <>
      <IntroOverlayLoader />
      <Navbar />
      <main>
        <Hero />
        <BeforeAfter />
        <WhatWeDo />
        <PortfolioTeaser />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
