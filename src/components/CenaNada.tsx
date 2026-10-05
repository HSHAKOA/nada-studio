"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CAIXA_NADA, LETRAS_NADA } from "@/components/NadaWordmark";
import { EASE, MQ, movimentoLiberado } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

// Profundidade de partida de cada letra, em múltiplos da perspectiva, e o
// giro no eixo vertical. Cada uma num plano: o conjunto parece um espaço.
const LONGE = [2.6, 3.5, 4.4, 3.0];
const GIRO = [16, -9, 11, -14];
// Quem chega primeiro: N, último A, primeiro A, D (ordem do array: N A D A).
const CHEGADA = [0, 0.08, 0.1, 0.04];

// "NADA" do Como funciona, com as letras do logotipo (não fonte).
// Desktop/tablet: um palco fixo atrás do Problema e do Como funciona. As
// letras começam longe, em planos diferentes, em contorno quase apagado;
// avançam com a rolagem, cada uma no seu tempo, até a palavra passar das
// bordas da tela (sem texto na frente nesse trecho); depois recuam juntas e
// assentam como fundo dos passos. Celular: as quatro letras em coluna,
// alternando os lados, cada uma avança uma vez quando chega na tela.
// Movimento reduzido: a palavra parada, apagada, atrás do texto.
export default function CenaNada({ children }: { children: React.ReactNode }) {
  const cenaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cena = cenaRef.current;
    if (!cena || !movimentoLiberado()) return;
    const palco = cena.querySelector<HTMLElement>(".nada-plano")!;
    const letras = gsap.utils.toArray<SVGSVGElement>(".nada-letra", cena);
    const mm = gsap.matchMedia();

    mm.add(MQ.tablet, () => {
      const p = () => palco.clientWidth * 0.9; // perspectiva em px (a mesma do CSS: 90vw)
      // Entrada da página: as letras aparecem já no plano de longe.
      gsap.fromTo(
        letras,
        { autoAlpha: 0, z: (i) => -LONGE[i] * p(), rotationY: (i) => GIRO[i] },
        { autoAlpha: 0.22, duration: 1.4, ease: "power2.out", stagger: 0.08 }
      );

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: cena, start: 0, end: "bottom bottom", scrub: 0.8, invalidateOnRefresh: true },
      });
      // Longe, as letras se juntam no vazio à direita do texto; chegando,
      // o ponto de fuga volta pro centro e a palavra toma a tela inteira.
      tl.fromTo(palco, { perspectiveOrigin: "74% 54%" }, { perspectiveOrigin: "50% 46%", duration: 0.5, ease: "power1.inOut" }, 0);
      letras.forEach((letra, i) => {
        // Aproximação: cada letra no seu tempo.
        tl.fromTo(
          letra,
          { z: () => -LONGE[i] * p(), rotationY: GIRO[i], opacity: 0.22 },
          { z: 0, rotationY: 0, opacity: 0.55, duration: 0.38, ease: "power2.inOut", immediateRender: false },
          0.04 + CHEGADA[i]
        );
      });
      // Assentamento: recuam juntas para um plano só e apagam até virar fundo.
      tl.to(letras, { z: () => -0.38 * p(), opacity: 0.09, duration: 0.36, ease: "power2.inOut" }, 0.64);
    });

    mm.add(MQ.mobile, () => {
      letras.forEach((letra) => {
        gsap.set(letra, { autoAlpha: 0, scale: 0.82 });
        ScrollTrigger.create({
          trigger: letra,
          start: "top 88%",
          once: true,
          onEnter: () => gsap.to(letra, { autoAlpha: 1, scale: 1, duration: 1.3, ease: EASE }),
        });
      });
    });

    return () => mm.revert();
  }, []);

  const [X, Y, W, H] = CAIXA_NADA;

  return (
    <div ref={cenaRef} className="nada-cena">
      <div aria-hidden className="nada-palco">
        <div className="nada-plano">
          <div className="nada-palavra">
            {LETRAS_NADA.map(({ caixa: [x, y, w, h], d }, i) => (
              <svg
                key={i}
                data-i={i}
                className="nada-letra"
                viewBox={`${x} ${y} ${w} ${h}`}
                style={
                  {
                    "--x": `${((x - X) / W) * 100}%`,
                    "--y": `${((y - Y) / H) * 100}%`,
                    "--w": `${(w / W) * 100}%`,
                    "--h": `${(h / H) * 100}%`,
                  } as React.CSSProperties
                }
              >
                <path d={d} vectorEffect="non-scaling-stroke" />
              </svg>
            ))}
          </div>
        </div>
      </div>
      <div className="nada-conteudo">{children}</div>
    </div>
  );
}
