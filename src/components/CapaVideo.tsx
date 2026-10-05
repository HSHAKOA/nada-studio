"use client";

import { useEffect, useRef } from "react";
import { MQ, movimentoLiberado } from "@/lib/motion";

// No toque, um filme por vez: o da capa que está no meio da tela.
let tocando: HTMLVideoElement | null = null;

// O filme da capa: toca sozinho, em loop e sem som, enquanto a capa está na
// tela. Não baixa nada antes disso (sem `src` até a primeira vez). Fora da
// tela, pausa. Com movimento reduzido ou economia de dados, fica o pôster.
// O primeiro quadro do filme é o próprio pôster: a troca não aparece.
// `faixa`: com mouse também, só toca a capa que cruza o meio da tela (capa em
// pé, que é alta: duas linhas delas não tocam ao mesmo tempo).
export default function CapaVideo({ src, pequeno, faixa }: { src: string; pequeno?: string; faixa?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    const capa = video?.closest<HTMLElement>(".capa");
    const conexao = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (!video || !capa || !movimentoLiberado() || conexao?.saveData) return;

    const mouse = matchMedia(MQ.mouse).matches;
    const fonte = pequeno && matchMedia(MQ.mobile).matches ? pequeno : src;
    const poster = video.parentElement?.querySelector("img");
    let naTela = false;

    // O filme espera a página e o próprio pôster terminarem de carregar: no
    // 4G ele disputava banda com a capa e atrasava a primeira pintura dela.
    const liberado = () => document.readyState === "complete" && (!poster || poster.complete);
    const tocar = () => {
      if (!naTela || !liberado()) return;
      if (!video.getAttribute("src")) video.src = fonte;
      if (!mouse) {
        if (tocando && tocando !== video) tocando.pause();
        tocando = video;
      }
      video.play().catch(() => {});
    };
    const parar = () => {
      video.pause();
      if (tocando === video) tocando = null;
    };

    // Mouse: toca com metade da capa na tela (várias podem tocar juntas).
    // Toque: só a capa que cruza a faixa do meio da tela.
    const io = new IntersectionObserver(
      ([e]) => {
        naTela = e.isIntersecting;
        if (naTela) tocar();
        else parar();
      },
      mouse ? (faixa ? { rootMargin: "-45% 0px -45% 0px" } : { threshold: 0.5 }) : { rootMargin: "-40% 0px -40% 0px" }
    );
    io.observe(capa);
    window.addEventListener("load", tocar);
    poster?.addEventListener("load", tocar);

    return () => {
      io.disconnect();
      window.removeEventListener("load", tocar);
      poster?.removeEventListener("load", tocar);
      parar();
    };
  }, [src, pequeno, faixa]);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      disablePictureInPicture
      disableRemotePlayback
      tabIndex={-1}
      aria-hidden
      onPlaying={(e) => e.currentTarget.classList.remove("opacity-0")}
      className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300"
    />
  );
}
