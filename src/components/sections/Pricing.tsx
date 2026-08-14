"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Reveal from "@/components/Reveal";
import SectionMarker from "@/components/SectionMarker";
import { buildWhatsAppLink, sectionMarkers } from "@/data/content";
import { MANUTENCAO, PORTES, SELO_DESTAQUE, SOB_MEDIDA } from "@/data/pricing";

gsap.registerPlugin(ScrollTrigger);

const formatBRL = (valor: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
  }).format(valor);

const MOBILE_BREAKPOINT = 768;

function Preco({
  precoBase,
  prazo,
  invert,
}: {
  precoBase: number;
  prazo: string;
  invert: boolean;
}) {
  return (
    <div className="mt-6">
      <p className={`text-xs ${invert ? "text-white/60" : "text-black/50"}`}>
        a partir de
      </p>
      <p className="mt-1 text-4xl font-semibold">{formatBRL(precoBase)}</p>
      <p className={`mt-1 text-xs ${invert ? "text-white/50" : "text-black/40"}`}>
        {prazo}
      </p>
    </div>
  );
}

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

  // Entrada dos cards via ScrollTrigger — só uma vez, e nunca com
  // prefers-reduced-motion (aí ficam visíveis desde o primeiro render, sem
  // opacity:0 inicial escondendo o conteúdo).
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
          <SectionMarker label="Quanto custa" number={sectionMarkers.pricing} />
        </Reveal>
        <Reveal delay={80}>
          <h2 className="max-w-2xl text-[clamp(32px,4.2vw,52px)]">
            Preço na mesa. Sem &ldquo;consulte-nos&rdquo;.
          </h2>
        </Reveal>

        <div
          ref={gridRef}
          className="mt-14 grid gap-6 md:grid-cols-3 md:items-start"
        >
          {(isMobile
            ? [...PORTES].sort((a, b) => Number(b.destaque) - Number(a.destaque))
            : PORTES
          ).map((porte) => {
              const invert = Boolean(porte.destaque);
              // No mobile o card destaque já nasce aberto; os outros dois só
              // abrem com toque. No desktop todo mundo mostra tudo sempre.
              const aberto = !isMobile || invert || Boolean(abertos[porte.id]);
              const indexOriginal = PORTES.indexOf(porte);

              return (
                <article
                  key={porte.id}
                  ref={(el) => {
                    cardRefs.current[indexOriginal] = el;
                  }}
                  className={`flex flex-col rounded-[20px] border p-8 ${
                    invert
                      ? "border-black bg-black text-white md:scale-[1.04]"
                      : "border-black/10 bg-white text-black"
                  }`}
                >
                  {invert && (
                    <span className="text-xs font-medium uppercase tracking-[0.2em] text-white/60">
                      {SELO_DESTAQUE}
                    </span>
                  )}

                  <h3 className="mt-4 text-2xl">{porte.nome}</h3>

                  <Preco precoBase={porte.precoBase} prazo={porte.prazo} invert={invert} />

                  <p className={`mt-6 text-sm ${invert ? "text-white/70" : "text-black/60"}`}>
                    {porte.promessa}
                  </p>

                  {!invert && (
                    <button
                      type="button"
                      onClick={() => alternar(porte.id)}
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
                      <ul className="mt-6 flex flex-col gap-3 md:mt-8">
                        {porte.inclui.map((item) => (
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
                        href={buildWhatsAppLink(porte.whatsappMsg)}
                        className={`btn mt-8 ${
                          invert ? "bg-white text-black hover:opacity-85" : "btn-secondary"
                        }`}
                      >
                        {porte.cta}
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
        </div>

        <Reveal delay={PORTES.length * 100}>
          <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-black/10 pt-10 md:flex-row md:items-center">
            <div>
              <h3 className="text-xl">{SOB_MEDIDA.titulo}</h3>
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

        <Reveal delay={PORTES.length * 100 + 80}>
          <p className="mt-10 text-center text-sm text-black/40">{MANUTENCAO}</p>
        </Reveal>
      </div>

      {/* WhatsApp sticky — só mobile, só enquanto a seção está no viewport.
          z-30: abaixo do menu hambúrguer (z-50) e do overlay mobile (z-40),
          então abrir o menu cobre a barra em vez de brigar por cima dela. */}
      <a
        href={buildWhatsAppLink("Oi! Vi os preços e quero saber mais.")}
        className={`btn btn-primary fixed inset-x-4 bottom-4 z-30 justify-center md:hidden ${
          isMobile && emVista ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0 pointer-events-none"
        } transition-[transform,opacity] duration-300 ease-out`}
      >
        Falar no WhatsApp
      </a>
    </section>
  );
}
