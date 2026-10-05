"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BURACO_NEGRO, type EstadoCena } from "./buraco-negro/config";
import { CONTEXTO, economiaDeDados, quandoLivre } from "./buraco-negro/carregar";
import type { Cena } from "./buraco-negro/cena";
import { EASE, MQ, movimentoLiberado } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

function raioAtual() {
  const { desktop, tablet, celular } = BURACO_NEGRO.viajante.raio;
  if (matchMedia(MQ.desktop).matches) return desktop;
  return matchMedia(MQ.tablet).matches ? tablet : celular;
}

// O caminho do centro do buraco, em fração da tela: entra à direita, perto do
// título, e desce cruzando até a esquerda de baixo.
const CAMINHO = [
  [0.84, 0.36],
  [0.6, 0.62],
  [0.3, 0.48],
  [0.14, 0.74],
] as const;

// Um buraco negro pequeno que atravessa o começo da página Motion conforme a
// página desce, com o disco acendendo no caminho, e some antes dos vídeos. É
// a mesma cena do manifesto do Sobre (cena.ts) num canvas pequeno, desenhada
// invertida sob mix-blend-mode: difference: no papel ele é preto e, onde
// passa por cima de texto, a letra vira branca. O quadrado preso (sticky) no
// topo do trilho anda por transform; nada de pin. Só com movimento liberado,
// WebGL 2 e sem economia de dados; o three só é baixado com a página carregada.
export default function BuracoViajante({ children }: { children: React.ReactNode }) {
  const raizRef = useRef<HTMLDivElement>(null);
  const buracoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raiz = raizRef.current;
    const buraco = buracoRef.current;
    if (!raiz || !buraco || !movimentoLiberado() || economiaDeDados()) return;

    const estado: EstadoCena = { progresso: 0, ponteiroX: 0, ponteiroY: 0, impulso: 0, explosao: 0 };
    const canvas = document.createElement("canvas");
    const mm = gsap.matchMedia();
    let cena: Cena | null = null;
    let cancelado = false;
    let iniciada = false;
    let visivel = false;
    let lado = 0;

    const medir = () => {
      const raio = raioAtual();
      lado = Math.round(raio * BURACO_NEGRO.palco * 2);
      buraco.style.width = `${lado}px`;
      buraco.style.height = `${lado}px`;
      cena?.redimensionar(lado, lado, { x: lado / 2, y: lado / 2, raio });
    };

    const tick = (_tempo: number, deltaMs: number) => {
      if (!visivel || !cena) return;
      cena.atualizar(Math.min(deltaMs, 100) / 1000, estado);
    };

    const ligarMovimento = () => {
      mm.add("all", () => {
        // Nasce do próprio centro, como o do Sobre.
        gsap.fromTo(canvas, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 1.6, delay: 0.3, ease: EASE });

        // O caminho anda com a página. Termina quando o fim do trecho chega no
        // pé da tela: ele some antes de os trabalhos aparecerem.
        const ponto = (i: number, eixo: 0 | 1) => () =>
          CAMINHO[i][eixo] * (eixo === 0 ? window.innerWidth : window.innerHeight) - lado / 2;
        gsap.set(buraco, { x: ponto(0, 0), y: ponto(0, 1), scale: 0.85 });
        const tl = gsap.timeline({
          scrollTrigger: { trigger: raiz, start: "top top", end: "bottom bottom", scrub: 0.8, invalidateOnRefresh: true },
        });
        for (let i = 1; i < CAMINHO.length; i++) {
          tl.to(buraco, { x: ponto(i, 0), y: ponto(i, 1), ease: "sine.inOut", duration: 1 }, i - 1);
        }
        tl.to(buraco, { scale: 1.1, ease: "none", duration: CAMINHO.length - 1 }, 0)
          .to(estado, { progresso: 1, ease: "none", duration: (CAMINHO.length - 1) * 0.6 }, 0)
          .to(buraco, { autoAlpha: 0, ease: "power1.in", duration: 0.4 }, CAMINHO.length - 1.4);
      });
      gsap.ticker.add(tick);
    };

    const iniciar = async () => {
      await quandoLivre();
      if (cancelado) return;
      const gl = canvas.getContext("webgl2", CONTEXTO);
      if (!gl) return;
      const leve = matchMedia(MQ.mobile).matches || (navigator.hardwareConcurrency || 8) <= 4;
      try {
        const { criarCena } = await import("./buraco-negro/cena");
        const criada = await criarCena(canvas, gl, leve, BURACO_NEGRO.viajante.cores);
        if (cancelado) return criada.destruir();
        cena = criada;
      } catch (erro) {
        // Sem a cena, a página fica como antes.
        if (process.env.NODE_ENV === "development") console.error(erro);
        gl.getExtension("WEBGL_lose_context")?.loseContext();
        return;
      }
      buraco.append(canvas);
      medir();
      ligarMovimento();
    };

    const ro = new ResizeObserver(() => {
      const antes = lado;
      medir();
      if (cena && lado !== antes) ScrollTrigger.refresh();
    });
    ro.observe(raiz);

    // Só desenha com o trilho na tela; o three só vem quando ele chega perto.
    const io = new IntersectionObserver(
      ([e]) => {
        visivel = e.isIntersecting;
        if (!visivel || iniciada) return;
        iniciada = true;
        iniciar();
      },
      { rootMargin: "200px 0px" }
    );
    io.observe(raiz);

    return () => {
      cancelado = true;
      io.disconnect();
      ro.disconnect();
      gsap.ticker.remove(tick);
      mm.revert();
      cena?.destruir();
      canvas.remove();
      buraco.style.removeProperty("width");
      buraco.style.removeProperty("height");
    };
  }, []);

  return (
    <div ref={raizRef} className="viajante">
      <div aria-hidden className="viajante-trilho">
        <div ref={buracoRef} className="viajante-buraco" />
      </div>
      {children}
    </div>
  );
}
