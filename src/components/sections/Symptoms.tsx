"use client";

import { useState } from "react";
import SectionMarker from "@/components/SectionMarker";
import { buildWhatsAppLink, ISSO_E_COM_A_GENTE, sectionMarkers } from "@/data/content";

const S = ISSO_E_COM_A_GENTE;

// A régua editorial do site virou uma lista que a pessoa marca: cada linha
// que bate ganha o traço à mão (o mesmo gesto do logotipo), o fecho conta
// quantas bateram e a mensagem do WhatsApp já sai com elas. O traço deixou de
// ser enfeite de hover: agora ele quer dizer "é isso aqui".
export default function Symptoms() {
  const [marcados, setMarcados] = useState<number[]>([]);
  const alternar = (i: number) =>
    setMarcados((atual) => (atual.includes(i) ? atual.filter((x) => x !== i) : [...atual, i].sort((a, b) => a - b)));

  const n = marcados.length;
  const fecho = n === 0 ? S.fecho : n === 1 ? S.fechoUm : S.fechoVarios(n);
  const mensagem = n ? S.ctaMsgMarcados(marcados.map((i) => S.itens[i])) : S.ctaMsg;

  return (
    <section id="isso-e-com-a-gente" className="section">
      <div className="wrap">
        <SectionMarker label={S.marcador} number={sectionMarkers.isso} />
        <h2 data-entra="titulo" className="max-w-2xl text-[clamp(32px,4.2vw,52px)]">
          {S.titulo}
        </h2>
        {/* A seta aponta pra lista e pisca até o primeiro item ser marcado. */}
        <p className="mt-4 flex items-end gap-3 text-[15px] text-black/55">
          {S.instrucao}
          <svg aria-hidden viewBox="0 0 30 26" className="sintoma-seta" data-some={n > 0 || undefined}>
            <path d="M3 3c9-1 19 3 20 19" />
            <path d="M15 15l8 8 5-10" />
          </svg>
        </p>

        <ul data-entra="linha" className="regua-topo mt-10 sm:grid sm:grid-cols-2 sm:gap-x-12">
          {S.itens.map((item, i) => {
            const marcado = marcados.includes(i);
            return (
              <li key={item} data-entra="linha" className="regua">
                <button
                  type="button"
                  aria-pressed={marcado}
                  onClick={() => alternar(i)}
                  className="sintoma flex min-h-11 w-full cursor-pointer items-baseline gap-4 py-5 text-left"
                >
                  <span className="sintoma-num w-8 shrink-0 text-sm">{String(i + 1).padStart(2, "0")}</span>
                  <span className="sintoma-texto relative text-[17px]">
                    {item}
                    <svg aria-hidden viewBox="0 0 300 12" preserveAspectRatio="none" className="traco-mao">
                      <path pathLength={1} d="M3 8C58 3 118 10 176 6s94-3 121 1" />
                    </svg>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <p aria-live="polite" className="prose-measure mt-10 text-[clamp(20px,2.4vw,26px)] font-semibold">
          {fecho}
        </p>
        <a href={buildWhatsAppLink(mensagem)} className="btn btn-primary mt-8">
          {S.cta} <span className="seta" aria-hidden>→</span>
        </a>
      </div>
    </section>
  );
}
