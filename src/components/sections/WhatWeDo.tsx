"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/Reveal";
import SectionMarker from "@/components/SectionMarker";
import { sectionMarkers, services } from "@/data/content";

function Cabecalho() {
  return (
    <>
      <SectionMarker label="O que fazemos" number={sectionMarkers.whatWeDo} />
      <h2 className="mt-6 max-w-2xl text-[clamp(32px,4.2vw,52px)]">
        A gente constrói. Você só usa.
      </h2>
    </>
  );
}

/** Empilhado: mobile, reduced-motion e o estado antes do JS decidir. */
function Empilhado() {
  return (
    <section id="o-que-fazemos" className="section bg-[#fafafa]">
      <div className="wrap">
        <Reveal>
          <Cabecalho />
        </Reveal>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {services.map((servico, i) => (
            <Reveal key={servico.number} delay={i * 100}>
              <div className="card h-full">
                <span className="eyebrow">
                  {servico.number} — {servico.title}
                </span>
                <h3 className="mt-5 text-2xl">{servico.headline}</h3>
                <p className="mt-4 text-black/70">{servico.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function WhatWeDo() {
  const trilhaRef = useRef<HTMLDivElement>(null);
  const [pinar, setPinar] = useState(false);
  const [progresso, setProgresso] = useState(0);

  useEffect(() => {
    const semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Em tela pequena o pin rouba o scroll e trava. A altura mínima também
    // importa: numa janela baixa o painel não cabe em 100svh e corta.
    const telaGrande = window.matchMedia("(min-width: 768px) and (min-height: 640px)");
    const decidir = () => setPinar(telaGrande.matches && !semMovimento.matches);
    decidir();
    semMovimento.addEventListener("change", decidir);
    telaGrande.addEventListener("change", decidir);
    return () => {
      semMovimento.removeEventListener("change", decidir);
      telaGrande.removeEventListener("change", decidir);
    };
  }, []);

  useEffect(() => {
    if (!pinar) return;
    const trilha = trilhaRef.current;
    if (!trilha) return;

    let raf = 0;
    function medir() {
      raf = 0;
      const r = trilha!.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      if (total <= 0) return setProgresso(0);
      setProgresso(Math.min(1, Math.max(0, -r.top / total)));
    }
    function agendar() {
      if (!raf) raf = requestAnimationFrame(medir);
    }
    medir();
    window.addEventListener("scroll", agendar, { passive: true });
    window.addEventListener("resize", agendar);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", agendar);
      window.removeEventListener("resize", agendar);
    };
  }, [pinar]);

  if (!pinar) return <Empilhado />;

  const total = services.length;
  // Última fatia inclui o fim, senão o serviço final só aparece no pixel exato.
  const ativo = Math.min(total - 1, Math.floor(progresso * total));

  return (
    <section id="o-que-fazemos" className="bg-[#fafafa]">
      <div ref={trilhaRef} style={{ height: `${total * 100}svh` }}>
        <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
          <div className="wrap w-full">
            <Cabecalho />

            <div className="mt-10 grid grid-cols-[auto_1fr] gap-10 md:gap-16">
              {/* Trilho: linha preta preenchendo + dots numerados */}
              <div className="relative flex flex-col justify-between py-2">
                <div className="absolute left-[7px] top-0 h-full w-px bg-black/15" />
                <div
                  className="absolute left-[7px] top-0 w-px bg-black transition-[height] duration-150 ease-out"
                  style={{ height: `${progresso * 100}%` }}
                />
                {services.map((servico, i) => (
                  <div key={servico.number} className="relative flex items-center gap-4 py-4">
                    <span
                      className={`h-[15px] w-[15px] shrink-0 rounded-full border transition-colors duration-300 ${
                        i <= ativo ? "border-black bg-black" : "border-black/25 bg-[#fafafa]"
                      }`}
                    />
                    <span
                      className={`eyebrow transition-colors duration-300 ${
                        i === ativo ? "text-black" : "text-black/35"
                      }`}
                    >
                      00{i + 1}
                    </span>
                  </div>
                ))}
              </div>

              {/* Painel: os serviços trocam em crossfade */}
              <div className="relative min-h-[260px]">
                {services.map((servico, i) => (
                  <div
                    key={servico.number}
                    aria-hidden={i !== ativo}
                    className="absolute inset-0 transition-all duration-500 ease-out"
                    style={{
                      opacity: i === ativo ? 1 : 0,
                      transform: `translateY(${i === ativo ? 0 : 18}px)`,
                      pointerEvents: i === ativo ? undefined : "none",
                    }}
                  >
                    <span className="eyebrow">
                      {servico.number} — {servico.title}
                    </span>
                    <h3 className="mt-6 text-[clamp(28px,3.4vw,44px)] leading-[1.1]">
                      {servico.headline}
                    </h3>
                    <p className="prose-measure mt-6 text-[18px] text-black/70">
                      {servico.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
