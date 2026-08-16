"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Reveal from "@/components/Reveal";
import SectionMarker from "@/components/SectionMarker";
import { ANTES_DEPOIS } from "@/data/content";

gsap.registerPlugin(ScrollTrigger);

type Painel = typeof ANTES_DEPOIS.antes;

// "8 horas" -> { valor: 8, palavra: "horas" }. Só o número entra no contador;
// a palavra fica parada ao lado dele.
function separarMetrica(metrica: string) {
  const [, digitos = "", palavra = ""] = metrica.match(/^(\d+)\s*(.*)$/) ?? [];
  return { valor: Number(digitos), palavra };
}

function escaparRegex(texto: string) {
  return texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Engrossa os dois números dentro do fecho sem repetir a frase no código: quebra
// pelas próprias métricas dos painéis, então mudar a métrica muda o realce junto.
function realcarFecho(frase: string, destaques: string[]) {
  const padrao = new RegExp(`(${destaques.map(escaparRegex).join("|")})`, "g");
  return frase
    .split(padrao)
    .filter(Boolean)
    .map((parte, i) =>
      destaques.includes(parte) ? (
        <strong key={i} className="font-black">
          {parte}
        </strong>
      ) : (
        <span key={i}>{parte}</span>
      )
    );
}

function PainelEstado({
  dados,
  invertido = false,
  painelRef,
  numeroRef,
}: {
  dados: Painel;
  invertido?: boolean;
  painelRef: React.RefObject<HTMLElement | null>;
  numeroRef: React.RefObject<HTMLSpanElement | null>;
}) {
  const { valor, palavra } = separarMetrica(dados.metrica);

  return (
    <article
      ref={painelRef}
      className={`group relative flex h-full flex-col rounded-[24px] p-8 md:p-10 lg:p-12 transition-all duration-300 ${
        invertido
          ? "border border-black/80 bg-black text-white shadow-xl shadow-black/10 hover:border-black"
          : "border border-black/15 bg-black/[0.015] text-black hover:border-black/30"
      }`}
    >
      {/* Badge de status do Painel */}
      <div className="flex items-center justify-between">
        <span
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
            invertido
              ? "bg-white/15 text-white backdrop-blur-xs"
              : "bg-red-500/10 text-red-700"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              invertido ? "bg-emerald-400 animate-pulse" : "bg-red-500"
            }`}
          />
          {dados.label}
        </span>
      </div>

      <h3 className="mt-6 text-[clamp(22px,2.6vw,30px)] font-bold leading-[1.15] tracking-tight">
        {dados.manchete}
      </h3>

      <ul
        className={`mt-6 space-y-3 text-[15px] leading-relaxed md:text-base ${
          invertido ? "text-white/75" : "text-black/65"
        }`}
      >
        {dados.linhas.map((linha) => (
          <li key={linha} className="flex items-start gap-2.5">
            <span
              className={`mt-1 text-xs font-bold ${
                invertido ? "text-emerald-400" : "text-red-500/80"
              }`}
            >
              {invertido ? "✓" : "✕"}
            </span>
            <span>{linha}</span>
          </li>
        ))}
      </ul>

      {/* Métrica de impacto com badge de destaque */}
      <div
        className={`mt-auto border-t pt-8 ${
          invertido ? "border-white/20" : "border-black/15"
        }`}
      >
        <p>
          <span className="sr-only">
            {dados.metrica} {dados.metricaUnidade}
          </span>
          <span
            aria-hidden="true"
            className={`block text-[clamp(44px,6.4vw,88px)] font-black leading-[0.92] tracking-[-0.04em] ${
              invertido ? "text-white" : "text-black/80"
            }`}
          >
            <span ref={numeroRef}>{valor}</span> {palavra}
          </span>
          <span
            aria-hidden="true"
            className={`mt-2 block text-sm font-medium md:text-base ${
              invertido ? "text-emerald-400" : "text-black/50"
            }`}
          >
            {dados.metricaUnidade}
          </span>
        </p>
        <p
          className={`mt-3 text-[13px] md:text-sm ${
            invertido ? "text-white/60" : "text-black/50"
          }`}
        >
          {dados.metricaLegenda}
        </p>
      </div>
    </article>
  );
}

export default function BeforeAfter() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const antesRef = useRef<HTMLElement>(null);
  const depoisRef = useRef<HTMLElement>(null);
  const numAntesRef = useRef<HTMLSpanElement>(null);
  const numDepoisRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const paineis = [antesRef.current, depoisRef.current].filter(
        (el): el is HTMLElement => el !== null
      );
      if (!paineis.length) return;

      const gatilho = { trigger: gridRef.current, start: "top 85%", once: true };

      gsap.fromTo(
        paineis,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.15,
          scrollTrigger: gatilho,
        }
      );

      // Contador escrevendo direto no textContent: setState no onUpdate
      // re-renderizaria a seção inteira a cada frame da animação.
      const contadores = [
        { ref: numAntesRef, metrica: ANTES_DEPOIS.antes.metrica, atraso: 0 },
        { ref: numDepoisRef, metrica: ANTES_DEPOIS.depois.metrica, atraso: 0.15 },
      ];

      contadores.forEach(({ ref, metrica, atraso }) => {
        const contador = { v: 0 };
        gsap.to(contador, {
          v: separarMetrica(metrica).valor,
          duration: 1.2,
          delay: atraso,
          ease: "power2.out",
          scrollTrigger: gatilho,
          onUpdate: () => {
            if (ref.current) ref.current.textContent = String(Math.round(contador.v));
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="antes-depois" className="section">
      <div className="wrap">
        <Reveal>
          <SectionMarker label={ANTES_DEPOIS.marcador} number={ANTES_DEPOIS.num} />
        </Reveal>
        <Reveal delay={80}>
          <h2 className="max-w-3xl text-[clamp(32px,4.2vw,52px)]">
            {ANTES_DEPOIS.titulo}
          </h2>
        </Reveal>

        <div
          ref={gridRef}
          className="mt-14 grid grid-cols-1 items-stretch gap-12 md:grid-cols-2 md:gap-8"
        >
          <PainelEstado
            dados={ANTES_DEPOIS.antes}
            painelRef={antesRef}
            numeroRef={numAntesRef}
          />
          <PainelEstado
            dados={ANTES_DEPOIS.depois}
            invertido
            painelRef={depoisRef}
            numeroRef={numDepoisRef}
          />
        </div>

        <p className="mt-16 text-balance text-center text-[clamp(24px,3.4vw,40px)] font-medium leading-[1.15] tracking-tight">
          {realcarFecho(ANTES_DEPOIS.fecho, [
            ANTES_DEPOIS.antes.metrica,
            ANTES_DEPOIS.depois.metrica,
          ])}
        </p>
        <p className="mt-4 text-center text-[13px] text-black/60">
          {ANTES_DEPOIS.credito}
        </p>
      </div>
    </section>
  );
}
