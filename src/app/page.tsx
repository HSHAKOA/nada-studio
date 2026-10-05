import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import IntroOverlay from "@/components/IntroOverlay";
import WhatsAppFixo from "@/components/WhatsAppFixo";
import Symptoms from "@/components/sections/Symptoms";
import BeforeAfter from "@/components/sections/BeforeAfter";
import PortfolioTeaser from "@/components/sections/PortfolioTeaser";
import WhatWeDo from "@/components/sections/WhatWeDo";
import Pricing from "@/components/sections/Pricing";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/Footer";
import { HERO_LOCAL } from "@/data/content";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

// Ordem: impacto → identificação → transformação/prova → portfólio →
// serviços → decisão → fechamento. O primeiro trabalho real aparece logo
// depois do Antes/Depois.
export default function Home() {
  return (
    <>
      <IntroOverlay />
      <Navbar />
      <main>
        <Hero local={HERO_LOCAL} />
        <Symptoms />
        <BeforeAfter />
        <PortfolioTeaser />
        <WhatWeDo />
        <Pricing />
        <CTA />
      </main>
      <Footer />
      <WhatsAppFixo mensagem="Oi! Vi o site da NADA Studio e quero conversar." />
    </>
  );
}
