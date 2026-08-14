"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { HERO_HEADLINE_FIXA, HERO_VARIACOES } from "@/data/content";

const CICLO_MS = 3400;
const SAIDA_S = 0.32;

type Token = { texto: string; metal: boolean };

// A palavra metálica é sempre o primeiro token de (metal + depois): junta os
// dois, quebra por espaço, e o pedaço inicial carrega a pontuação colada
// (ex.: "negócio.") sem precisar de lógica separada pra pontuação.
function tokenizar(antes: string, metal: string, depois: string): Token[] {
  const antesWords = antes.trim().split(/\s+/).filter(Boolean);
  const restWords = (metal + depois).trim().split(/\s+/).filter(Boolean);
  return [
    ...antesWords.map((texto) => ({ texto, metal: false })),
    { texto: restWords[0], metal: true },
    ...restWords.slice(1).map((texto) => ({ texto, metal: false })),
  ];
}

export default function Hero() {
  const [index, setIndex] = useState(0);
  const linhaRef = useRef<HTMLSpanElement>(null);
  const tokens = tokenizar(
    HERO_VARIACOES[index].antes,
    HERO_VARIACOES[index].metal,
    HERO_VARIACOES[index].depois
  );

  useEffect(() => {
    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduzido) return; // trava na variação atual, sem shine, sem troca

    const ctx = gsap.context(() => {
      const palavras = linhaRef.current!.querySelectorAll<HTMLSpanElement>("[data-word]");
      const cicloS = CICLO_MS / 1000;

      const tl = gsap.timeline();
      tl.fromTo(
        palavras,
        { opacity: 0, y: "0.18em", filter: "blur(6px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.5, ease: "power2.out", stagger: 0.055 }
      )
        .to(
          palavras,
          { opacity: 0, y: "-0.14em", filter: "blur(6px)", duration: SAIDA_S, ease: "power2.in" },
          cicloS - SAIDA_S
        )
        .call(() => setIndex((i) => (i + 1) % HERO_VARIACOES.length));
    }, linhaRef);

    return () => ctx.revert();
  }, [index]);

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-24"
    >
      <div className="wrap relative z-10">
        <p className="eyebrow mb-6">DO NADA NASCE TUDO</p>
        <h1
          className="text-[clamp(40px,6vw,72px)]"
          style={{ fontWeight: 900, letterSpacing: "-0.035em", lineHeight: 1.02 }}
        >
          {HERO_HEADLINE_FIXA}
          <br />
          <span
            ref={linhaRef}
            aria-live="off"
            className="inline-block min-h-[1.15em] align-top md:min-h-[1.1em]"
          >
            {tokens.map((token, i) => (
              <span key={`${index}-${i}`} data-word className="inline-block">
                <span className={token.metal ? "metal" : undefined}>{token.texto}</span>
                {i < tokens.length - 1 ? " " : ""}
              </span>
            ))}
          </span>
        </h1>
        <p className="prose-measure mt-6 text-[18px] text-black/70">
          A gente cria seu site, automatiza o repetitivo e cuida de tudo por
          você. Você foca no que importa: vender.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <a href="#comecar" className="btn btn-primary">
            Começar do nada
          </a>
          <a href="#como-funciona" className="btn btn-secondary">
            Ver como funciona
          </a>
        </div>
      </div>
    </section>
  );
}
