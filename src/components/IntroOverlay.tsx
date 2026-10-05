"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import NadaWordmark from "./NadaWordmark";
import { travarScroll } from "@/lib/scrollLock";
import { EASE_TRANSFORMA, MQ, movimentoLiberado } from "@/lib/motion";

// A timeline base dura ~2,5 s; no celular ela acelera pra caber em ~1,6 s.
// Se o JS chegou tarde (a pessoa já esperou na tela preta), cabe em ~1,1 s.
const DURACAO = 2.5;
const DURACAO_MOBILE = 1.6;
const DURACAO_TARDE = 1.1;
// Espera na tela preta (desde a primeira pintura) a partir da qual encurta.
const ESPERA_TARDE = 700;

// Partículas do bang. Desaceleram sozinhas (atrito de 6% por quadro).
function tocarBang(canvas: HTMLCanvasElement, quantidade: number) {
  const ctx = canvas.getContext("2d");
  if (!ctx || document.hidden) return () => {};

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const W = canvas.clientWidth;
  const H = canvas.clientHeight;
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const P = Array.from({ length: quantidade }, () => {
    const a = Math.random() * Math.PI * 2;
    const v = 2.5 + Math.sqrt(Math.random()) * 14;
    return { x: W / 2, y: H / 2, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r: 0.8 + Math.random() * 1.6 };
  });

  const DURACAO_MS = 600;
  const inicio = performance.now();
  let raf = requestAnimationFrame(function frame(agora: number) {
    const t = Math.min((agora - inicio) / DURACAO_MS, 1);
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = `rgba(255,255,255,${1 - t * t})`;
    for (const p of P) {
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.94;
      p.vy *= 0.94;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, 6.3);
      ctx.fill();
    }
    if (t < 1) raf = requestAnimationFrame(frame);
    else ctx.clearRect(0, 0, W, H);
  });
  return () => cancelAnimationFrame(raf);
}

