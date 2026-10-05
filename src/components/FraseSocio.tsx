"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DUR, EASE, movimentoLiberado } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger, SplitText);

// Tempo entre o começo da primeira metade e o da segunda: a pausa de quem
// fala e depois conclui.
const PAUSA = 0.6;

// A frase do sócio em duas batidas: a primeira metade sobe pela própria linha
// de base (o gesto dos títulos do site) e a segunda vem um tempo depois. Um
// disparo, quando a frase entra na tela. `atraso` separa as frases que
// aparecem lado a lado. Movimento reduzido ou sem JS: a frase inteira, parada.
export default function FraseSocio({ frase, atraso = 0 }: { frase: readonly [string, string]; atraso?: number }) {
  const ref = useRef<HTMLQuoteElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !movimentoLiberado()) return;
    const [primeira, segunda] = Array.from(el.children);

    const ctx = gsap.context(() => {
      SplitText.create([primeira, segunda], {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        // Rótulo ARIA não vale em <span>: o texto das linhas fica legível como está.
        aria: "none",
        onSplit(self) {
          el.classList.add("is-split");
          const linhas = (metade: Element) => self.lines.filter((linha) => metade.contains(linha));
          const sobe = () => ({ yPercent: 110, duration: DUR.entrada, ease: EASE, stagger: 0.08 });
          return gsap
            .timeline({ scrollTrigger: { trigger: el, start: "top 90%", once: true } })
            .from(linhas(primeira), sobe(), atraso)
            .from(linhas(segunda), sobe(), atraso + PAUSA);
        },
      });
    }, el);

    return () => ctx.revert();
  }, [atraso]);

  return (
    <blockquote ref={ref} className="frase-socio mt-6 text-[clamp(20px,2vw,24px)] font-medium leading-snug">
      <span className="block">“{frase[0]}</span>
      <span className="block">{frase[1]}”</span>
    </blockquote>
  );
}
