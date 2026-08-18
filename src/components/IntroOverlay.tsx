"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import NadaWordmark from "./NadaWordmark";

function getSkipIntro() {
  if (typeof window === "undefined") return true;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return reduced || Boolean(sessionStorage.getItem("nada-intro-seen"));
}

// Burst curto de partículas brancas saindo do centro. Vive só os ~0.4s do bang,
// então é escrito aqui mesmo em vez de reaproveitar o canvas do hero, que é
// preto-no-branco e dirigido por scroll.
function tocarBang(canvas: HTMLCanvasElement, aoTerminar: () => void) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return aoTerminar();

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const W = canvas.clientWidth;
  const H = canvas.clientHeight;
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const cx = W / 2;
  const cy = H / 2;
  const n = window.innerWidth < 640 ? 260 : 520;
  const P = Array.from({ length: n }, () => {
    const a = Math.random() * Math.PI * 2;
    const v = 2 + Math.pow(Math.random(), 0.5) * 13;
    return {
      x: cx,
      y: cy,
      vx: Math.cos(a) * v,
      vy: Math.sin(a) * v,
      r: 0.6 + Math.random() * 1.6,
    };
  });

  const DURACAO = 620;
  const inicio = performance.now();
  let raf = 0;

  function frame(agora: number) {
    const t = Math.min((agora - inicio) / DURACAO, 1);
    ctx!.clearRect(0, 0, W, H);
    const alpha = 1 - t * t;
    for (const p of P) {
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.94;
      p.vy *= 0.94;
      ctx!.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx!.beginPath();
      ctx!.arc(p.x, p.y, p.r, 0, 6.3);
      ctx!.fill();
    }
    if (t < 1) {
      raf = requestAnimationFrame(frame);
    } else {
      ctx!.clearRect(0, 0, W, H);
      aoTerminar();
    }
  }
  raf = requestAnimationFrame(frame);
  return () => cancelAnimationFrame(raf);
}

export default function IntroOverlay() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const pontoRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const marcaRef = useRef<HTMLDivElement>(null);

  const [skip] = useState(getSkipIntro);
  const [done, setDone] = useState(skip);

  useEffect(() => {
    if (skip) return;

    try {
      sessionStorage.setItem("nada-intro-seen", "1");
    } catch {
      // Ignora erro caso o ambiente de navegação bloqueie sessionStorage
    }
    document.body.style.overflow = "hidden";

    const overlay = overlayRef.current!;
    const marca = marcaRef.current!;
    const letras = marca.querySelectorAll<SVGPathElement>("[data-letra]");
    const studio = marca.querySelector<SVGPathElement>("[data-studio]")!;

    const ctx = gsap.context(() => {
      // Estado inicial: só contorno, nada preenchido, sobre o preto.
      gsap.set(letras, {
        stroke: "#fff",
        strokeWidth: 5,
        fill: "transparent",
        strokeDasharray: 1,
        strokeDashoffset: 1,
      });
      gsap.set(studio, { fill: "#fff", opacity: 0 });
      gsap.set(marca, { opacity: 0 });

      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = "";
          setDone(true);
        },
      });

      // 1. Vazio: um ponto pulsando.
      tl.fromTo(
        pontoRef.current,
        { scale: 0.6, opacity: 0.5 },
        { scale: 1.25, opacity: 1, duration: 0.4, ease: "sine.inOut" }
      )
        // 2. O bang: o ponto some junto com o burst do canvas.
        .to(pontoRef.current, {
          scale: 3,
          opacity: 0,
          duration: 0.22,
          ease: "power2.out",
          onStart: () => tocarBang(canvasRef.current!, () => {}),
        })
        // 3. As letras se desenham, uma depois da outra.
        .set(marca, { opacity: 1 })
        .to(letras, {
          strokeDashoffset: 0,
          duration: 0.85,
          ease: "power1.inOut",
          stagger: 0.18,
        })
        // 4. Consolida: o contorno vira preenchimento e o STUDIO entra.
        .to(letras, { fill: "#fff", duration: 0.35, ease: "power2.out" }, "-=0.1")
        .to(letras, { strokeWidth: 0, duration: 0.35 }, "<")
        .to(studio, { opacity: 1, duration: 0.4, ease: "power2.out" }, "<0.1")
        // 5. Inversão P&B: fundo vira branco e a marca vira preta.
        .to(overlay, { backgroundColor: "#fff", duration: 0.5, ease: "power2.inOut" }, "+=0.2")
        .to(letras, { fill: "#000", duration: 0.5, ease: "power2.inOut" }, "<")
        .to(studio, { fill: "#000", duration: 0.5, ease: "power2.inOut" }, "<")
        // Fecha revelando a página. O deslocamento pra navbar entra no Bloco 2.
        .to(overlay, { autoAlpha: 0, duration: 0.45, ease: "power2.in" }, "+=0.25");
    }, overlayRef);

    return () => {
      ctx.revert();
      document.body.style.overflow = "";
    };
  }, [skip]);

  if (done) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden
      />
      <span
        ref={pontoRef}
        className="absolute h-2 w-2 rounded-full bg-white"
        aria-hidden
      />
      <div ref={marcaRef} className="relative w-[min(62vw,560px)]">
        <NadaWordmark className="w-full" />
      </div>

      <button
        type="button"
        onClick={() => {
          document.body.style.overflow = "";
          setDone(true);
        }}
        className="absolute bottom-8 right-8 text-xs uppercase tracking-[0.2em] text-white/50 transition-colors hover:text-white"
      >
        Pular
      </button>
    </div>
  );
}
