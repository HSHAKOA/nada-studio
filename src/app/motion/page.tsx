import type { Metadata } from "next";
import { metadadosDePagina } from "@/lib/metadados";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AberturaNada from "@/components/AberturaNada";
import BuracoViajante from "@/components/3d/BuracoViajante";
import CapaVideo from "@/components/CapaVideo";
import MotionHero from "@/components/MotionHero";
import PecaVideo from "@/components/PecaVideo";
import SectionMarker from "@/components/SectionMarker";
import WhatsAppFixo from "@/components/WhatsAppFixo";
import CTA from "@/components/sections/CTA";
import { MOTION, MOTION_GRUPOS, MOTION_TRABALHOS, ROTULO_ORIGEM, sectionMarkers } from "@/data/content";

export const metadata: Metadata = metadadosDePagina({
  titulo: "Motion",
  descricao:
    "Edição de vídeo, motion design e produção visual da NADA Studio, com o mesmo cuidado do site. Do nada nasce tudo. Inclusive o vídeo.",
  caminho: "/motion",
});

type Peca = (typeof MOTION_TRABALHOS)[number];

// O rótulo ao lado do título é a origem da peça (cliente, nosso, estudo
// autoral). No cartão estreito ele desce pra linha de baixo.
function Legenda({ peca }: { peca: Peca }) {
  return (
    <>
      <p className="mt-5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className="text-xl font-bold tracking-tight">{peca.titulo}</span>
        <span className="shrink-0 text-[11px] uppercase tracking-[0.18em] text-black/55">{ROTULO_ORIGEM[peca.origem]}</span>
      </p>
      <p className="mt-2 text-[15px] text-black/70">{peca.descricao}</p>
    </>
  );
}

