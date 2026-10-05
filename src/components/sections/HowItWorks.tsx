"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import SectionMarker from "@/components/SectionMarker";
import { sectionMarkers, steps } from "@/data/content";
import { movimentoLiberado } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

// Os quatro passos são uma sequência: a linha de progresso se desenha conforme
// o scroll avança (horizontal no desktop, vertical no celular). Sem movimento,
// a linha já aparece inteira.
export default function HowItWorks() {
  const listaRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const lista = listaRef.current;
    if (!lista || !movimentoLiberado()) return;
    const st = ScrollTrigger.create({
      trigger: lista,
      start: "top 75%",
      end: "bottom 55%",
      onUpdate: (self) => lista.style.setProperty("--p", self.progress.toFixed(3)),
    });
    return () => st.kill();
  }, []);

  return (
    <section id="como-funciona" className="section">
      <div className="wrap">
        <SectionMarker label="Como funciona" number={sectionMarkers.howItWorks} />
        <h2 data-entra="titulo" className="max-w-2xl text-[clamp(32px,4.2vw,52px)]">
          Sem tecniquês. Do começo ao fim.
        </h2>

        <ol ref={listaRef} className="passos mt-16 grid gap-10 md:grid-cols-4 md:gap-8">
          <span aria-hidden className="passos-trilho" />
          {steps.map((step) => (
            <li key={step.number} className="pl-8 md:pl-0 md:pt-10">
              <span className="block text-3xl text-black/45" style={{ fontFamily: "var(--font-display)" }}>
                {step.number}
              </span>
              <h3 className="mt-3 text-xl">{step.title}</h3>
              <p className="mt-2 text-black/70">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
