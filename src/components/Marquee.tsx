"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { movimentoLiberado } from "@/lib/motion";

const PHRASE = "do nada nasce tudo";
const VELOCIDADE = 50; // px/s em repouso

// Anda devagar e acelera (inclinando um pouco) conforme a velocidade do
// scroll, depois volta ao ritmo normal. Só roda na tela; com movimento
// reduzido, fica parada.
export default function Marquee() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track || !movimentoLiberado()) return;

    const setX = gsap.quickSetter(track, "x", "px");
    const setSkew = gsap.quickSetter(track, "skewX", "deg");
    let x = 0;
    let inclinacao = 0;
    let ultimoY = window.scrollY;
    let visivel = false;

    const tick = (_tempo: number, deltaMs: number) => {
      if (!visivel) return;
      const s = deltaMs / 1000;
      const y = window.scrollY;
      const velocidade = s > 0 ? (y - ultimoY) / s : 0;
      ultimoY = y;
      // Suaviza: o empurrão do scroll entra e sai sem tranco.
      inclinacao += (gsap.utils.clamp(-6, 6, velocidade / 250) - inclinacao) * 0.08;
      x -= VELOCIDADE * (1 + Math.abs(inclinacao) * 1.5) * s;
      const metade = track.scrollWidth / 2;
      if (-x >= metade) x += metade;
      setX(x);
      setSkew(-inclinacao);
    };

    const io = new IntersectionObserver(([e]) => {
      visivel = e.isIntersecting;
      ultimoY = window.scrollY;
    });
    io.observe(viewport);
    gsap.ticker.add(tick);

    return () => {
      io.disconnect();
      gsap.ticker.remove(tick);
    };
  }, []);

  const items = Array.from({ length: 8 }, () => PHRASE);

  return (
    <div ref={viewportRef} aria-hidden className="overflow-hidden border-y border-white/10 py-6">
      <div ref={trackRef} className="marquee-track">
        {[...items, ...items].map((text, i) => (
          <span
            key={i}
            className="mx-6 whitespace-nowrap text-[clamp(20px,4vw,36px)] font-medium"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {text}
            <span className="mx-6 inline-block align-middle text-white/30">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
