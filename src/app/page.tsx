import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import IntroOverlayLoader from "@/components/IntroOverlayLoader";
import TechMarquee from "@/components/TechMarquee";
import Problem from "@/components/sections/Problem";
import Ecosystem from "@/components/sections/Ecosystem";
import WhatWeDo from "@/components/sections/WhatWeDo";
import HowItWorks from "@/components/sections/HowItWorks";
import Membership from "@/components/sections/Membership";
import CostOfInaction from "@/components/sections/CostOfInaction";
import Portfolio from "@/components/sections/Portfolio";
import ForYouToo from "@/components/sections/ForYouToo";
import Founders from "@/components/sections/Founders";
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
        <Ecosystem />
        <TechMarquee />
        <WhatWeDo />
        <HowItWorks />
        <Membership />
        <CostOfInaction />
        <Portfolio />
        <ForYouToo />
        <Founders />
        <WhyNada />
        <Trust />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
