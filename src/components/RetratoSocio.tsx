"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MQ, movimentoLiberado } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

// Quanto a foto cresce dentro do quadro. Acima disso o cabelo encosta na borda.
// O hover usa o mesmo valor (.retrato em globals.css).
const ZOOM = 1.1;

// Retrato do sócio na página Equipe, em cor. Com mouse, a foto se aproxima
// quando o ponteiro passa por cima (CSS). No toque, onde não existe hover, ela
// se aproxima com o scroll: cresce dentro do quadro (que não se mexe) enquanto
// ele sobe do pé da tela até o meio, e recua se a pessoa rolar de volta. Os
// dois nunca somam: com mouse, o scroll não mexe na foto. Cresce a partir da
// altura da testa, pra cabeça não sair por cima. Movimento reduzido ou sem JS:
// a foto parada, inteira.
// `posicao`: object-position da foto no quadro (o rosto no meio).
export default function RetratoSocio({ src, alt, posicao }: { src: string; alt: string; posicao?: string }) {
  const quadroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const quadro = quadroRef.current;
    if (!quadro || !movimentoLiberado()) return;
    const mm = gsap.matchMedia();
    mm.add(`not all and ${MQ.mouse}`, () => {
      gsap.fromTo(
        quadro.querySelector("img"),
        { scale: 1 },
        {
          scale: ZOOM,
          ease: "none",
          scrollTrigger: { trigger: quadro, start: "top bottom", end: "center center", scrub: 0.6 },
        }
      );
    });
    return () => mm.revert();
  }, []);

  return (
    // Em pé e alto: a largura é limitada pra caber na tela inteiro.
    <div ref={quadroRef} data-entra="imagem" className="retrato capa mb-6 aspect-[9/16] max-w-[360px]">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="360px"
        className="origin-[50%_20%] object-cover"
        style={{ objectPosition: posicao }}
      />
    </div>
  );
}
