import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import IntroOverlayLoader from "@/components/IntroOverlayLoader";
import Marquee from "@/components/Marquee";
import Problem from "@/components/sections/Problem";
import WhatWeDo from "@/components/sections/WhatWeDo";
import HowItWorks from "@/components/sections/HowItWorks";
import Membership from "@/components/sections/Membership";
import ForYouToo from "@/components/sections/ForYouToo";
import WhyNada from "@/components/sections/WhyNada";
import Trust from "@/components/sections/Trust";
import FAQ from "@/components/sections/FAQ";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <IntroOverlayLoader />
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <WhatWeDo />
        <Marquee />
        <HowItWorks />
        <Membership />
        <ForYouToo />
        <WhyNada />
        <Trust />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
