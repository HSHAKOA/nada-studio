"use client";

import { Fragment, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Variacao } from "@/data/content";
import { passarLuz } from "@/lib/luz";
import { DUR, EASE, EASE_SAIDA, movimentoLiberado } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

// Quanto cada frase fica parada antes da próxima (s).
const PAUSA_S = 2.8;
// Brilho do cromo: uma passada dura 1,8 s; na última frase ela se repete a
// cada 4 s enquanto o título está na tela.
const BRILHO = { passada: 1800, ciclo: 4000 };

type Token = { texto: string; metal: boolean };

function tokenizar({ antes, metal, depois }: Variacao): Token[] {
  const antesWords = antes.trim().split(/\s+/).filter(Boolean);
  const restWords = (metal + depois).trim().split(/\s+/).filter(Boolean);
  return [
    ...antesWords.map((texto) => ({ texto, metal: false })),
    { texto: restWords[0], metal: true },
    ...restWords.slice(1).map((texto) => ({ texto, metal: false })),
  ];
}

// A curva de transformação do :root (--ease-inout), pras Web Animations.
const curva = () => getComputedStyle(document.documentElement).getPropertyValue("--ease-inout").trim();

// Uma passada do cromo: o degradê anda uma volta inteira pra direita (o fundo
// se repete a cada 150%), então a faixa clara cruza a palavra da esquerda pra
// direita e ela termina exatamente como começou.
const PASSADA: Keyframe[] = [{ backgroundPosition: "0% 0" }, { backgroundPosition: "-150% 0" }];

function brilhar(metal: HTMLElement | null, atrasoMs = 250) {
  return metal?.animate(PASSADA, { duration: BRILHO.passada, delay: atrasoMs, easing: curva() });
}

function brilharSempre(metal: HTMLElement | null, atrasoMs = 250) {
  return metal?.animate(
    [
      { backgroundPosition: "0% 0", easing: curva() },
      { backgroundPosition: "-150% 0", offset: BRILHO.passada / BRILHO.ciclo },
      { backgroundPosition: "-150% 0" },
    ],
    { duration: BRILHO.ciclo, delay: atrasoMs, iterations: Infinity }
  );
}

type Props = {
  fixa: string;
  variacoes: Variacao[];
  className?: string;
  id?: string;
};

