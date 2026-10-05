"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Ponto from "@/components/Ponto";
import TituloRotativo from "@/components/TituloRotativo";
import {
  buildWhatsAppLink,
  HERO_CTA,
  HERO_CTA_MSG,
  HERO_HEADLINE_FIXA,
  HERO_SUB,
  HERO_VARIACOES,
} from "@/data/content";
import { DUR, EASE, MQ, movimentoLiberado } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

// Hero em repouso. O título (TituloRotativo) recebe a luz na chegada, dá uma
// volta pelas quatro frases e para na última, com o cromo brilhando. No canto,
// a linha do indicador com o ponto da marca pendurado (a origem); ao rolar, a
// linha recolhe e o ponto cai pra fora da tela, rumo ao Antes/Depois (ver
// src/lib/ponto.ts).
// `local`: linha discreta na base (onde a gente atende).
export default function Hero({ local }: { local: string }) {
  const heroRef = useRef<HTMLElement>(null);
  const fioRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const fio = fioRef.current;
    if (!hero || !fio || !movimentoLiberado()) return;

    const linha = fio.querySelector<HTMLElement>(".hero-linha");
    const ponto = fio.querySelector<HTMLElement>(".ponto");
    const ctx = gsap.context(() => {});
    const mm = gsap.matchMedia();

    function iniciar() {
      ctx.add(() => {
        // A linha desce e o ponto aparece na ponta dela.
        gsap.fromTo(linha, { scaleY: 0 }, { scaleY: 1, duration: DUR.entrada, delay: 0.6, ease: EASE });
        gsap.fromTo(ponto, { scale: 0 }, { scale: 1, duration: 0.5, delay: 1.2, ease: EASE });
      });

      // Queda: ao rolar, a linha recolhe e o ponto solta, acelerando pra fora
      // da tela. Só com tela larga; no celular o ponto não viaja.
      mm.add(MQ.tablet, () => {
        gsap
          .timeline({ scrollTrigger: { trigger: hero, start: "top top", end: "+=55%", scrub: 0.5 } })
          .fromTo(linha, { scaleY: 1 }, { scaleY: 0, ease: "power2.in", duration: 0.45, immediateRender: false }, 0)
          .fromTo(
            ponto,
            { y: 0, scale: 1 },
            { y: () => innerHeight * 0.95, scale: 1.7, ease: "power2.in", duration: 1, immediateRender: false },
            0
          );
      });
      // Tela estreita com indicador: ele só some no primeiro movimento.
      mm.add(MQ.mobile, () => {
        const sumir = () => gsap.to(fio, { autoAlpha: 0, duration: 0.4 });
        window.addEventListener("scroll", sumir, { once: true, passive: true });
        return () => window.removeEventListener("scroll", sumir);
      });
    }

    if (window.__nadaIntro) window.addEventListener("nada:intro", iniciar, { once: true });
    else iniciar();

    return () => {
      window.removeEventListener("nada:intro", iniciar);
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={heroRef} id="top" className="relative flex min-h-[100svh] flex-col pt-28 pb-8">
      <div className="wrap relative z-10 flex flex-1 flex-col justify-center">
        <TituloRotativo
          fixa={HERO_HEADLINE_FIXA}
          variacoes={HERO_VARIACOES}
          className="text-[clamp(42px,6.5vw,78px)] font-black leading-[1.02] tracking-[-0.035em]"
        />

        <p className="prose-measure mt-6 text-[18px] leading-relaxed text-black/70 md:text-[20px]">
          {HERO_SUB}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a href={buildWhatsAppLink(HERO_CTA_MSG)} className="btn btn-primary">
            {HERO_CTA} <span className="seta" aria-hidden>→</span>
          </a>
          <Link href="/como-funciona" className="btn btn-secondary">
            Ver como funciona
          </Link>
        </div>
      </div>

      <div className="wrap relative z-10 mt-12 flex items-end justify-between gap-6">
        <p className="max-w-[60ch] text-[13px] text-black/55">{local}</p>
        <span ref={fioRef} aria-hidden className="hero-fio hidden sm:block">
          <span className="hero-linha" />
          <Ponto papel="origem" className="hero-ponto" />
        </span>
      </div>
    </section>
  );
}
