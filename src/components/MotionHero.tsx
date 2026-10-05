"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import SectionMarker from "@/components/SectionMarker";
import { MOTION, sectionMarkers } from "@/data/content";
import { passarLuz } from "@/lib/luz";
import { EASE, movimentoLiberado } from "@/lib/motion";

gsap.registerPlugin(SplitText);

// Ritmo da digitação: o intervalo de cada letra, numa variação fixa pra não
// soar mecânico (s).
const TECLAS = [0.07, 0.05, 0.09, 0.06, 0.05, 0.08];

// Título da página Motion montado como uma edição. A primeira frase chega
// letra por letra, cada uma subindo pela própria linha de base e encaixando
// no lugar. A segunda é digitada, com o cursor colado na última letra; no fim
// o cursor sai e uma luz passa por ela uma vez. Movimento reduzido: as duas
// frases paradas.
export default function MotionHero() {
  const tituloRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const titulo = tituloRef.current;
    if (!titulo || !movimentoLiberado()) return;
    const [primeira, segunda] = gsap.utils.toArray<HTMLElement>(".corte-frase > span", titulo);
    const ctx = gsap.context(() => {}, titulo);
    let limparLuz = () => {};
    let cancelado = false;

    // Divide depois das fontes: a quebra de linha da máscara é a da fonte final.
    document.fonts.ready.then(() => {
      if (cancelado) return;
      ctx.add(() => {
        const chegada = SplitText.create(primeira, { type: "lines,words,chars", mask: "lines" });
        const digitada = SplitText.create(segunda, { type: "words,chars", charsClass: "tecla" });
        const teclas = digitada.chars as HTMLElement[];
        gsap.set([primeira, segunda], { autoAlpha: 1 });
        gsap.set(teclas, { autoAlpha: 0 });

        const tl = gsap.timeline({ delay: 0.15 });
        tl.from(chegada.chars, { yPercent: 110, duration: 0.8, ease: EASE, stagger: 0.035 });

        // A digitação começa com a primeira frase quase assentada.
        let t = tl.duration() - 0.3;
        teclas.forEach((tecla, i) => {
          tl.call(
            () => {
              teclas[i - 1]?.classList.remove("digitando");
              gsap.set(tecla, { autoAlpha: 1 });
              tecla.classList.add("digitando");
            },
            undefined,
            t
          );
          t += TECLAS[i % TECLAS.length];
        });
        // O cursor sai e a luz passa pela frase digitada.
        tl.call(
          () => {
            teclas.at(-1)?.classList.remove("digitando");
            limparLuz = passarLuz(teclas);
          },
          undefined,
          t + 0.45
        );
      });
    });

    return () => {
      cancelado = true;
      limparLuz();
      ctx.revert();
    };
  }, []);

  const [frase1, frase2] = MOTION.titulo;

  return (
    <section className="section">
      <div className="wrap">
        <SectionMarker label="Motion" number={sectionMarkers.motion} />
        <h1 ref={tituloRef} className="motion-titulo">
          <span className="corte-frase">
            <span>{frase1}</span>
          </span>{" "}
          <span className="corte-frase">
            <span>{frase2}</span>
          </span>
        </h1>
        <p className="prose-measure mt-8 text-[clamp(18px,1.7vw,22px)] text-black/70">{MOTION.sub}</p>
      </div>
    </section>
  );
}
