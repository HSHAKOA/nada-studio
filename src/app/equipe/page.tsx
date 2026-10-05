import type { Metadata } from "next";
import { metadadosDePagina } from "@/lib/metadados";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFixo from "@/components/WhatsAppFixo";
import Founders from "@/components/sections/Founders";
import CTA from "@/components/sections/CTA";
import { CHAMADAS, sectionMarkers } from "@/data/content";

export const metadata: Metadata = metadadosDePagina({
  titulo: "Equipe",
  descricao:
    "Quem constrói a NADA Studio: João e Eric, os dois fundadores.",
  caminho: "/equipe",
});

export default function Equipe() {
  return (
    <>
      <Navbar />
      <main className="pt-24">
        <Founders />
        <CTA
          numero={sectionMarkers.equipeCta}
          titulo={CHAMADAS.equipe.titulo}
          texto={CHAMADAS.equipe.texto}
          mensagem="Oi! Quero falar direto com quem constrói. Posso contar o que trava o meu dia?"
        />
      </main>
      <Footer />
      <WhatsAppFixo mensagem="Oi! Quero falar com a equipe da NADA Studio." />
    </>
  );
}
