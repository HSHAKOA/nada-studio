"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import NadaWordmark from "./NadaWordmark";

function tocarBang(canvas: HTMLCanvasElement, aoTerminar: () => void) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return aoTerminar();

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const W = canvas.clientWidth || window.innerWidth;
  const H = canvas.clientHeight || window.innerHeight;
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const cx = W / 2;
  const cy = H / 2;
  const n = window.innerWidth < 640 ? 180 : 380;
  const P = Array.from({ length: n }, () => {
    const a = Math.random() * Math.PI * 2;
    const v = 2.5 + Math.pow(Math.random(), 0.5) * 14;
    return {
      x: cx,
      y: cy,
      vx: Math.cos(a) * v,
      vy: Math.sin(a) * v,
      r: 0.8 + Math.random() * 1.6,
    };
  });

  const DURACAO = 520;
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

  const [done, setDone] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const overlay = overlayRef.current;
    const marca = marcaRef.current;
    const ponto = pontoRef.current;
    if (!overlay || !marca || !ponto) return;

    const letras = marca.querySelectorAll<SVGPathElement>("[data-letra]");
    const studio = marca.querySelector<SVGPathElement>("[data-studio]");

    const ctx = gsap.context(() => {
      // Calculate exact total length for each letter path to guarantee 100% reliable stroke drawing
      letras.forEach((path) => {
        const len = path.getTotalLength ? Math.ceil(path.getTotalLength()) : 3000;
        gsap.set(path, {
          stroke: "#ffffff",
          strokeWidth: 6,
          fill: "transparent",
          strokeDasharray: len,
          strokeDashoffset: len,
        });
      });

      if (studio) {
        gsap.set(studio, { fill: "#ffffff", opacity: 0 });
      }
      gsap.set(marca, { opacity: 0, scale: 0.96 });

      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = "";
          setDone(true);
        },
      });

      // 1. Initial glowing pulse dot
      tl.fromTo(
        ponto,
        { scale: 0.6, opacity: 0.4 },
        { scale: 1.3, opacity: 1, duration: 0.38, ease: "sine.inOut" }
      )
        // 2. Bang burst explosion
        .to(ponto, {
          scale: 3.5,
          opacity: 0,
          duration: 0.22,
          ease: "power2.out",
          onStart: () => {
            if (canvasRef.current) {
              tocarBang(canvasRef.current, () => {});
            }
          },
        })
        // 3. Brand reveal & animated stroke drawing
        .to(marca, { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" }, "-=0.1")
        .to(letras, {
          strokeDashoffset: 0,
          duration: 0.85,
          ease: "power2.out",
          stagger: 0.14,
        }, "-=0.2")
        // 4. Fill letters in crisp white & fade in STUDIO
        .to(letras, { fill: "#ffffff", strokeWidth: 0, duration: 0.35, ease: "power2.out" }, "-=0.1")
        .to(studio, { opacity: 1, duration: 0.35, ease: "power2.out" }, "<0.05")
        // 5. Inversion to clean white screen
        .to(overlay, { backgroundColor: "#ffffff", duration: 0.45, ease: "power2.inOut" }, "+=0.2")
        .to(letras, { fill: "#000000", duration: 0.45, ease: "power2.inOut" }, "<")
        .to(studio, { fill: "#000000", duration: 0.45, ease: "power2.inOut" }, "<")
        // 6. Smooth curtain reveal of the main site
        .to(overlay, { autoAlpha: 0, duration: 0.4, ease: "power2.in" }, "+=0.25");
    }, overlayRef);

    return () => {
      ctx.revert();
      document.body.style.overflow = "";
    };
  }, []);

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
        className="absolute h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_12px_#fff]"
        aria-hidden
      />
      <div ref={marcaRef} className="relative w-[min(64vw,560px)]">
        <NadaWordmark className="w-full" />
      </div>

      <button
        type="button"
        onClick={() => {
          document.body.style.overflow = "";
          setDone(true);
        }}
        className="absolute bottom-8 right-8 z-10 rounded-full border border-white/20 bg-black/40 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-white/70 backdrop-blur-xs transition-colors hover:border-white/40 hover:bg-black/60 hover:text-white"
      >
        Pular
      </button>
    </div>
  );
}
