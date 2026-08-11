"use client";

import { useEffect, useRef } from "react";
import NadaWordmark from "./NadaWordmark";

// Largura que a marca ocupa no centro da tela, igual à da intro — assim a
// intro entrega a marca exatamente no tamanho em que esta assume.
const LARGURA_CENTRO = () => Math.min(window.innerWidth * 0.62, 560);

/**
 * A marca da navbar é a MESMA que aparece grande no centro do hero: no topo da
 * página ela está escalada e centralizada, e o scroll a traz de volta ao slot
 * da navbar. Um elemento só, sem FLIP e sem duas cópias trocando de lugar.
 */
export default function MarcaNavbar({
  aoProgredir,
}: {
  aoProgredir?: (p: number) => void;
}) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const marcaRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const link = linkRef.current;
    const marca = marcaRef.current;
    if (!link || !marca) return;

    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;

    function aplicar() {
      raf = 0;
      // Sem o transform, o elemento está no slot natural da navbar.
      marca!.style.transform = "";
      const slot = marca!.getBoundingClientRect();
      if (!slot.width) return;

      const distancia = window.innerHeight * 0.6;
      const p = reduzido ? 1 : Math.min(1, Math.max(0, window.scrollY / distancia));
      const restante = 1 - p;

      const escala = 1 + (LARGURA_CENTRO() / slot.width - 1) * restante;
      const dx = (window.innerWidth / 2 - (slot.left + slot.width / 2)) * restante;
      const dy = (window.innerHeight / 2 - (slot.top + slot.height / 2)) * restante;

      marca!.style.transform = `translate(${dx}px, ${dy}px) scale(${escala})`;
      // Gigante no meio da tela, o link cobriria a página inteira.
      link!.style.pointerEvents = p > 0.9 ? "" : "none";
      aoProgredir?.(p);
    }

    function agendar() {
      if (!raf) raf = requestAnimationFrame(aplicar);
    }

    aplicar();
    window.addEventListener("scroll", agendar, { passive: true });
    window.addEventListener("resize", agendar);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", agendar);
      window.removeEventListener("resize", agendar);
    };
  }, [aoProgredir]);

  return (
    <a ref={linkRef} href="#top" aria-label="NADA Studio — início">
      <span
        ref={marcaRef}
        className="block w-[120px] origin-center will-change-transform"
      >
        <NadaWordmark className="w-full" />
      </span>
    </a>
  );
}