// Título com uma linha fixa e frases que se revezam embaixo, cada uma com uma
// palavra em cromo (.metal). Na chegada, uma luz atravessa o título palavra
// por palavra e termina no cromo. As frases dão uma volta e param na última,
// onde o cromo segue brilhando de tempos em tempos (pausa fora da tela).
// Na home, espera a intro terminar. Movimento reduzido ou sem JS: só a última
// frase, parada, sem luz (é nela que o título termina, e na home é a
// resposta). O HTML já sai assim; a volta começa pela primeira.
export default function TituloRotativo({ fixa, variacoes, className, id }: Props) {
  const tituloRef = useRef<HTMLHeadingElement>(null);
  const fixaRef = useRef<HTMLSpanElement>(null);
  const trocaRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const titulo = tituloRef.current;
    const linhaFixa = fixaRef.current;
    const troca = trocaRef.current;
    if (!titulo || !linhaFixa || !troca || !movimentoLiberado()) return;

    const frases = gsap.utils.toArray<HTMLElement>("[data-var]", troca);
    const ctx = gsap.context(() => {});
    let sempre: Animation | undefined;
    // Passadas avulsas do cromo: canceladas se o título sair da página no meio.
    const passadas = new Set<Animation>();
    const umaPassada = (metal: HTMLElement | null, atrasoMs?: number) => {
      const a = brilhar(metal, atrasoMs);
      if (!a) return;
      passadas.add(a);
      a.onfinish = () => passadas.delete(a);
    };
    let limparLuz = () => {};

    function iniciar() {
      // O HTML marca a última frase como a lida (título parado). Com a volta,
      // quem é lida é a que está na tela, começando pela primeira.
      frases.forEach((frase, i) => {
        if (i === 0) frase.removeAttribute("aria-hidden");
        else frase.setAttribute("aria-hidden", "true");
      });
      ctx.add(() => {
        gsap.fromTo(frases[0], { yPercent: 105, autoAlpha: 1 }, { yPercent: 0, duration: DUR.entrada, ease: EASE });

        // A luz passa pela linha fixa e pela primeira frase, e termina no cromo.
        const palavras = gsap.utils.toArray<HTMLElement>("[data-palavra]", linhaFixa).concat(
          gsap.utils.toArray<HTMLElement>("[data-palavra]", frases[0])
        );
        limparLuz = passarLuz(palavras, {
          atrasoMs: 250,
          noCromo: (metal, chega) => {
            // O brilho do cromo cruza a palavra no meio da passada.
            const atraso = Math.max(0, chega - BRILHO.passada / 2);
            if (frases.length === 1) sempre = brilharSempre(metal, atraso);
            else umaPassada(metal, atraso);
          },
        });

        let atual = 0;
        const trocar = () => {
          const saindo = frases[atual];
          atual += 1;
          const entrando = frases[atual];
          if (!entrando) return;
          const metal = entrando.querySelector<HTMLElement>(".metal");
          const ultima = atual === frases.length - 1;
          gsap.to(saindo, { yPercent: -105, duration: 0.5, ease: EASE_SAIDA });
          gsap.set(saindo, { autoAlpha: 0, delay: 0.5 });
          gsap.fromTo(
            entrando,
            { yPercent: 105, autoAlpha: 1 },
            {
              yPercent: 0,
              duration: 0.7,
              delay: 0.35,
              ease: EASE,
              onStart: () => {
                if (ultima) sempre = brilharSempre(metal);
                else umaPassada(metal);
              },
            }
          );
          saindo.setAttribute("aria-hidden", "true");
          entrando.removeAttribute("aria-hidden");
        };
        // Uma volta só: a frase para na última, e só o cromo dela continua.
        const relogio = gsap.timeline({ delay: PAUSA_S + 0.6 });
        for (let i = 1; i < frases.length; i++) relogio.call(trocar, undefined, (i - 1) * (PAUSA_S + 1));
        ScrollTrigger.create({
          trigger: titulo,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            if (self.isActive) {
              relogio.resume();
              sempre?.play();
            } else {
              relogio.pause();
              sempre?.pause();
            }
          },
        });
      });
    }

    if (window.__nadaIntro) window.addEventListener("nada:intro", iniciar, { once: true });
    else iniciar();

    return () => {
      window.removeEventListener("nada:intro", iniciar);
      limparLuz();
      sempre?.cancel();
      passadas.forEach((a) => a.cancel());
      ctx.revert();
    };
  }, []);

  return (
    <h1 ref={tituloRef} id={id} className={className}>
      <span ref={fixaRef}>
        {fixa.split(" ").map((palavra, i, todas) => (
          <Fragment key={i}>
            <span data-palavra>{palavra}</span>
            {i < todas.length - 1 && " "}
          </Fragment>
        ))}
      </span>
      <br />
      <span ref={trocaRef} className="rotativo">
        {variacoes.map((variacao, v) => (
          <span key={v} data-var aria-hidden={v < variacoes.length - 1 || undefined}>
            {/* O espaço fica fora da palavra: dentro de um inline-block ele
                cai no fim da linha e some. */}
            {tokenizar(variacao).map((token, i, todos) => (
              <Fragment key={i}>
                <span className="inline-block">
                  <span data-palavra className={token.metal ? "metal" : undefined}>
                    {token.texto}
                  </span>
                </span>
                {i < todos.length - 1 && " "}
              </Fragment>
            ))}
          </span>
        ))}
      </span>
    </h1>
  );
}
