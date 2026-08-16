"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Reveal from "@/components/Reveal";
import SectionMarker from "@/components/SectionMarker";
import { buildWhatsAppLink, sectionMarkers } from "@/data/content";
import { MANUTENCAO, PACOTES, SELO_DESTAQUE, SOB_MEDIDA } from "@/data/pricing";

gsap.registerPlugin(ScrollTrigger);

const MOBILE_BREAKPOINT = 768;

export default function Pricing() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [emVista, setEmVista] = useState(false);
  const [abertos, setAbertos] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entrada]) => setEmVista(entrada.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduzido) return;
    const cards = cardRefs.current.filter((el): el is HTMLElement => el !== null);
    if (!cards.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.1,
          scrollTrigger: { trigger: gridRef.current, start: "top 85%", once: true },
        }
      );
    }, gridRef);

    return () => ctx.revert();
  }, []);

  function alternar(id: string) {
    setAbertos((atual) => ({ ...atual, [id]: !atual[id] }));
  }

  return (
    <section id="precos" ref={sectionRef} className="section">
      <div className="wrap">
        <Reveal>
          <SectionMarker label="Formatos de Projeto" number={sectionMarkers.pricing} />
        </Reveal>
        <Reveal delay={80}>
          <h2 className="max-w-2xl text-[clamp(32px,4.2vw,52px)]">
            Escopo claro. Sem surpresas.
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="prose-measure mt-4 text-[18px] text-black/70">
            Cada projeto é construído sob medida para a realidade do seu negócio. Escolha o formato que melhor atende o seu momento:
          </p>
        </Reveal>

        <div
          ref={gridRef}
          className="mt-14 grid gap-6 md:grid-cols-3 md:items-start"
        >
          {(isMobile
            ? [...PACOTES].sort((a, b) => Number(b.destaque) - Number(a.destaque))
            : PACOTES
          ).map((pacote) => {
            const invert = Boolean(pacote.destaque);
            const aberto = !isMobile || invert || Boolean(abertos[pacote.id]);
            const indexOriginal = PACOTES.indexOf(pacote);

            return (
              <article
                key={pacote.id}
                ref={(el) => {
                  cardRefs.current[indexOriginal] = el;
                }}
                className={`flex flex-col rounded-[20px] border p-8 transition-shadow duration-300 ${
                  invert
                    ? "border-black bg-black text-white shadow-xl md:scale-[1.04]"
                    : "border-black/10 bg-white text-black hover:border-black/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                      invert
                        ? "bg-white/20 text-white"
                        : "bg-black/5 text-black/70"
                    }`}
                  >
                    {pacote.prazo}
                  </span>
                  {invert && (
                    <span className="text-xs font-medium uppercase tracking-[0.2em] text-white/60">
                      {SELO_DESTAQUE}
                    </span>
                  )}
                </div>

                <h3 className="mt-6 text-2xl font-bold">{pacote.nome}</h3>

                <p className={`mt-3 text-sm leading-relaxed ${invert ? "text-white/70" : "text-black/60"}`}>
                  {pacote.promessa}
                </p>

                {!invert && (
                  <button
                    type="button"
                    onClick={() => alternar(pacote.id)}
                    aria-expanded={aberto}
                    className="mt-6 flex items-center gap-2 text-sm font-medium md:hidden"
                  >
                    <span aria-hidden className={`transition-transform duration-300 ${aberto ? "rotate-45" : ""}`}>
                      +
                    </span>
                    O que inclui
                  </button>
                )}

                <div
                  className="grid transition-[grid-template-rows] duration-300 ease-out md:grid-rows-[1fr]!"
                  style={{ gridTemplateRows: aberto ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <ul className="mt-6 flex flex-col gap-3 border-t pt-6 border-current/10 md:mt-8">
                      {pacote.inclui.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-sm">
                          <span aria-hidden className={`font-bold ${invert ? "text-emerald-400" : "text-black"}`}>
                            ✓
                          </span>
                          <span className={invert ? "text-white/85" : "text-black/75"}>
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <a
                      href={buildWhatsAppLink(pacote.whatsappMsg)}
                      className={`btn mt-8 w-full justify-center ${
                        invert ? "bg-white text-black hover:bg-white/90" : "btn-secondary"
                      }`}
                    >
                      {pacote.cta} →
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <Reveal delay={PACOTES.length * 100}>
          <div className="mt-16 flex flex-col items-start justify-between gap-6 rounded-2xl border border-black/10 bg-black/[0.02] p-8 md:flex-row md:items-center">
            <div>
              <h3 className="text-xl font-bold">{SOB_MEDIDA.titulo}</h3>
              <p className="prose-measure mt-2 text-black/70">{SOB_MEDIDA.texto}</p>
            </div>
            <a
              href={buildWhatsAppLink(SOB_MEDIDA.whatsappMsg)}
              className="btn btn-secondary shrink-0"
            >
              {SOB_MEDIDA.cta}
            </a>
          </div>
        </Reveal>

        <Reveal delay={PACOTES.length * 100 + 80}>
          <p className="mt-10 text-center text-sm text-black/60 max-w-2xl mx-auto">{MANUTENCAO}</p>
        </Reveal>
      </div>

      {/* WhatsApp sticky mobile */}
      <a
        href={buildWhatsAppLink("Oi! Vi os formatos de projeto no site e quero solicitar uma proposta.")}
        className={`btn btn-primary fixed inset-x-4 bottom-4 z-30 justify-center md:hidden ${
          isMobile && emVista ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0 pointer-events-none"
        } transition-[transform,opacity] duration-300 ease-out`}
      >
        Falar no WhatsApp
      </a>
    </section>
  );
}
