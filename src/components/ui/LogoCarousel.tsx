"use client";

import { useEffect, useRef, useState } from "react";
import type { ComponentType } from "react";
import gsap from "gsap";
import "./LogoCarousel.css";

export type Logo = {
  name: string;
  id: number;
  img: ComponentType<{ className?: string }>;
};

export type LogoCarouselProps = {
  logos: Logo[];
  columnCount?: number;
};

const CICLO_MS = 2200;

// Distribui logos em N colunas (round-robin), garantindo que nenhuma coluna
// fique vazia. Determinístico de propósito — a "distribuição aleatória" do
// componente original usava Math.random() na primeira renderização, o que
// dá resultado diferente no servidor e no cliente e quebra a hidratação. A
// variedade visual já vem do atraso escalonado por coluna, não precisa de
// aleatoriedade na ordem.
function distribuirEmColunas(logos: Logo[], colunas: number): Logo[][] {
  const grupos: Logo[][] = Array.from({ length: colunas }, () => []);
  logos.forEach((logo, i) => grupos[i % colunas].push(logo));
  return grupos.map((grupo) => (grupo.length ? grupo : logos.slice(0, 1)));
}

function Coluna({ logos, atrasoMs }: { logos: Logo[]; atrasoMs: number }) {
  const [index, setIndex] = useState(0);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logos.length <= 1) return;
    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduzido) return;

    let intervalId: ReturnType<typeof setInterval> | undefined;

    function trocar() {
      const el = logoRef.current;
      if (!el) {
        setIndex((i) => (i + 1) % logos.length);
        return;
      }
      gsap
        .timeline()
        .to(el, { autoAlpha: 0, y: -8, duration: 0.3, ease: "power2.in" })
        .call(() => setIndex((i) => (i + 1) % logos.length))
        .fromTo(el, { y: 8 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" });
    }

    const timeoutId = setTimeout(() => {
      trocar();
      intervalId = setInterval(trocar, CICLO_MS);
    }, atrasoMs);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [logos, atrasoMs]);

  const ativo = logos[index];
  if (!ativo) return null;
  const Img = ativo.img;

  return (
    <div className="logo-carousel__cell">
      <div ref={logoRef} className="logo-carousel__logo">
        <Img aria-hidden="true" />
      </div>
    </div>
  );
}

export default function LogoCarousel({ logos, columnCount = 2 }: LogoCarouselProps) {
  const [colunas] = useState(() => distribuirEmColunas(logos, columnCount));

  return (
    <div
      className="logo-carousel"
      style={{ gridTemplateColumns: `repeat(${columnCount}, 1fr)` }}
      role="img"
      aria-label={`Ferramentas: ${logos.map((l) => l.name).join(", ")}`}
    >
      {colunas.map((logosColuna, i) => (
        <Coluna key={i} logos={logosColuna} atrasoMs={i * 350} />
      ))}
    </div>
  );
}
