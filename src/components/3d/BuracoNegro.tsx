"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BURACO_NEGRO, type Alvo, type EstadoCena } from "./buraco-negro/config";
import { CONTEXTO, economiaDeDados, quandoLivre } from "./buraco-negro/carregar";
import type { Cena } from "./buraco-negro/cena";
import { criarExplosao, suave } from "./buraco-negro/explosao";
import { EASE, MQ, movimentoLiberado } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

function enquadramento() {
  const { desktop, tablet, celular } = BURACO_NEGRO.enquadramento;
  if (matchMedia(MQ.desktop).matches) return desktop;
  return matchMedia(MQ.tablet).matches ? tablet : celular;
}

// O buraco negro atrás do manifesto: o NADA como o ponto onde tudo começa.
// O título (filho) continua HTML; o canvas fica num palco atrás dele, da
// largura da tela, posicionado pela medida do título.
// Computador e tablet: a narrativa anda com o scroll (só a sombra e o anel →
// o disco acende → a matéria chega) e, descendo pro bloco seguinte, a poeira
// explode e desce até virar o fio dele (explosao.ts). Celular: a mesma
// narrativa uma vez, no tempo. Mouse: o disco responde devagar, poucos graus.
// Movimento reduzido: um quadro parado, completo. O three só é baixado com a
// página carregada e o palco perto da tela; fora dela nada é desenhado.
export default function BuracoNegro({ children }: { children: React.ReactNode }) {
  const blocoRef = useRef<HTMLDivElement>(null);
  const palcoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bloco = blocoRef.current;
    const palco = palcoRef.current;
    const titulo = bloco?.firstElementChild;
    const camada = palco?.firstElementChild;
    if (!bloco || !palco || !(titulo instanceof HTMLElement) || !(camada instanceof HTMLElement) || economiaDeDados()) {
      return;
    }

    const { alivio, entrada, narrativa, scroll, explosao } = BURACO_NEGRO;
    const animada = movimentoLiberado();
    const leve = !animada || matchMedia(MQ.mobile).matches || (navigator.hardwareConcurrency || 8) <= 4;
    const estado: EstadoCena = { progresso: animada ? 0 : 1, ponteiroX: 0, ponteiroY: 0, impulso: 0, explosao: 0 };
    const inicio = performance.now();
    const canvas = document.createElement("canvas");
    const mm = gsap.matchMedia();
    let cena: Cena | null = null;
    let cancelado = false;
    let iniciada = false;
    let visivel = false;
    let ultimoY = window.scrollY;
    let medida = "";
    let alvo: Alvo = { x: 0, y: 0, raio: 1 };

    // Posição e tamanho saem do título: o enquadramento é em em do corpo dele.
    const medir = () => {
      const corpo = parseFloat(getComputedStyle(titulo).fontSize);
      const { x, y, raio } = enquadramento();
      const meia = Math.round(raio * corpo * BURACO_NEGRO.palco);
      const t = titulo.getBoundingClientRect();
      const b = bloco.getBoundingClientRect();
      palco.style.top = `${t.top - b.top + y * corpo - meia}px`;
      palco.style.height = `${meia * 2}px`;
      // Só aparece já no lugar: o palco escondido não conta como layout shift.
      palco.style.visibility = "visible";
      const p = palco.getBoundingClientRect();
      alvo = { x: t.left + x * corpo - p.left, y: meia, raio: raio * corpo };
      const nova = `${p.width}|${alvo.x}|${alvo.raio}`;
      if (!cena || nova === medida) return;
      const primeira = medida === "";
      medida = nova;
      cena.redimensionar(p.width, meia * 2, alvo);
      gsap.set(camada, { transformOrigin: `${alvo.x}px ${alvo.y}px` });
      // Redimensionar limpa o canvas: parado, desenha de novo; animado, o
      // próximo quadro desenha e os gatilhos medem o palco novo.
      if (!animada) cena.atualizar(0, estado);
      else if (!primeira) ScrollTrigger.refresh();
    };

    let pedido = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(pedido);
      pedido = requestAnimationFrame(medir);
    });
    ro.observe(bloco); // o corpo do título muda com a largura
    ro.observe(palco); // a largura do palco é a da tela

    // Abaixo de ~42 quadros por segundo depois da entrada, a cena alivia.
    let medindo = false;
    let quadros = 0;
    let soma = 0;
    const vigiar = (ms: number) => {
      soma += ms;
      quadros += 1;
      if (quadros < alivio.quadros) return;
      const lenta = soma / quadros > alivio.limiteMs;
      soma = 0;
      quadros = 0;
      medindo = lenta && Boolean(cena?.aliviar());
    };

    const tick = (_tempo: number, deltaMs: number) => {
      if (!visivel || !cena) return;
      const dt = Math.min(deltaMs, 100) / 1000;
      const y = window.scrollY;
      estado.impulso = dt > 0 ? Math.min(1, Math.abs(y - ultimoY) / dt / scroll.velocidadeCheia) : 0;
      ultimoY = y;
      cena.atualizar(dt, estado);
      if (medindo) vigiar(deltaMs);
    };

    const ligarMovimento = () => {
      const atraso = Math.max(0, entrada.atraso - (performance.now() - inicio) / 1000);
      mm.add("all", () => {
        // A sombra nasce do próprio centro.
        gsap.fromTo(
          camada,
          { opacity: 0, scale: entrada.escala, rotation: entrada.giro },
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: entrada.duracao,
            delay: atraso,
            ease: EASE,
            onComplete: () => {
              medindo = true;
            },
          }
        );
      });

      // Nada → energia → matéria, enquanto o título passa pela tela. A
      // paralaxe leva o palco mais devagar que o texto: o buraco fica longe.
      mm.add(MQ.tablet, () => {
        gsap.to(estado, {
          progresso: 1,
          ease: "none",
          scrollTrigger: { trigger: palco, start: 0, end: "center 20%", scrub: 0.8, invalidateOnRefresh: true },
        });
        gsap.to(camada, {
          y: scroll.deslocamento,
          ease: "none",
          scrollTrigger: { trigger: bloco.closest("section") ?? bloco, start: 0, end: "bottom top", scrub: true },
        });

        // Passagem pro bloco seguinte: a poeira explode e vira o fio dele. O
        // fio fica escondido (--fio) até os grãos pousarem.
        const fio = document.querySelector<HTMLElement>("#pra-quem .regua-topo");
        if (!fio) return;
        const voo = criarExplosao(
          () => {
            const c = camada.getBoundingClientRect();
            return { x: c.left + alvo.x, y: c.top + alvo.y, raio: alvo.raio };
          },
          fio,
          Math.round(explosao.graos * (leve ? 0.5 : 1))
        );
        const desenhar = () => {
          voo.atualizar(estado.explosao);
          fio.style.setProperty("--fio", String(suave(0.86, 1, estado.explosao)));
        };
        desenhar();
        gsap.to(estado, {
          explosao: 1,
          ease: "none",
          onUpdate: desenhar,
          scrollTrigger: {
            trigger: palco,
            start: explosao.inicio,
            endTrigger: fio,
            end: explosao.fim,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
        return () => {
          voo.destruir();
          fio.style.removeProperty("--fio");
          estado.explosao = 0;
        };
      });

      mm.add(MQ.mobile, () => {
        gsap.to(estado, { progresso: 1, duration: narrativa.duracaoCelular, delay: atraso, ease: "power1.inOut" });
      });

      mm.add(MQ.ponteiroFino, () => {
        const mover = (e: PointerEvent) => {
          estado.ponteiroX = (e.clientX / window.innerWidth) * 2 - 1;
          estado.ponteiroY = (e.clientY / window.innerHeight) * 2 - 1;
        };
        window.addEventListener("pointermove", mover, { passive: true });
        return () => {
          window.removeEventListener("pointermove", mover);
          estado.ponteiroX = 0;
          estado.ponteiroY = 0;
        };
      });

      gsap.ticker.add(tick);
    };

    const iniciar = async () => {
      await quandoLivre();
      if (cancelado) return;
      const gl = canvas.getContext("webgl2", CONTEXTO);
      if (!gl) return;
      try {
        const { criarCena } = await import("./buraco-negro/cena");
        const criada = await criarCena(canvas, gl, leve);
        if (cancelado) return criada.destruir();
        cena = criada;
      } catch (erro) {
        // Sem a cena, o título fica sozinho, como antes.
        if (process.env.NODE_ENV === "development") console.error(erro);
        gl.getExtension("WEBGL_lose_context")?.loseContext();
        return;
      }
      camada.append(canvas);
      medir();
      if (animada) ligarMovimento();
    };

    const io = new IntersectionObserver(
      ([e]) => {
        visivel = e.isIntersecting;
        ultimoY = window.scrollY;
        if (!visivel || iniciada) return;
        iniciada = true;
        iniciar();
      },
      { rootMargin: "200px 0px" }
    );
    io.observe(palco);

    return () => {
      cancelado = true;
      cancelAnimationFrame(pedido);
      io.disconnect();
      ro.disconnect();
      gsap.ticker.remove(tick);
      mm.revert();
      cena?.destruir();
      canvas.remove();
      palco.style.removeProperty("top");
      palco.style.removeProperty("height");
      palco.style.removeProperty("visibility");
    };
  }, []);

  return (
    <div ref={blocoRef} className="buraco-bloco">
      {children}
      <div ref={palcoRef} aria-hidden className="buraco-palco">
        <div className="buraco-camada" />
      </div>
    </div>
  );
}
