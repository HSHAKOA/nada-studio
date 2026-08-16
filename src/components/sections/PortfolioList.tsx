"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROJETOS, SELO_TIPO, type Projeto } from "@/data/portfolio";

gsap.registerPlugin(ScrollTrigger);

const MOBILE_BREAKPOINT = 768;

function reduzido() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function Bloco({ rotulo, texto }: { rotulo: string; texto: string }) {
  return (
    <div data-bloco>
      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-black/60">
        {rotulo}
      </p>
      <p className="prose-measure mt-2 text-[16px] leading-relaxed text-black/75">
        {texto}
      </p>
    </div>
  );
}

export default function PortfolioList() {
  const [aberto, setAberto] = useState<string | null>(null);
  const listaRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const painelRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Entrada das linhas no scroll.
  useEffect(() => {
    if (reduzido()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-linha]",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: listaRef.current, start: "top 85%", once: true },
        }
      );
    }, listaRef);

    return () => ctx.revert();
  }, []);

  // Expand/collapse + o peso da linha ativa.
  useEffect(() => {
    const semAnimacao = reduzido();

    const ctx = gsap.context(() => {
      Object.entries(painelRefs.current).forEach(([id, painel]) => {
        if (!painel) return;
        const estaAberto = id === aberto;
        const blocos = painel.querySelectorAll("[data-bloco]");

        if (semAnimacao) {
          gsap.set(painel, { height: estaAberto ? "auto" : 0 });
          gsap.set(blocos, { autoAlpha: estaAberto ? 1 : 0 });
          return;
        }

        if (estaAberto) {
          gsap.to(painel, { height: "auto", duration: 0.55, ease: "power3.inOut" });
          gsap.to(blocos, {
            autoAlpha: 1,
            duration: 0.4,
            ease: "power2.out",
            stagger: 0.05,
            delay: 0.1,
          });
        } else {
          gsap.to(blocos, { autoAlpha: 0, duration: 0.2, ease: "power2.in" });
          gsap.to(painel, { height: 0, duration: 0.55, ease: "power3.inOut" });
        }
      });

      // Linha aberta fica cheia, as outras recuam. Sem item aberto, todas voltam.
      const linhas = listaRef.current?.querySelectorAll("[data-linha]") ?? [];
      linhas.forEach((linha) => {
        const id = linha.getAttribute("data-linha");
        const alvo = !aberto || id === aberto ? 1 : 0.4;
        if (semAnimacao) gsap.set(linha, { opacity: 1 });
        else gsap.to(linha, { opacity: alvo, duration: 0.4, ease: "power2.out" });
      });
    }, listaRef);

    return () => ctx.revert();
  }, [aberto]);

  function alternar(projeto: Projeto) {
    const abrindo = aberto !== projeto.id;
    setAberto(abrindo ? projeto.id : null);

    // No mobile o item aberto pode ficar fora da tela: leva ele pro topo.
    if (!abrindo || window.innerWidth >= MOBILE_BREAKPOINT) return;
    const item = itemRefs.current[projeto.id];
    if (!item) return;
    window.requestAnimationFrame(() => {
      item.scrollIntoView({
        behavior: reduzido() ? "auto" : "smooth",
        block: "start",
      });
    });
  }

  return (
    <ul ref={listaRef} className="mt-16 border-t border-black/15">
      {PROJETOS.map((projeto) => {
        const estaAberto = aberto === projeto.id;
        const painelId = `projeto-${projeto.id}`;

        return (
          <li
            key={projeto.id}
            data-linha={projeto.id}
            ref={(el) => {
              itemRefs.current[projeto.id] = el;
            }}
            className="border-b border-black/15"
          >
            <button
              type="button"
              onClick={() => alternar(projeto)}
              aria-expanded={estaAberto}
              aria-controls={painelId}
              className="group flex w-full min-h-[44px] items-baseline gap-4 py-7 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black md:py-8"
            >
              <span className="w-8 shrink-0 text-sm text-black/40 transition-transform duration-[400ms] ease-out md:group-hover:translate-x-1">
                {projeto.num}
              </span>

              <span className="min-w-0 flex-1">
                <h2 className="inline text-[clamp(20px,2.4vw,28px)] font-bold tracking-tight">
                  {/* Sublinhado que cresce da esquerda: um span de 1px escalado
                      no eixo X, pra não mexer no layout do texto. */}
                  <span className="relative inline-block">
                    {projeto.nome}
                    <span
                      aria-hidden
                      className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-black transition-transform duration-[400ms] ease-out md:group-hover:scale-x-100"
                    />
                  </span>
                </h2>
                <span className="mt-1 block text-sm text-black/60">
                  {projeto.subtitulo}
                </span>
              </span>

              <span className="hidden shrink-0 text-[11px] uppercase tracking-[0.2em] text-black/60 sm:block">
                {SELO_TIPO[projeto.tipo]}
              </span>

              <span className="shrink-0 text-sm text-black/60">
                {estaAberto ? "Fechar" : "Saber mais"}
              </span>
            </button>

            {/* Fechado por altura, nunca removido do DOM. */}
            <div
              id={painelId}
              ref={(el) => {
                painelRefs.current[projeto.id] = el;
              }}
              aria-hidden={!estaAberto}
              style={{ height: 0, overflow: "hidden" }}
            >
              <div className="grid gap-8 pb-10 pl-4 sm:pl-12 md:grid-cols-12">
                {/* Imagem do Projeto */}
                <div data-bloco className="md:col-span-4">
                  <div className="overflow-hidden rounded-2xl border border-black/10 shadow-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={projeto.imagem}
                      alt={projeto.nome}
                      className="h-44 sm:h-52 w-full object-cover"
                      style={{ objectPosition: projeto.imagemPos || "center center" }}
                    />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {projeto.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-black/10 bg-black/[0.03] px-2.5 py-0.5 text-[11px] font-medium text-black/70"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Textos e Detalhes */}
                <div className="flex flex-col gap-5 md:col-span-8">
                  <Bloco rotulo="O problema" texto={projeto.problema} />
                  <Bloco rotulo="O que a gente fez" texto={projeto.solucao} />
                  {projeto.resultado ? (
                    <Bloco rotulo="O que mudou" texto={projeto.resultado} />
                  ) : null}

                  {projeto.tecnica ? (
                    <p data-bloco className="text-sm text-black/60 italic">
                      Especificação: {projeto.tecnica}
                    </p>
                  ) : null}

                  {projeto.link && projeto.linkLabel ? (
                    <div data-bloco className="pt-2">
                      <a
                        href={projeto.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        tabIndex={estaAberto ? 0 : -1}
                        className="btn btn-primary inline-flex items-center gap-2"
                      >
                        <span>{projeto.linkLabel}</span>
                        <span>→</span>
                      </a>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