// "Do nada nasce tudo": o ponto nasce → o traço do logotipo → bang → o fundo
// passa de preto a branco num círculo que sai do ponto → o logotipo voa até o
// cabeçalho e pousa no lugar do de lá (que fica escondido até o pouso: é o
// mesmo objeto chegando) → a página aparece em volta dele.
// Em toda carga nova da home (entrada, nova aba, F5), nunca no voltar/avançar
// nem na navegação interna (ver layout.tsx); ?intro força.
export default function IntroOverlay() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const brancoRef = useRef<HTMLDivElement>(null);
  const pontoRef = useRef<HTMLSpanElement>(null);
  const marcaRef = useRef<HTMLDivElement>(null);
  const pularRef = useRef<() => void>(() => {});

  useEffect(() => {
    const overlay = overlayRef.current;
    const canvas = canvasRef.current;
    const branco = brancoRef.current;
    const ponto = pontoRef.current;
    const marca = marcaRef.current;
    if (!overlay || !canvas || !branco || !ponto || !marca) return;

    // Quem decide é o script do <head> (layout.tsx), no carregamento do
    // documento: carga nova da home vira "tocar". Chegar na home por
    // navegação interna ou pelo voltar nunca toca.
    const raiz = document.documentElement;
    if (raiz.dataset.intro !== "tocar") {
      overlay.style.display = "none";
      return;
    }
    if (/[?&]intro\b/.test(location.search)) history.replaceState(history.state, "", location.pathname);

    window.__nadaIntro = true;
    window.scrollTo(0, 0);
    const destravar = travarScroll();
    const animada = movimentoLiberado();
    let cancelarBang = () => {};

    // Antes do JS, o CSS mostra o ponto parado depois de um instante (a tela
    // preta não fica vazia) e esconde o Pular, que ainda não funcionaria. Daqui
    // em diante os dois são da timeline: o ponto segue de onde está, sem piscar.
    const pontoNaTela = Number(getComputedStyle(ponto).opacity) > 0.5;
    const pintura =
      performance.getEntriesByName("first-paint")[0]?.startTime ??
      performance.getEntriesByName("first-contentful-paint")[0]?.startTime ??
      0;
    const tarde = performance.now() - pintura > ESPERA_TARDE;

    // O logotipo do cabeçalho some enquanto o da intro existe.
    const logoCabecalho = document.querySelector<HTMLElement>('header a[aria-label="NADA Studio, início"]');
    const mostrarCabecalho = () => logoCabecalho?.style.removeProperty("visibility");
    if (animada) logoCabecalho?.style.setProperty("visibility", "hidden");
    // Fase preta: a faixa da barra de rolagem acompanha o preto.
    raiz.style.background = "#000";
    const fundoNormal = () => raiz.style.removeProperty("background");

    // Página liberada: scroll volta e o hero começa a entrar.
    function liberar() {
      destravar();
      if (!window.__nadaIntro) return;
      window.__nadaIntro = false;
      window.dispatchEvent(new Event("nada:intro"));
    }

    function fim() {
      liberar();
      fundoNormal();
      // Mesmo quadro: o logotipo da intro sai e o do cabeçalho aparece no
      // mesmo pixel.
      mostrarCabecalho();
      overlay!.style.display = "none";
      raiz.dataset.intro = "vista";
    }

    const letras = marca.querySelectorAll<SVGPathElement>("[data-letra]");
    const studio = marca.querySelector<SVGPathElement>("[data-studio]");

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: fim });
      pularRef.current = () => {
        tl.kill();
        cancelarBang();
        fim();
      };

      if (!animada) {
        // Movimento reduzido: logotipo parado por 0,4 s e hero direto.
        gsap.set([letras, studio], { fill: "#fff" });
        tl.set(marca, { autoAlpha: 1 })
          .call(liberar, undefined, 0.4)
          .to(overlay, { autoAlpha: 0, duration: 0.2 }, 0.4);
        return;
      }

      // pathLength="1" nos paths: traço inteiro = 1.
      gsap.set(letras, { stroke: "#fff", strokeWidth: 8, fill: "transparent", strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.set(studio, { fill: "#fff", autoAlpha: 0 });

      const fraco = (navigator.hardwareConcurrency || 8) <= 4;
      const particulas = (matchMedia(MQ.mobile).matches ? 120 : 260) * (fraco ? 0.5 : 1);

      // Voo até o logotipo do cabeçalho (FLIP manual, sem plugin).
      const alvo = logoCabecalho?.querySelector("svg")?.getBoundingClientRect();
      const origem = marca.getBoundingClientRect();

      tl.fromTo(ponto, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.2, ease: "power2.out" })
        .to(marca, { autoAlpha: 1, duration: 0.2 }, 0.15)
        .to(letras, { strokeDashoffset: 0, duration: 0.55, ease: "power2.inOut", stagger: 0.08 }, 0.2)
        .addLabel("bang", 1.0)
        .to(ponto, { scale: 4, autoAlpha: 0, duration: 0.3, ease: "power2.out" }, "bang")
        .call(() => {
          cancelarBang = tocarBang(canvas, particulas);
        }, undefined, "bang")
        .to(letras, { fill: "#fff", strokeWidth: 0, duration: 0.25 }, "bang")
        .to(studio, { autoAlpha: 1, duration: 0.25 }, "bang+=0.05")
        .addLabel("branco", 1.25)
        .fromTo(branco, { clipPath: "circle(0% at 50% 50%)" }, { clipPath: "circle(75% at 50% 50%)", duration: 0.45, ease: "power2.inOut" }, "branco")
        .call(fundoNormal, undefined, "branco+=0.3")
        .to([letras, studio], { fill: "#000", duration: 0.25 }, "branco+=0.05")
        .addLabel("voo", 1.65);

      if (alvo && origem.width) {
        // O branco segura a página escondida durante o voo: o logotipo não
        // cruza o título. Ele pousa, e só então a página aparece em volta.
        tl.to(marca, {
          x: alvo.left - origem.left,
          y: alvo.top - origem.top,
          scale: alvo.width / origem.width,
          transformOrigin: "0 0",
          duration: 0.6,
          ease: EASE_TRANSFORMA,
        }, "voo")
          .addLabel("pouso")
          .set(overlay, { backgroundColor: "transparent", pointerEvents: "none" }, "pouso")
          .call(liberar, undefined, "pouso")
          .to(branco, { autoAlpha: 0, duration: 0.3, ease: "power1.out" }, "pouso");
      } else {
        tl.call(liberar, undefined, "voo")
          .set(overlay, { backgroundColor: "transparent", pointerEvents: "none" }, "voo")
          .to([branco, marca], { autoAlpha: 0, duration: 0.3 }, "voo");
      }

      tl.timeScale(tarde ? DURACAO / DURACAO_TARDE : matchMedia(MQ.mobile).matches ? DURACAO / DURACAO_MOBILE : 1);
      // O ponto já nasceu no CSS: a timeline começa com ele nascido.
      if (pontoNaTela) tl.seek(0.2);
    }, overlay);
    // A partir daqui o Pular funciona e o ponto é da timeline (globals.css).
    overlay.dataset.viva = "";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") pularRef.current();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      cancelarBang();
      ctx.revert();
      destravar();
      mostrarCabecalho();
      fundoNormal();
      window.__nadaIntro = false;
    };
  }, []);

  return (
    <div ref={overlayRef} className="intro fixed inset-0 z-[100] flex items-center justify-center bg-black">
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden />
      <div
        ref={brancoRef}
        className="absolute inset-0 bg-white"
        style={{ clipPath: "circle(0% at 50% 50%)" }}
        aria-hidden
      />
      <span
        ref={pontoRef}
        className="intro-ponto absolute h-2.5 w-2.5 rounded-full bg-white opacity-0 shadow-[0_0_12px_#fff]"
        aria-hidden
      />
      <div ref={marcaRef} className="relative w-[min(64vw,560px)] opacity-0">
        <NadaWordmark className="w-full" />
      </div>

      <button
        type="button"
        onClick={() => pularRef.current()}
        className="intro-pular absolute bottom-6 right-6 z-10 min-h-11 min-w-11 border border-white/25 px-4 text-[11px] font-medium uppercase tracking-[0.2em] text-white/75 transition-colors duration-200 hover:border-white hover:text-white"
      >
        Pular
      </button>
    </div>
  );
}
