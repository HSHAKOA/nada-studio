import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import IntroOverlay from "@/components/IntroOverlay";
import Symptoms from "@/components/sections/Symptoms";
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
      <IntroOverlay />
      <Navbar />
      <main>
        <Hero />
        <Symptoms />
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
