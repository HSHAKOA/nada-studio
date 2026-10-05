"use client";

import { useState } from "react";
import SectionMarker from "@/components/SectionMarker";
import { faqItems, sectionMarkers } from "@/data/content";

// Acordeão: + vira ×, a altura abre na curva do site e a resposta entra 80 ms
// depois. No hover (e no foco) a pergunta se adianta e o sinal gira: a linha
// mostra que abre. As respostas ficam no HTML mesmo fechadas (o Google lê).
export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="perguntas" className="section">
      <div className="wrap">
        <SectionMarker label="Perguntas" number={sectionMarkers.faq} />
        <h1 data-entra="titulo" className="max-w-2xl text-[clamp(32px,4.2vw,52px)]">
          Perguntas que todo mundo faz.
        </h1>

        <div className="mt-14 divide-y divide-black/10 border-y border-black/10">
          {faqItems.map((item, i) => {
            const isOpen = openIndex === i;
            const respostaId = `resposta-${i}`;
            return (
              <div key={item.q}>
                <h2 className="font-sans text-base font-normal leading-normal tracking-normal">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={respostaId}
                    className="faq-pergunta flex min-h-11 w-full cursor-pointer items-center justify-between gap-6 py-6 text-left"
                  >
                    <span className="faq-texto text-lg font-medium">{item.q}</span>
                    <span aria-hidden className="faq-sinal shrink-0 text-2xl font-light">
                      +
                    </span>
                  </button>
                </h2>
                <div
                  id={respostaId}
                  className="grid transition-[grid-template-rows] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p
                      className="prose-measure pb-6 text-black/70 transition-opacity duration-300"
                      style={{ opacity: isOpen ? 1 : 0, transitionDelay: isOpen ? "80ms" : "0ms" }}
                    >
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
