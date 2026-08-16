"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { PROJETOS, SELO_TIPO, type Projeto } from "@/data/portfolio";

export default function Portfolio3DGallery() {
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Projeto | null>(null);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [radius, setRadius] = useState(540);

  const startXRef = useRef(0);
  const startRotationRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastInteractionRef = useRef(Date.now());

  // Adapt cylindrical radius to window width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setRadius(320);
      } else if (window.innerWidth < 1024) {
        setRadius(440);
      } else {
        setRadius(540);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Smooth continuous auto-rotate when not interacting
  useEffect(() => {
    const autoSpin = () => {
      if (isAutoRotate && !isDragging && !selectedProject) {
        setRotation((prev) => prev + 0.08);
      }
      animationFrameRef.current = requestAnimationFrame(autoSpin);
    };

    animationFrameRef.current = requestAnimationFrame(autoSpin);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isAutoRotate, isDragging, selectedProject]);

  // Drag handlers (Mouse & Touch)
  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button") || (e.target as HTMLElement).closest("a")) {
      return;
    }
    setIsDragging(true);
    startXRef.current = e.clientX;
    startRotationRef.current = rotation;
    lastInteractionRef.current = Date.now();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startXRef.current;
    const sensitivity = window.innerWidth < 640 ? 0.35 : 0.25;
    setRotation(startRotationRef.current + deltaX * sensitivity);
    lastInteractionRef.current = Date.now();
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const rotateTo = useCallback((step: number) => {
    const anglePerItem = 360 / PROJETOS.length;
    setRotation((prev) => prev + step * anglePerItem);
    lastInteractionRef.current = Date.now();
  }, []);

  const anglePerItem = 360 / PROJETOS.length;

  return (
    <div className="relative my-10 w-full select-none overflow-hidden rounded-[28px] border border-black/10 bg-black/[0.015] py-12 text-black shadow-xs">
      {/* Top Header & Controls */}
      <div className="relative z-20 flex flex-col items-center justify-between gap-4 px-6 sm:flex-row sm:px-10">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-black/60">
            ● Vitrine Interativa 3D
          </span>
          <p className="mt-1 text-xs text-black/50">
            Arraste para girar ou clique no projeto para ver os detalhes
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => rotateTo(1)}
            aria-label="Girar projeto para esquerda"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/15 bg-white text-base text-black transition-all hover:bg-black/5 active:scale-95 shadow-xs"
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
            onClick={() => rotateTo(-1)}
            aria-label="Girar projeto para direita"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/15 bg-white text-base text-black transition-all hover:bg-black/5 active:scale-95 shadow-xs"
          >
            →
          </button>
        </div>
      </div>

      {/* 3D Circular Viewport */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative flex h-[480px] w-full cursor-grab items-center justify-center active:cursor-grabbing sm:h-[530px]"
        style={{ perspective: "1800px" }}
      >
        <div
          className="relative h-full w-full"
          style={{
            transform: `rotateY(${rotation}deg)`,
            transformStyle: "preserve-3d",
            transition: isDragging ? "none" : "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {PROJETOS.map((projeto, i) => {
            const itemAngle = i * anglePerItem;
            const totalRotation = rotation % 360;
            const relativeAngle = (itemAngle + totalRotation + 360) % 360;
            const normalizedAngle = Math.abs(relativeAngle > 180 ? 360 - relativeAngle : relativeAngle);
            const isFacingFront = normalizedAngle < 45;
            const opacity = Math.max(0.2, 1 - normalizedAngle / 160);

            return (
              <div
                key={projeto.id}
                role="group"
                aria-label={projeto.nome}
                className="absolute w-[260px] sm:w-[310px] h-[360px] sm:h-[410px]"
                style={{
                  transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                  left: "50%",
                  top: "50%",
                  marginLeft: "-130px",
                  marginTop: "-180px",
                  opacity: opacity,
                  pointerEvents: isFacingFront ? "auto" : "none",
                  transition: "opacity 0.25s ease-out",
                }}
              >
                <div
                  onClick={() => setSelectedProject(projeto)}
                  className="group relative flex h-full w-full flex-col justify-between cursor-pointer overflow-hidden rounded-2xl border border-black/10 bg-white shadow-xl transition-all duration-300 hover:border-black/30 hover:shadow-2xl"
                >
                  {/* Top Image Box */}
                  <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-black/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={projeto.imagem}
                      alt={projeto.nome}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
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

      {/* Project Detail Modal / Drawer (Tema Branco Clean) */}
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

            <h2 className="mt-4 text-3xl font-bold tracking-tight">{selectedProject.nome}</h2>
            <p className="text-base text-black/60">{selectedProject.subtitulo}</p>

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
