"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import NadaWordmark from "./NadaWordmark";
import { EASE_TRANSFORMA, movimentoLiberado } from "@/lib/motion";

// A abertura do site tocando dentro do cartão da página Motion: é a peça,
// não uma imagem dela. Toca uma vez quando o cartão aparece e de novo a cada
// clique (ou toque). Movimento reduzido: fica o quadro final, parado.
export default function AberturaNada() {
  const palcoRef = useRef<HTMLButtonElement>(null);
  const tocarRef = useRef<() => void>(() => {});

  useEffect(() => {
    const palco = palcoRef.current;
    if (!palco || !movimentoLiberado()) return;
    const letras = palco.querySelectorAll<SVGPathElement>("[data-letra]");
    const studio = palco.querySelector<SVGPathElement>("[data-studio]");
    const branco = palco.querySelector<HTMLElement>(".abertura-branco");
    const ponto = palco.querySelector<HTMLElement>(".abertura-ponto");

    const ctx = gsap.context(() => {
      const tl = gsap
        .timeline({ paused: true })
        .set(branco, { clipPath: "circle(0% at 50% 50%)" })
        .set(letras, { stroke: "#fff", strokeWidth: 8, fill: "transparent", strokeDasharray: 1, strokeDashoffset: 1 })
        .set(studio, { fill: "#fff", autoAlpha: 0 })
        .fromTo(ponto, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.2, ease: "power2.out" })
        .to(letras, { strokeDashoffset: 0, duration: 0.55, ease: "power2.inOut", stagger: 0.08 }, 0.2)
        .addLabel("bang", 1.0)
        .to(ponto, { scale: 5, autoAlpha: 0, duration: 0.35, ease: "power2.out" }, "bang")
        .to(letras, { fill: "#fff", strokeWidth: 0, duration: 0.25 }, "bang")
        .to(studio, { autoAlpha: 1, duration: 0.25 }, "bang+=0.05")
        .to(branco, { clipPath: "circle(75% at 50% 50%)", duration: 0.5, ease: EASE_TRANSFORMA }, 1.3)
        .to([letras, studio], { fill: "#000", duration: 0.25 }, 1.36);
      tocarRef.current = () => tl.restart();

      const io = new IntersectionObserver(
        ([e]) => {
          if (!e.isIntersecting) return;
          tl.restart();
          io.disconnect();
        },
        { threshold: 0.6 }
      );
      io.observe(palco);
      return () => io.disconnect();
    }, palco);

    return () => ctx.revert();
  }, []);

  return (
    <button
      ref={palcoRef}
      type="button"
      onClick={() => tocarRef.current()}
      aria-label="Tocar de novo a abertura do site"
      className="abertura capa aspect-[16/10] w-full cursor-pointer"
    >
      <span className="capa-marcador abertura-marcador">( motion ) 01</span>
      <span aria-hidden className="abertura-branco" />
      <span aria-hidden className="abertura-ponto" />
      <span aria-hidden className="abertura-marca">
        <NadaWordmark className="w-full" />
      </span>
    </button>
  );
}
