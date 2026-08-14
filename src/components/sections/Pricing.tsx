"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Reveal from "@/components/Reveal";
import SectionMarker from "@/components/SectionMarker";
import { buildWhatsAppLink, sectionMarkers } from "@/data/content";
import { GARANTIA, NOTA_ANUAL, PLANOS, SOB_MEDIDA } from "@/data/pricing";

const formatBRL = (valor: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
  }).format(valor);

export default function Pricing() {
  const [anual, setAnual] = useState(false);
  const precosRef = useRef<Record<string, HTMLSpanElement | null>>({});
  const primeiraRenderRef = useRef(true);

  useEffect(() => {
    if (primeiraRenderRef.current) {
      primeiraRenderRef.current = false;
      return;
    }
    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduzido) return;

    const elementos = Object.values(precosRef.current).filter(
      (el): el is HTMLSpanElement => el !== null
    );
    gsap.fromTo(
      elementos,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.3, ease: "power2.out", stagger: 0.04 }
    );
  }, [anual]);

  return (
    <section id="precos" className="section">
      <div className="wrap">
        <Reveal>
          <SectionMarker label="Quanto custa" number={sectionMarkers.pricing} />
        </Reveal>
        <Reveal delay={80}>
          <h2 className="max-w-2xl text-[clamp(32px,4.2vw,52px)]">
            Um plano pra cada momento do seu negócio.
          </h2>
        </Reveal>

        <Reveal delay={160}>
          <div className="mt-10 w-full md:w-auto">
            <button
              type="button"
              role="switch"
              aria-checked={anual}
              onClick={() => setAnual((v) => !v)}
              className="relative flex w-full items-center rounded-full border border-black/15 p-1 md:w-72"
            >
              <span
                aria-hidden
                className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-full bg-black transition-transform duration-300 ease-out"
                style={{ transform: anual ? "translateX(100%)" : "translateX(0%)" }}
              />
              <span
                className={`relative z-10 flex-1 py-2 text-center text-sm font-medium transition-colors duration-300 ${
                  !anual ? "text-white" : "text-black/60"
                }`}
              >
                Mensal
              </span>
              <span
                className={`relative z-10 flex-1 py-2 text-center text-sm font-medium transition-colors duration-300 ${
                  anual ? "text-white" : "text-black/60"
                }`}
              >
                Anual
              </span>
            </button>
            <p
              className={`mt-3 text-sm text-black/50 transition-opacity duration-300 ${
                anual ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden={!anual}
            >
              {NOTA_ANUAL}
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-3 md:items-start">
          {PLANOS.map((plano, i) => {
            const valor = anual ? plano.anual : plano.mensal;
            const invert = Boolean(plano.destaque);
            return (
              <Reveal
                key={plano.id}
                delay={i * 100}
                className={invert ? "order-first md:order-none" : undefined}
              >
                <div
                  className={`flex h-full flex-col rounded-[20px] border p-8 ${
                    invert
                      ? "border-black bg-black text-white md:scale-[1.04]"
                      : "border-black/10 bg-white text-black"
                  }`}
                >
                  {invert && (
                    <span className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-white/60">
                      Mais contratado
                    </span>
                  )}

                  <h3 className="text-2xl">{plano.nome}</h3>
                  <p className={`mt-2 text-sm ${invert ? "text-white/70" : "text-black/60"}`}>
                    {plano.promessa}
                  </p>

                  <div className="mt-8 flex items-baseline gap-2">
                    <span
                      key={anual ? "anual" : "mensal"}
                      ref={(el) => {
                        precosRef.current[plano.id] = el;
                      }}
                      className="text-4xl font-semibold"
                    >
                      {formatBRL(valor)}
                    </span>
                    <span className={`text-sm ${invert ? "text-white/60" : "text-black/50"}`}>
                      /mês
                    </span>
                  </div>
                  <p className={`mt-1 text-xs ${invert ? "text-white/50" : "text-black/40"}`}>
                    Setup {plano.setup}
                  </p>

                  <ul className="mt-8 flex flex-1 flex-col gap-3">
                    {plano.inclui.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm">
                        <span aria-hidden className={invert ? "text-white/40" : "text-black/30"}>
                          –
                        </span>
                        <span className={invert ? "text-white/85" : "text-black/75"}>
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href={buildWhatsAppLink(`Oi! Quero saber mais sobre a ${plano.nome}.`)}
                    className={`btn mt-10 ${
                      invert ? "bg-white text-black hover:opacity-85" : "btn-secondary"
                    }`}
                  >
                    Falar no WhatsApp
                  </a>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={PLANOS.length * 100}>
          <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-black/10 pt-10 md:flex-row md:items-center">
            <div>
              <h3 className="text-xl">{SOB_MEDIDA.titulo}</h3>
              <p className="prose-measure mt-2 text-black/70">{SOB_MEDIDA.texto}</p>
            </div>
            <a
              href={buildWhatsAppLink("Oi! Quero pedir um orçamento sob medida.")}
              className="btn btn-secondary shrink-0"
            >
              {SOB_MEDIDA.cta}
            </a>
          </div>
        </Reveal>

        <Reveal delay={PLANOS.length * 100 + 80}>
          <p className="mt-10 text-center text-sm text-black/40">{GARANTIA}</p>
        </Reveal>
      </div>
    </section>
  );
}
