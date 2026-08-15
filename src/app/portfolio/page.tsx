import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import SectionMarker from "@/components/SectionMarker";
import PortfolioList from "@/components/sections/PortfolioList";
import CTA from "@/components/sections/CTA";
import { PORTFOLIO_HEADER } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Portfólio",
  description: "O que a gente já construiu: sites, sistemas e ferramentas.",
  alternates: {
    canonical: "/portfolio",
  },
};

export default function PortfolioPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24">
        <section id="portfolio" className="section">
          <div className="wrap">
            <Reveal>
              <SectionMarker
                label={PORTFOLIO_HEADER.marcador}
                number={PORTFOLIO_HEADER.num}
              />
            </Reveal>
            <Reveal delay={80}>
              <h1 className="max-w-3xl text-[clamp(32px,4.2vw,52px)]">
                {PORTFOLIO_HEADER.titulo}
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="prose-measure mt-6 text-[18px] text-black/70">
                {PORTFOLIO_HEADER.subtitulo}
              </p>
            </Reveal>

            <PortfolioList />
          </div>
        </section>
        <CTA />
      </main>
      <Footer />
    </>
  );
}