// Um cartão por tipo de peça: a abertura do site tocando no próprio cartão, a
// peça em vídeo (prévia muda, som no clique) ou a capa que leva ao trabalho.
function Cartao({ peca }: { peca: Peca }) {
  const emPe = peca.formato === "vertical";
  // Em pé: quadro e legenda na mesma largura, no meio da coluna.
  const largura = emPe ? "mx-auto w-full max-w-[360px]" : undefined;

  if (peca.abertura) {
    return (
      <li>
        <div data-entra="imagem">
          <AberturaNada />
        </div>
        <Legenda peca={peca} />
        {/* <a> comum: a abertura em tela cheia precisa de carregamento completo. */}
        <a href={peca.href} className="link-u mt-1 inline-block py-3 text-sm font-medium">
          Ver em tela cheia <span className="seta" aria-hidden>→</span>
        </a>
      </li>
    );
  }

  if (peca.inteira && peca.poster && peca.video) {
    return (
      <li className={largura}>
        <PecaVideo
          titulo={peca.titulo}
          poster={peca.poster}
          previa={peca.video}
          previaPequena={peca.videoPequeno}
          inteira={peca.inteira}
          duracao={peca.duracao}
          emPe={emPe}
        >
          <Legenda peca={peca} />
        </PecaVideo>
      </li>
    );
  }

  return (
    <li className={largura}>
      <a
        href={peca.href}
        {...(peca.externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="capa-link group block"
      >
        <div
          data-entra="imagem"
          aria-hidden
          className={`capa ${peca.poster ? "capa-filme" : "capa-tipografica"} ${
            emPe ? "capa-em-pe aspect-[9/16]" : "capa-larga aspect-[16/10]"
          }`}
        >
          <div className="capa-miolo">
            {/* Com filme, a peça ocupa o cartão inteiro, sem marcador por cima. */}
            {!peca.poster && (
              <span className="capa-marcador">
                ( motion ) {String(MOTION_TRABALHOS.indexOf(peca) + 1).padStart(2, "0")}
              </span>
            )}
            {peca.poster ? (
              <div className="capa-imagem">
                <Image src={peca.poster} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
                {peca.video && <CapaVideo src={peca.video} pequeno={peca.videoPequeno} />}
              </div>
            ) : (
              <span className="capa-nome">{peca.titulo}</span>
            )}
          </div>
        </div>
        <Legenda peca={peca} />
        <span className="link-u mt-1 inline-block py-3 text-sm font-medium">
          {peca.externo ? "Ver no ar" : "Ver"}{" "}
          <span className="seta" aria-hidden>
            {peca.externo ? "↗" : "→"}
          </span>
        </span>
      </a>
    </li>
  );
}

// Braço de vídeo da NADA Studio. A página prova o serviço pelo acabamento:
// o título é montado como uma edição, a primeira peça (a abertura do site)
// toca dentro do próprio cartão e as peças em vídeo tocam com som no clique.
// Trabalhos agrupados pela competência principal; cada peça diz de onde veio.
// Só peça real; vídeo só onde houver vídeo.
export default function MotionPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24">
        {/* Um buraco negro pequeno atravessa o título e as três frentes. */}
        <BuracoViajante>
          <MotionHero />

          <section aria-labelledby="capacidades" className="section pt-0">
            <div className="wrap">
              <SectionMarker label="O que a gente faz" number={sectionMarkers.capacidades} />
              <h2 id="capacidades" data-entra="titulo" className="max-w-2xl text-[clamp(32px,4.2vw,52px)]">
                Três frentes, um estúdio.
              </h2>
              <ol data-entra="linha" className="regua-topo mt-14">
                {MOTION.capacidades.map((item) => (
                  <li key={item.num} data-entra="linha" className="regua grid gap-3 py-10 md:grid-cols-12 md:gap-8">
                    <span className="text-sm text-black/40 md:col-span-1">{item.num}</span>
                    <h3 className="text-[clamp(36px,5vw,64px)] font-black leading-none tracking-[-0.035em] md:col-span-5">
                      {item.titulo}
                    </h3>
                    <p className="text-[17px] text-black/70 md:col-span-6 md:pt-2">{item.texto}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        </BuracoViajante>

        <section aria-labelledby="trabalhos" className="section pt-0">
          <div className="wrap">
            <SectionMarker label="Trabalhos" number={sectionMarkers.trabalhos} />
            <h2 id="trabalhos" data-entra="titulo" className="text-[clamp(32px,4.2vw,52px)]">
              {MOTION.trabalhosTitulo}
            </h2>
            <p className="prose-measure mt-4 text-black/65">{MOTION.trabalhosTexto}</p>

            <div className="mt-14 space-y-20">
              {MOTION_GRUPOS.map((grupo) => {
                const pecas = MOTION_TRABALHOS.filter((peca) => peca.competencia === grupo.id);
                if (pecas.length === 0) return null;
                return (
                  <section key={grupo.id} aria-labelledby={`grupo-${grupo.id}`}>
                    <div data-entra="linha" className="regua-topo flex items-baseline justify-between gap-4 pt-5">
                      <h3 id={`grupo-${grupo.id}`} className="text-[clamp(22px,2.6vw,32px)]">
                        {grupo.titulo}
                      </h3>
                      <span className="shrink-0 text-[11px] uppercase tracking-[0.18em] text-black/55">
                        {pecas.length} {pecas.length === 1 ? "peça" : "peças"}
                      </span>
                    </div>
                    <ul className="mt-10 grid gap-x-6 gap-y-14 md:grid-cols-2">
                      {pecas.map((peca) => (
                        <Cartao key={peca.titulo} peca={peca} />
                      ))}
                    </ul>
                  </section>
                );
              })}
            </div>
          </div>
        </section>

        <CTA
          numero={sectionMarkers.motionCta}
          titulo={MOTION.cta.titulo}
          texto={MOTION.cta.texto}
          botao={MOTION.cta.botao}
          mensagem={MOTION.cta.msg}
        />
      </main>
      <Footer />
      <WhatsAppFixo mensagem={MOTION.cta.msg} />
    </>
  );
}
