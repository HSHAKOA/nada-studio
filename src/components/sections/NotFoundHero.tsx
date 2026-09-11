"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionMarker from "@/components/SectionMarker";

export default function NotFoundHero() {
  const router = useRouter();

  return (
    <section className="section-invert relative flex min-h-[80vh] items-center overflow-hidden">
      <ParticleField />
      <div className="wrap relative z-10 text-center">
        <Reveal>
          <div className="flex justify-center">
            <SectionMarker label="Ops" number="404" />
          </div>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="text-[clamp(64px,12vw,140px)] leading-none">404</h1>
        </Reveal>
        <Reveal delay={160}>
          <h2 className="mt-2 text-[clamp(24px,3.2vw,36px)]">Página não encontrada</h2>
        </Reveal>
        <Reveal delay={240}>
          <p className="prose-measure mx-auto mt-6 text-[18px] text-white/70">
            A página que você procura pode ter mudado de endereço, saído do
            ar ou nunca ter existido.
          </p>
        </Reveal>
        <Reveal delay={320}>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <button type="button" onClick={() => router.back()} className="btn btn-secondary">
              <ArrowLeft size={18} aria-hidden="true" className="mr-2" />
              Voltar
            </button>
            <Link href="/" className="btn btn-primary">
              <Home size={18} aria-hidden="true" className="mr-2" />
              Ir para o início
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

type Particle = { x: number; y: number; size: number };

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frameId = 0;
    let frame = 0;
    let particles: Particle[] = [];

    const seed = () => {
      const { width, height } = canvas;
      particles = Array.from({ length: 140 }, () => ({
        x: width * 1.2 + Math.random() * width * 1.8,
        y: -height * 0.2 + Math.random() * height * 1.2,
        size: width / 1000,
      }));
    };

    const resize = () => {
      canvas.width = canvas.clientWidth * window.devicePixelRatio;
      canvas.height = canvas.clientHeight * window.devicePixelRatio;
      frame = 0;
      seed();
    };

    const draw = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(255,255,255,0.9)";

      const drift = width / 90;
      const grow = width / 1200;

      for (const p of particles) {
        if (frame < 70) {
          p.x -= drift;
          p.size += grow;
        } else if (frame < 260) {
          p.x -= drift * 0.02;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      frame += 1;
      if (frame < 260) frameId = requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-60"
    />
  );
}
