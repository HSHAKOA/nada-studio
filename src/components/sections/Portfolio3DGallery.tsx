"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { PROJETOS, SELO_TIPO, type Projeto } from "@/data/portfolio";

export default function Portfolio3DGallery() {
  const [selectedProject, setSelectedProject] = useState<Projeto | null>(null);
  
  // Mobile Carousel State
  const [mobileIndex, setMobileIndex] = useState(0);
  const touchStartXRef = useRef(0);
  const touchEndXRef = useRef(0);

  // Desktop 3D Gallery State & Refs
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [radius, setRadius] = useState(480);
  
  const rotationRef = useRef(0);
  const startXRef = useRef(0);
  const startRotationRef = useRef(0);
  const isDraggingRef = useRef(false);
  const isAutoRotateRef = useRef(true);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  // Keep refs in sync with state
  useEffect(() => {
    isAutoRotateRef.current = isAutoRotate;
  }, [isAutoRotate]);

  useEffect(() => {
    isDraggingRef.current = isDragging;
  }, [isDragging]);

  // Handle radius on resize for desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setRadius(480);
      } else {
        setRadius(380);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const anglePerItem = 360 / PROJETOS.length;

  // Direct DOM update for 60fps/120fps buttery smooth 3D rotation without React re-renders
  const update3DTransforms = useCallback((currentRotation: number) => {
    if (!trackRef.current) return;
    trackRef.current.style.transform = `rotateY(${currentRotation}deg)`;

    const totalRotation = currentRotation % 360;
    PROJETOS.forEach((_, i) => {
      const cardEl = cardRefs.current[i];
      if (!cardEl) return;
      const itemAngle = i * anglePerItem;
      const relativeAngle = (itemAngle + totalRotation + 360) % 360;
      const normalizedAngle = Math.abs(relativeAngle > 180 ? 360 - relativeAngle : relativeAngle);
      const isFacingFront = normalizedAngle < 55;
      const opacity = Math.max(0.25, 1 - normalizedAngle / 150);

      cardEl.style.opacity = `${opacity}`;
      cardEl.style.pointerEvents = isFacingFront ? "auto" : "none";
    });
  }, [anglePerItem]);

  // Desktop Animation loop with direct DOM transform
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      if (isAutoRotateRef.current && !isDraggingRef.current && !selectedProject) {
        rotationRef.current += 12 * delta; // Smooth 12 deg/sec
        update3DTransforms(rotationRef.current);
      }
      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [selectedProject, update3DTransforms]);

  // Desktop Pointer / Drag handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button") || (e.target as HTMLElement).closest("a")) return;
    setIsDragging(true);
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    startRotationRef.current = rotationRef.current;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - startXRef.current;
    rotationRef.current = startRotationRef.current + deltaX * 0.3;
    update3DTransforms(rotationRef.current);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    isDraggingRef.current = false;
  };

  const rotateToStep = (step: number) => {
    rotationRef.current += step * anglePerItem;
    update3DTransforms(rotationRef.current);
  };

  // Mobile Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.targetTouches[0].clientX;
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartXRef.current - touchEndXRef.current;
    if (diff > 45) {
      // Swiped Left -> Next
      setMobileIndex((prev) => (prev + 1) % PROJETOS.length);
    } else if (diff < -45) {
      // Swiped Right -> Prev
      setMobileIndex((prev) => (prev - 1 + PROJETOS.length) % PROJETOS.length);
    }
  };

  return (
    <div className="relative my-8 w-full select-none overflow-hidden rounded-[28px] border border-black/10 bg-[#fafafa] p-5 text-black shadow-xs sm:my-10 sm:p-10">
      {/* Top Header & Controls */}
      <div className="relative z-20 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-black/60">
            ● Vitrine de Projetos
          </span>
          <p className="mt-1 text-xs text-black/50">
            {/* Desktop text */}
            <span className="hidden md:inline">Arraste para girar a vitrine 3D ou clique para ver detalhes</span>
            {/* Mobile text */}
            <span className="md:hidden">Deslize para o lado para navegar entre os projetos</span>
          </p>
        </div>

        {/* Controls - Visible on desktop */}
        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            onClick={() => rotateToStep(1)}
            aria-label="Girar projeto para esquerda"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-black/15 bg-white text-base text-black transition-all hover:bg-black/5 active:scale-95 shadow-xs"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium border transition-colors shadow-xs ${
              isAutoRotate
                ? "border-black/20 bg-black text-white"
                : "border-black/15 bg-white text-black/70 hover:bg-black/5"
            }`}
          >
            {isAutoRotate ? "Pausar giro" : "Girar auto"}
          </button>
          <button
            type="button"
            onClick={() => rotateToStep(-1)}
            aria-label="Girar projeto para direita"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-black/15 bg-white text-base text-black transition-all hover:bg-black/5 active:scale-95 shadow-xs"
          >
            →
          </button>
        </div>
      </div>

      {/* MOBILE VIEW: Ultra-smooth native swipe cards (Zero flicker / Zero lag) */}
      <div className="mt-6 block md:hidden">
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative overflow-hidden rounded-2xl touch-pan-y"
        >
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${mobileIndex * 100}%)` }}
          >
            {PROJETOS.map((projeto) => (
              <div key={projeto.id} className="min-w-full px-1">
                <div
                  onClick={() => setSelectedProject(projeto)}
                  className="flex flex-col justify-between overflow-hidden rounded-2xl border border-black/10 bg-white shadow-md active:scale-[0.99] transition-transform"
                >
                  {/* Image */}
                  <div className="relative h-52 w-full overflow-hidden bg-black/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={projeto.imagem}
                      alt={projeto.nome}
                      className="h-full w-full object-cover"
                      style={{ objectPosition: projeto.imagemPos || "center center" }}
                    />
                    <div className="absolute left-3 top-3 flex items-center gap-2">
                      <span className="rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-black shadow-xs">
                        {SELO_TIPO[projeto.tipo]}
                      </span>
                      <span className="rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-mono font-medium text-white">
                        #{projeto.num}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <h3 className="text-xl font-bold tracking-tight text-black">{projeto.nome}</h3>
                    <p className="mt-1 text-xs text-black/60 leading-relaxed">{projeto.subtitulo}</p>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {projeto.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-black/[0.05] px-2 py-0.5 text-[10px] font-medium text-black/70"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-black/10 pt-3 text-xs font-semibold text-black">
                      <span>Toque para ver detalhes completos</span>
                      <span>→</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Carousel Indicators & Controls */}
        <div className="mt-4 flex items-center justify-between px-2">
          <div className="flex gap-1.5">
            {PROJETOS.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setMobileIndex(idx)}
                aria-label={`Ir para projeto ${idx + 1}`}
                className={`h-2 rounded-full transition-all ${
                  mobileIndex === idx ? "w-6 bg-black" : "w-2 bg-black/20"
                }`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMobileIndex((prev) => (prev - 1 + PROJETOS.length) % PROJETOS.length)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-black/15 bg-white text-xs text-black shadow-xs active:bg-black/5"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => setMobileIndex((prev) => (prev + 1) % PROJETOS.length)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-black/15 bg-white text-xs text-black shadow-xs active:bg-black/5"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* DESKTOP VIEW: Hardware-Accelerated 3D Cylinder Gallery */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative hidden h-[500px] w-full cursor-grab items-center justify-center active:cursor-grabbing md:flex"
        style={{
          perspective: "1600px",
          touchAction: "pan-y",
        }}
      >
        <div
          ref={trackRef}
          className="relative h-full w-full"
          style={{
            transformStyle: "preserve-3d",
            willChange: "transform",
          }}
        >
          {PROJETOS.map((projeto, i) => {
            const itemAngle = i * anglePerItem;

            return (
              <div
                key={projeto.id}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                role="group"
                aria-label={projeto.nome}
                className="absolute w-[300px] lg:w-[320px] h-[400px] lg:h-[420px]"
                style={{
                  transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                  left: "50%",
                  top: "50%",
                  marginLeft: "-150px",
                  marginTop: "-200px",
                  willChange: "transform, opacity",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transition: "opacity 0.2s ease-out",
                }}
              >
                <div
                  onClick={() => setSelectedProject(projeto)}
                  className="group relative flex h-full w-full flex-col justify-between cursor-pointer overflow-hidden rounded-2xl border border-black/10 bg-white shadow-xl transition-all duration-300 hover:border-black/30 hover:shadow-2xl hover:-translate-y-1"
                >
                  {/* Top Image Box */}
                  <div className="relative h-48 lg:h-52 w-full overflow-hidden bg-black/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={projeto.imagem}
                      alt={projeto.nome}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      style={{ objectPosition: projeto.imagemPos || "center center" }}
                    />
                    {/* Top Badge */}
                    <div className="absolute left-3 top-3 flex items-center gap-2">
                      <span className="rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-black shadow-xs backdrop-blur-md">
                        {SELO_TIPO[projeto.tipo]}
                      </span>
                      <span className="rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-mono font-medium text-white backdrop-blur-md">
                        #{projeto.num}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Content */}
                  <div className="flex flex-1 flex-col justify-between p-5 bg-white text-black">
                    <div>
                      <h3 className="text-lg font-bold tracking-tight text-black">
                        {projeto.nome}
                      </h3>
                      <p className="mt-0.5 text-xs text-black/50 line-clamp-1">
                        {projeto.subtitulo}
                      </p>

                      {/* Tags */}
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {projeto.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md bg-black/[0.04] px-2 py-0.5 text-[10px] font-medium text-black/70"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-black/10 pt-3 text-xs font-semibold text-black">
                      <span>Ver detalhes</span>
                      <span className="transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Project Detail Modal / Drawer */}
      {selectedProject && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          onClick={() => setSelectedProject(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-black/15 bg-white p-6 text-black shadow-2xl sm:p-8"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedProject(null)}
              className="absolute right-6 top-6 flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-base text-black/70 hover:bg-black/10 hover:text-black"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-bold text-black border border-black/10">
                {SELO_TIPO[selectedProject.tipo]}
              </span>
              <span className="text-xs text-black/50">PROJETO #{selectedProject.num}</span>
            </div>

            <h2 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight">{selectedProject.nome}</h2>
            <p className="text-sm sm:text-base text-black/60">{selectedProject.subtitulo}</p>

            {/* Tags */}
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedProject.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-xs font-medium text-black/70"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Image Preview */}
            <div className="mt-6 overflow-hidden rounded-2xl border border-black/10 bg-black/5 shadow-xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedProject.imagem}
                alt={selectedProject.nome}
                className="h-48 sm:h-64 w-full object-cover"
                style={{ objectPosition: selectedProject.imagemPos || "center center" }}
              />
            </div>

            {/* Details Section */}
            <div className="mt-6 space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-black/50">
                  O Problema
                </p>
                <p className="mt-1 text-sm leading-relaxed text-black/80">
                  {selectedProject.problema}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-black/50">
                  O que a NADA Studio construiu
                </p>
                <p className="mt-1 text-sm leading-relaxed text-black/80">
                  {selectedProject.solucao}
                </p>
              </div>

              {selectedProject.resultado && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-black/50">
                    Resultado & Impacto
                  </p>
                  <p className="mt-1 text-sm font-semibold leading-relaxed text-black">
                    {selectedProject.resultado}
                  </p>
                </div>
              )}

              {selectedProject.tecnica && (
                <p className="text-xs text-black/50 italic">
                  Especificação: {selectedProject.tecnica}
                </p>
              )}
            </div>

            {/* Modal CTA */}
            {selectedProject.link && (
              <div className="mt-8 pt-6 border-t border-black/10 flex flex-wrap items-center justify-between gap-4">
                <a
                  href={selectedProject.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary w-full sm:w-auto justify-center"
                >
                  {selectedProject.linkLabel || "Acessar projeto"} →
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="text-xs text-black/50 hover:text-black"
                >
                  Voltar para a vitrine
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
