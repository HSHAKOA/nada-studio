import type { Metadata } from "next";
import { metadadosDePagina } from "@/lib/metadados";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionMarker from "@/components/SectionMarker";
import TituloRotativo from "@/components/TituloRotativo";
import WhatsAppFixo from "@/components/WhatsAppFixo";
import CTA from "@/components/sections/CTA";
import { IA_EMPRESAS, buildWhatsAppLink, sectionMarkers } from "@/data/content";

export const metadata: Metadata = metadadosDePagina({
  titulo: "IA para empresas",
  descricao:
    "Implementação e treinamento de IA dentro da sua empresa: a ferramenta configurada no seu processo e a equipe usando no trabalho de todo dia.",
  caminho: "/ia-para-empresas",
});

// Braço de IA da NADA Studio: implementação e treinamento dentro de empresas.
// Única página do site em que "IA" é dita com todas as letras (aqui ela é o
// serviço). Sem preço, prazo nem nome de ferramenta: isso sai da conversa.
// O endereço antigo (/ia-nas-empresas) redireciona pra cá (public/_redirects).
export default function IaParaEmpresasPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24">
        <section aria-labelledby="ia" className="section">
          <div className="wrap">
            <SectionMarker label={IA_EMPRESAS.marcador} number={sectionMarkers.ia} />
            {/* Igual ao hero da home: luz na chegada, frases que se revezam e
                param na última, com o cromo brilhando. */}
            <TituloRotativo
              id="ia"
              fixa={IA_EMPRESAS.titulo.fixa}
              variacoes={IA_EMPRESAS.titulo.variacoes}
              className="max-w-4xl text-[clamp(36px,5.6vw,76px)]"
            />
            <p className="prose-measure mt-8 text-[18px] text-black/70">{IA_EMPRESAS.sub}</p>
            <a href={buildWhatsAppLink(IA_EMPRESAS.cta.msg)} className="btn btn-primary mt-10">
              {IA_EMPRESAS.cta.botao} <span className="seta" aria-hidden>→</span>
            </a>
          </div>
        </section>

        <section aria-labelledby="frentes" className="section pt-0">
          <div className="wrap">
            <SectionMarker label="Como a gente faz" number={sectionMarkers.iaFrentes} />
            <h2 id="frentes" data-entra="titulo" className="max-w-2xl text-[clamp(32px,4.2vw,52px)]">
              {IA_EMPRESAS.frentesTitulo}
            </h2>
            <ol data-entra="linha" className="regua-topo mt-14">
              {IA_EMPRESAS.frentes.map((item) => (
                <li key={item.num} data-entra="linha" className="regua grid gap-3 py-10 md:grid-cols-12 md:gap-8">
                  <span className="text-sm text-black/40 md:col-span-1">{item.num}</span>
                  {/* "Implementação" é uma palavra só e comprida: no tamanho da
                      página Motion ela passava da coluna e cobria o texto.
                      Coluna mais larga e corpo um pouco menor. */}
                  <h3 className="text-[clamp(30px,4.2vw,54px)] font-black leading-none tracking-[-0.035em] md:col-span-6">
                    {item.titulo}
                  </h3>
                  <p className="text-[17px] text-black/70 md:col-span-5 md:pt-1">{item.texto}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <CTA
          numero={sectionMarkers.iaCta}
          titulo={IA_EMPRESAS.cta.titulo}
          texto={IA_EMPRESAS.cta.texto}
          botao={IA_EMPRESAS.cta.botao}
          mensagem={IA_EMPRESAS.cta.msg}
        />
      </main>
      <Footer />
      <WhatsAppFixo mensagem={IA_EMPRESAS.cta.msg} />
    </>
  );
}
