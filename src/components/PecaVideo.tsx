"use client";

import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { flushSync } from "react-dom";
import Image from "next/image";
import CapaVideo from "./CapaVideo";

// Só uma peça toca com som por vez: abrir outra devolve a anterior à prévia.
let fecharAtual: (() => void) | null = null;

type Props = {
  titulo: string;
  poster: string;
  previa: string;
  previaPequena?: string;
  inteira: string;
  duracao?: string;
  emPe?: boolean;
  children: ReactNode; // a legenda
};

// Peça de vídeo da página Motion. No cartão, a prévia toca muda em loop
// (CapaVideo). O clique troca pela peça inteira no mesmo quadro, com som e os
// controles do navegador: nada dela é baixado antes disso. Fora da tela ela
// pausa; no fim, volta a prévia. Sem JS, o link abre o próprio arquivo.
export default function PecaVideo({ titulo, poster, previa, previaPequena, inteira, duracao, emPe, children }: Props) {
  const [tocando, setTocando] = useState(false);
  const filmeRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const filme = filmeRef.current;
    if (!tocando || !filme) return;
    const fechar = () => setTocando(false);
    fecharAtual = fechar;
    const io = new IntersectionObserver(([e]) => !e.isIntersecting && filme.pause());
    io.observe(filme);
    return () => {
      io.disconnect();
      if (fecharAtual === fechar) fecharAtual = null;
    };
  }, [tocando]);

  function tocar(e: MouseEvent) {
    // Ctrl, Cmd ou Shift: o navegador abre o arquivo em outra aba ou janela.
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    fecharAtual?.();
    // O play tem de sair de dentro do clique, senão o navegador barra o som.
    flushSync(() => setTocando(true));
    // Se mesmo assim barrar, ficam os controles: a pessoa dá o play.
    filmeRef.current?.play().catch(() => {});
  }

  return (
    <>
      <div
        data-entra="imagem"
        className={`capa capa-filme ${emPe ? "capa-em-pe aspect-[9/16]" : "capa-larga aspect-[16/10]"}`}
      >
        <div className="capa-miolo">
          <div className="capa-imagem">
            <Image
              src={poster}
              alt=""
              fill
              sizes={emPe ? "(min-width: 768px) 360px, 100vw" : "(min-width: 768px) 50vw, 100vw"}
              className="object-cover"
            />
            {tocando ? (
              <video
                ref={filmeRef}
                src={inteira}
                controls
                playsInline
                aria-label={titulo}
                onEnded={() => setTocando(false)}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <CapaVideo src={previa} pequeno={previaPequena} faixa={emPe} />
            )}
          </div>
        </div>
        {/* O quadro inteiro é clicável; quem usa teclado tem o link de baixo. */}
        {!tocando && <a href={inteira} onClick={tocar} tabIndex={-1} aria-hidden className="absolute inset-0 z-[4]" />}
      </div>
      {children}
      <a href={inteira} onClick={tocar} className="link-u mt-1 inline-block py-3 text-sm font-medium">
        Ver com som{duracao && ` · ${duracao}`}{" "}
        <span className="seta" aria-hidden>
          →
        </span>
      </a>
    </>
  );
}
