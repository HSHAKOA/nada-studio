"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { buildWhatsAppLink, HERO_HEADLINE_FIXA, HERO_VARIACOES } from "@/data/content";

const CICLO_MS = 3400;
const SAIDA_S = 0.32;

type Token = { texto: string; metal: boolean };

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
    const reduzido = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const palavras = linhaRef.current?.querySelectorAll<HTMLSpanElement>("[data-word]");
      if (!palavras || palavras.length === 0) return;

      const cicloS = CICLO_MS / 1000;
      const tl = gsap.timeline();

      if (reduzido) {
        tl.fromTo(
          palavras,
          { opacity: 0 },
          { opacity: 1, duration: 0.3, stagger: 0.02 }
        )
          .to(
            palavras,
            { opacity: 0, duration: 0.3 },
            cicloS - 0.3
          )
          .call(() => setIndex((i) => (i + 1) % HERO_VARIACOES.length));
      } else {
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
      }
    }, linhaRef);

    return () => ctx.revert();
  }, [index]);

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-28 pb-16"
    >
      <div className="wrap relative z-10">
        <h1
          className="text-[clamp(42px,6.5vw,78px)] font-black leading-[1.02] tracking-[-0.035em]"
        >
          <span>{HERO_HEADLINE_FIXA}</span>
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

        <p className="prose-measure mt-6 text-[18px] md:text-[20px] leading-relaxed text-black/70">
          A gente cria seu site, tira o repetitivo das suas costas e cuida de
          tudo por você. Você foca no que importa: <strong>vender</strong>.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href={buildWhatsAppLink("Oi! Vi o site e quero começar do nada.")}
            className="btn btn-primary"
          >
            Começar do nada →
          </a>
          <a href="/como-funciona" className="btn btn-secondary">
            Ver como funciona
          </a>
        </div>
      </div>
    </section>
  );
}
