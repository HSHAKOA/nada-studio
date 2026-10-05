"use client";

import { useState } from "react";
import SectionMarker from "@/components/SectionMarker";
import { buildWhatsAppLink, DIAGNOSTICO_CTA, sectionMarkers } from "@/data/content";
import { DIAGNOSTICO, MANUTENCAO, PACOTES, SELO_DESTAQUE } from "@/data/pricing";
import { MQ, useMedia } from "@/lib/motion";

// Área de decisão: nada se move aqui. A oferta principal é o diagnóstico
// gratuito; os formatos vêm depois. No celular, cada formato recolhe em
// "O que inclui" (o mais pedido vem primeiro e já aberto).
export default function Pricing() {
  const mobile = useMedia(MQ.mobile);
  const [abertos, setAbertos] = useState<Record<string, boolean>>({});

  return (
    <section id="precos" className="section">
      <div className="wrap">
        <SectionMarker label="Formatos de projeto" number={sectionMarkers.pricing} />
        <h2 data-entra="titulo" className="max-w-2xl text-[clamp(32px,4.2vw,52px)]">
          Escopo claro. Sem surpresas.
        </h2>
        <p className="prose-measure mt-4 text-[18px] text-black/70">
          Cada projeto é construído sob medida. Prazo e valor ficam fechados antes de começar.
        </p>

        <div
          data-escuro
          className="mt-12 flex flex-col gap-8 bg-black p-8 text-white md:flex-row md:items-center md:justify-between md:p-12"
        >
          <div>
            <h3 className="max-w-xl text-[clamp(24px,2.8vw,34px)]">{DIAGNOSTICO.titulo}</h3>
            <p className="prose-measure mt-3 text-white/70">{DIAGNOSTICO.texto}</p>
          </div>
          <a href={buildWhatsAppLink(DIAGNOSTICO.whatsappMsg)} className="btn btn-primary shrink-0">
            {DIAGNOSTICO_CTA} <span className="seta" aria-hidden>→</span>
          </a>
        </div>

        <div className="mt-12 grid border-t border-black/15 md:grid-cols-3 md:divide-x md:divide-black/15">
          {PACOTES.map((pacote) => {
            // Recolhido desde a primeira pintura (CSS abre no desktop): sem salto
            // de layout depois da hidratação.
            const aberto = pacote.destaque || Boolean(abertos[pacote.id]);
            const listaId = `inclui-${pacote.id}`;

            return (
              <article
                key={pacote.id}
                className={`flex flex-col border-b border-black/15 py-8 md:border-b-0 md:px-8 md:first:pl-0 md:last:pr-0 ${
                  pacote.destaque ? "order-first md:order-none" : ""
                }`}
              >
                <p className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.14em] text-black/55">
                  <span>{pacote.prazo}</span>
                  {pacote.destaque && <span className="text-black">( {SELO_DESTAQUE} )</span>}
                </p>
                <h3 className="mt-5 text-2xl">{pacote.nome}</h3>
                <p className="mt-3 text-[15px] text-black/65">{pacote.promessa}</p>

                {!pacote.destaque && (
                  <button
                    type="button"
                    onClick={() => setAbertos((atual) => ({ ...atual, [pacote.id]: !atual[pacote.id] }))}
                    aria-expanded={aberto}
                    aria-controls={listaId}
                    className="mt-4 flex min-h-11 items-center gap-2 text-sm font-medium md:hidden"
                  >
                    <span aria-hidden className={`inline-block text-lg transition-transform duration-300 ${aberto ? "rotate-45" : ""}`}>
                      +
                    </span>
                    O que inclui
                  </button>
                )}

                <div
                  id={listaId}
                  inert={(mobile && !aberto) || undefined}
                  className="grid flex-1 transition-[grid-template-rows] duration-300 ease-out md:grid-rows-[1fr]!"
                  style={{ gridTemplateRows: aberto ? "1fr" : "0fr" }}
                >
                  <div className="flex flex-col overflow-hidden">
                    <ul className="mt-6 mb-8 flex flex-col gap-3 border-t border-black/10 pt-6">
                      {pacote.inclui.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-sm">
                          <span aria-hidden className="font-bold">✓</span>
                          <span className="text-black/75">{item}</span>
                        </li>
                      ))}
                    </ul>
                    {/* mt-auto: no desktop os três botões alinham na base. */}
                    <a href={buildWhatsAppLink(pacote.whatsappMsg)} className="btn btn-secondary mt-auto w-full">
                      {pacote.cta} <span className="seta" aria-hidden>→</span>
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-black/60">{MANUTENCAO}</p>
      </div>
    </section>
  );
}
