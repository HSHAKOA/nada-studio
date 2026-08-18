"use client";

import Link from "next/link";
import Reveal from "@/components/Reveal";
import SectionMarker from "@/components/SectionMarker";
import { PROJETOS, SELO_TIPO } from "@/data/portfolio";

const DESTAQUES = PROJETOS.slice(0, 3);

export default function PortfolioTeaser() {
  return (
    <section id="portfolio-teaser" className="section bg-white text-black py-20">
      <div className="wrap">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Reveal>
              <SectionMarker label="Portfólio" number="003" />
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-4 max-w-2xl text-[clamp(32px,4.2vw,52px)] font-bold tracking-tight">
                O que a gente já construiu.
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-3 max-w-xl text-base sm:text-lg text-black/70">
                Aplicações no ar, automações rodando e ferramentas sob medida que resolvem gargalos reais de negócios.
              </p>
            </Reveal>
          </div>

          <Reveal delay={200}>
            <Link
              href="/portfolio"
              className="btn btn-secondary shrink-0"
            >
              <span>Ver todos os projetos</span>
              <span>→</span>
            </Link>
          </Reveal>
        </div>

        {/* Visual Cards Grid (Fundo Branco Clean) */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DESTAQUES.map((projeto, i) => (
            <Reveal key={projeto.id} delay={i * 100}>
              <Link
                href="/portfolio"
                className="group flex flex-col overflow-hidden rounded-[20px] border border-black/10 bg-white transition-all duration-300 hover:-translate-y-1.5 hover:border-black/30 hover:shadow-xl"
              >
                {/* Imagem do Projeto */}
                <div className="relative h-48 w-full overflow-hidden bg-black/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={projeto.imagem}
                    alt={projeto.nome}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ objectPosition: projeto.imagemPos || "center center" }}
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-black shadow-xs backdrop-blur-md">
                    {SELO_TIPO[projeto.tipo]}
                  </span>
                </div>

                {/* Conteúdo do Card */}
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {projeto.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-black/[0.04] px-2.5 py-0.5 text-[11px] font-medium text-black/70"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h3 className="text-xl font-bold tracking-tight text-black transition-colors group-hover:text-black">
                      {projeto.nome}
                    </h3>

                    <p className="mt-1 text-xs font-medium text-black/50">
                      {projeto.subtitulo}
                    </p>

                    <p className="mt-3 text-xs leading-relaxed text-black/70 line-clamp-2">
                      {projeto.depois}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-black/10 pt-4 text-xs font-semibold text-black">
                    <span>Ver case completo</span>
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* Bottom Banner callout */}
        <Reveal delay={300}>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-black/10 bg-black/[0.02] p-6 text-center sm:text-left">
            <div>
              <p className="text-sm font-semibold text-black">Quer ver mais cases e explorar a Vitrine 3D?</p>
              <p className="text-xs text-black/60 mt-0.5">Veja como transformamos processos manuais em sistemas automatizados.</p>
            </div>
            <Link
              href="/portfolio"
              className="btn btn-primary text-xs uppercase tracking-wider shrink-0"
            >
              Acessar Portfólio Completo →
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
