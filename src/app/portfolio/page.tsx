import type { Metadata } from "next";
import { metadadosDePagina } from "@/lib/metadados";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionMarker from "@/components/SectionMarker";
import WhatsAppFixo from "@/components/WhatsAppFixo";
import PortfolioList from "@/components/sections/PortfolioList";
import CTA from "@/components/sections/CTA";
import { sectionMarkers } from "@/data/content";
import { PORTFOLIO_HEADER } from "@/data/portfolio";

export const metadata: Metadata = metadadosDePagina({
  titulo: "Portfólio",
  descricao:
    "O que a gente já construiu: sites, sistemas e ferramentas. Em cada projeto, o problema e o que mudou.",
  caminho: "/portfolio",
});

// A primeira capa do celular vai com prioridade direto no <img> (PortfolioList).
// O preload() do react-dom que ficava aqui entrava no payload do prefetch de
// /portfolio, e o celular baixava essa capa em toda página do site.
export default function PortfolioPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24">
        <section id="portfolio" className="section">
          <div className="wrap">
            <SectionMarker label={PORTFOLIO_HEADER.marcador} number={sectionMarkers.portfolioTopo} />
            <h1 data-entra="titulo" className="max-w-3xl text-[clamp(36px,5vw,64px)]">
              {PORTFOLIO_HEADER.titulo}
            </h1>
            <p className="prose-measure mt-6 text-[18px] text-black/70">{PORTFOLIO_HEADER.subtitulo}</p>

            <PortfolioList />
          </div>
        </section>
        <CTA numero={sectionMarkers.portfolioCta} titulo="Quer o seu aqui?" />
      </main>
      <Footer />
      <WhatsAppFixo mensagem="Oi! Vi o portfólio da NADA Studio e quero algo assim." />
    </>
  );
}
