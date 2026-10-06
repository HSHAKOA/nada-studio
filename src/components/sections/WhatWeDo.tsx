"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Ponto from "@/components/Ponto";
import SectionMarker from "@/components/SectionMarker";
import { sectionMarkers, SERVICOS, SERVICOS_EMPRESAS } from "@/data/content";
import { MQ, movimentoLiberado } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

const BASE = 200; // diâmetro de desenho do ponto viajante (escala pra baixo = nítido)

// A resposta antes da história: logo depois do hero, os três serviços com o
// nome em letra grande (o mesmo desenho das frentes da página Motion) e, no
// pé, a porta das empresas. Sem ícone, sem cartão. O ponto final do título é
// o ponto da marca: no desktop ele chega de longe pelo vazio à direita, passa
// perto (inverte o que cruza) e pousa no fim da frase. Ver src/lib/ponto.ts.
export default function WhatWeDo() {
  const secaoRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const secao = secaoRef.current;
    if (!secao || !movimentoLiberado()) return;
    const viajante = secao.querySelector<HTMLElement>(".passagem-ponto");
    const mm = gsap.matchMedia();

    mm.add(MQ.tablet, () => {
      if (!viajante) return;
      // Onde o ponto final do título fica parado. Medido pelo layout
      // (offsetLeft/offsetTop até a seção), que ignora transform: medido na
      // tela, pegava a linha do título ainda deslocada pela entrada (SplitText)
      // e o pouso ficava abaixo do ponto. Procurado a cada medida: o SplitText
      // refaz as linhas.
      const alvo = () => {
        const final = secao.querySelector<HTMLElement>(".ponto-final")!;
        const d = final.getBoundingClientRect().width;
        let x = 0;
        let y = 0;
        let el: HTMLElement | null = final;
        while (el && el !== secao) {
          x += el.offsetLeft;
          y += el.offsetTop;
          el = el.offsetParent as HTMLElement | null;
        }
        return { x: x + d / 2, y: y + final.offsetHeight / 2, d, w: secao.offsetWidth };
      };

      // Um atributo só decide quem aparece, no CSS: "viajando" mostra o
      // viajante e esconde o ponto do título; "pousado", o contrário. Os dois
      // trocam no mesmo instante, e o GSAP só move o viajante. Antes, o do
      // título aparecia em 0,995 e o viajante só sumia em 1 (no meio, os dois
      // na tela, ou nenhum, com o difference de um sobre o outro), e o sumiço
      // gravado pelo GSAP saía de sincronia depois de um refresh.
      // "longe": a viagem ainda não começou e nenhum dos dois aparece. A seção
      // vem logo depois do hero, e o viajante parado na largada ficava na tela
      // junto com o ponto do hero, que ainda está caindo.
      const pousar = (progresso: number) => {
        const estado = progresso > 0.995 ? "pousado" : progresso > 0 ? "viajando" : "longe";
        if (secao.dataset.ponto !== estado) secao.dataset.ponto = estado;
      };

      const tl = gsap
        .timeline({
          scrollTrigger: {
            trigger: secao,
            // Começa depois que o ponto do hero saiu da tela (ele some com o
            // topo desta seção a ~65% da altura): um ponto por vez.
            start: "top 60%",
            end: "top 10%",
            scrub: 0.6,
            invalidateOnRefresh: true,
            // O refresh (resize, fonte, imagem) mexe no progresso sem passar
            // pelo onUpdate: confere de novo no fim.
            onRefresh: (self) => pousar(self.animation?.progress() ?? 0),
          },
          onUpdate: () => pousar(tl.progress()),
        })
        // Longe → perto: entra pela direita, pequeno, e cresce pelo vazio até
        // passar por cima do fim da frase (o difference inverte as letras).
        .fromTo(
          viajante,
          { x: () => alvo().w * 0.9 - BASE / 2, y: () => alvo().y - 190 - BASE / 2, scale: 0.03 },
          { x: () => alvo().x + 150 - BASE / 2, y: () => alvo().y - 40 - BASE / 2, scale: 0.9, duration: 0.55, ease: "power1.inOut" }
        )
        // Perto → longe: recua cruzando o fim da frase e vira o ponto final.
        .to(viajante, {
          x: () => alvo().x - BASE / 2,
          y: () => alvo().y - BASE / 2,
          scale: () => alvo().d / BASE,
          duration: 0.45,
          ease: "power3.inOut",
        });
      pousar(tl.progress());

      return () => {
        delete secao.dataset.ponto;
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={secaoRef} id="o-que-fazemos" className="section relative">
      <div className="wrap">
        <SectionMarker label="O que a gente faz" number={sectionMarkers.whatWeDo} />
        <h2 data-entra="titulo" className="max-w-2xl text-[clamp(32px,4.2vw,52px)]">
          A gente constrói. Você só usa<span aria-hidden className="ponto-final" />
        </h2>

        <ol data-entra="linha" className="regua-topo mt-14">
          {SERVICOS.map((servico) => (
            <li key={servico.num} data-entra="linha" className="regua grid gap-3 py-10 md:grid-cols-12 md:gap-8">
              <span className="text-sm text-black/40 md:col-span-1">{servico.num}</span>
              <h3 className="text-[clamp(36px,5vw,64px)] font-black leading-none tracking-[-0.035em] md:col-span-5">
                {servico.titulo}
              </h3>
              <p className="text-[17px] text-black/70 md:col-span-6 md:pt-2">
                {servico.descricao}
                {servico.href && (
                  <Link href={servico.href} className="link-u mt-1 block w-fit py-2 text-sm font-medium text-black">
                    {servico.rotulo} <span className="seta" aria-hidden>→</span>
                  </Link>
                )}
              </p>
            </li>
          ))}
        </ol>

        <p className="mt-10 text-[17px] text-black/70">
          {SERVICOS_EMPRESAS.texto}{" "}
          <Link href={SERVICOS_EMPRESAS.href} className="link-u inline-block py-2 font-medium text-black">
            {SERVICOS_EMPRESAS.link} <span className="seta" aria-hidden>→</span>
          </Link>
        </p>
      </div>
      <Ponto papel="passagem" className="passagem-ponto" />
    </section>
  );
}
