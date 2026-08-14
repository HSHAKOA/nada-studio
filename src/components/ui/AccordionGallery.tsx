"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import type { ServicoPainel } from "@/data/content";
import { serviceIcons } from "@/components/icons/ServiceIcons";
import "./AccordionGallery.css";

export type AccordionGalleryProps = {
  items: ServicoPainel[];
  orientation?: "horizontal" | "vertical";
  trigger?: "hover" | "click";
  defaultIndex?: number;
  expandRatio?: number;
  height?: number;
  gap?: number;
  radius?: number;
  tilt?: number;
  parallax?: number;
  duration?: number;
  ease?: string;
  accentColor?: string;
  overlayColor?: string;
  textColor?: string;
  grayscale?: boolean;
  className?: string;
};

const MOBILE_BREAKPOINT = 768;
const MOBILE_COLLAPSED = 96;
const MOBILE_EXPANDED = 340;

// Posição de repouso (colapsado) e de destaque (ativo) do ícone — a mesma
// dupla de valores serve de estado inicial em CSS (evita flash antes do
// primeiro useEffect) e de alvo do GSAP.
// `top` percentual controla a âncora vertical (colapsado no meio-alto do
// painel, ativo recuado pro topo pra abrir espaço pro texto); xPercent/
// yPercent só centralizam o ícone em cima dessa âncora.
const ICON_REST = { top: "15%", xPercent: -50, yPercent: -50, scale: 1, autoAlpha: 1 };
const ICON_ACTIVE = { top: "12%", xPercent: -50, yPercent: -50, scale: 0.7, autoAlpha: 0.35 };
// Mobile: painel fechado tem 96px de altura — não cabe ícone + rótulo, então
// o ícone só existe visualmente no painel ativo, sem o recuo do desktop.
const ICON_MOBILE_REST = { xPercent: -50, yPercent: -50, scale: 1, autoAlpha: 0 };
const ICON_MOBILE_ACTIVE = { xPercent: -50, yPercent: -50, scale: 1, autoAlpha: 1 };

export default function AccordionGallery({
  items,
  orientation = "horizontal",
  trigger = "hover",
  defaultIndex = 0,
  expandRatio = 0.46,
  height = 520,
  gap = 2,
  radius = 0,
  tilt = 0,
  parallax = 0.35,
  duration = 0.7,
  ease = "power3.out",
  accentColor = "#FFFFFF",
  overlayColor = "#000000",
  textColor = "#FFFFFF",
  grayscale = false,
  className,
}: AccordionGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(
    Math.min(Math.max(defaultIndex, 0), items.length - 1)
  );
  // Estado inicial fixo (false): ler matchMedia no useState causaria mismatch
  // de hidratação (servidor não conhece o viewport). O useEffect corrige
  // logo após o mount, mesmo padrão usado no resto do projeto.
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const iconRefs = useRef<(SVGSVGElement | null)[]>([]);

  useEffect(() => {
    const mqMobile = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const mqReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMobile = () => setIsMobile(mqMobile.matches);
    const syncReduced = () => setReducedMotion(mqReduced.matches);
    syncMobile();
    syncReduced();
    mqMobile.addEventListener("change", syncMobile);
    mqReduced.addEventListener("change", syncReduced);
    return () => {
      mqMobile.removeEventListener("change", syncMobile);
      mqReduced.removeEventListener("change", syncReduced);
    };
  }, []);

  const effectiveOrientation = isMobile ? "vertical" : orientation;
  const effectiveTrigger = isMobile ? "click" : trigger;
  const effectiveTilt = isMobile ? 0 : tilt;
  const sizeProp = effectiveOrientation === "horizontal" ? "width" : "height";

  // Anima largura/altura dos painéis. Exceção deliberada à regra geral de
  // "nunca animar width/height": é o próprio mecanismo do padrão accordion,
  // limitado a poucos elementos (N painéis), sem custo perceptível de reflow.
  useEffect(() => {
    const panels = panelRefs.current;
    if (!panels.length) return;

    let activeSize: string;
    let restSize: string;

    if (isMobile) {
      activeSize = `${MOBILE_EXPANDED}px`;
      restSize = `${MOBILE_COLLAPSED}px`;
    } else {
      activeSize = `${expandRatio * 100}%`;
      restSize = `${((1 - expandRatio) / Math.max(items.length - 1, 1)) * 100}%`;
    }

    const outroProp = sizeProp === "width" ? "height" : "width";

    panels.forEach((panel, i) => {
      if (!panel) return;
      const isActive = i === activeIndex;

      // limpa a dimensão da orientação anterior — senão um width/height
      // inline sobrevive à troca de orientação (ex.: resize pra mobile).
      gsap.set(panel, { clearProps: outroProp });
      const target = isActive ? activeSize : restSize;

      const content = contentRefs.current[i];
      const label = labelRefs.current[i];
      const icon = iconRefs.current[i];
      const words = content?.querySelectorAll<HTMLElement>("[data-stagger]") ?? [];
      const iconRest = isMobile ? ICON_MOBILE_REST : ICON_REST;
      const iconActive = isMobile ? ICON_MOBILE_ACTIVE : ICON_ACTIVE;

      if (reducedMotion) {
        gsap.set(panel, { [sizeProp]: target });
        if (label) gsap.set(label, { autoAlpha: isActive ? 0 : 1 });
        if (words.length) gsap.set(words, { autoAlpha: isActive ? 1 : 0, x: 0 });
        if (content) gsap.set(content, { pointerEvents: isActive ? "auto" : "none" });
        if (icon) gsap.set(icon, isActive ? iconActive : iconRest);
        return;
      }

      gsap.to(panel, { [sizeProp]: target, duration, ease });

      if (icon) gsap.to(icon, { ...(isActive ? iconActive : iconRest), duration, ease });

      if (isActive) {
        if (label) gsap.to(label, { autoAlpha: 0, duration: duration * 0.4, ease });
        if (content) gsap.set(content, { pointerEvents: "auto" });
        if (words.length) {
          gsap.fromTo(
            words,
            { autoAlpha: 0, x: -14 },
            {
              autoAlpha: 1,
              x: 0,
              duration,
              ease,
              stagger: 0.07,
              delay: duration * 0.25,
            }
          );
        }
      } else {
        if (label) gsap.to(label, { autoAlpha: 1, duration: duration * 0.4, ease, delay: duration * 0.2 });
        if (content) gsap.set(content, { pointerEvents: "none" });
        if (words.length) {
          gsap.to(words, { autoAlpha: 0, x: -14, duration: duration * 0.6, ease });
        }
      }
    });
  }, [
    activeIndex,
    expandRatio,
    sizeProp,
    duration,
    ease,
    items.length,
    reducedMotion,
    isMobile,
    parallax,
  ]);

  function activar(i: number) {
    setActiveIndex(i);
  }

  function onKeyDown(e: React.KeyboardEvent, i: number) {
    const nextKey = effectiveOrientation === "horizontal" ? "ArrowRight" : "ArrowDown";
    const prevKey = effectiveOrientation === "horizontal" ? "ArrowLeft" : "ArrowUp";
    if (e.key === nextKey) {
      e.preventDefault();
      const next = (i + 1) % items.length;
      activar(next);
      panelRefs.current[next]?.focus();
    } else if (e.key === prevKey) {
      e.preventDefault();
      const prev = (i - 1 + items.length) % items.length;
      activar(prev);
      panelRefs.current[prev]?.focus();
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      activar(i);
    }
  }

  return (
    <div
      className={`ag-root${className ? ` ${className}` : ""}`}
      data-orientation={effectiveOrientation}
      data-mobile={isMobile}
      style={
        {
          "--ag-overlay": overlayColor,
          "--ag-accent": accentColor,
          "--ag-text": textColor,
          "--ag-radius": `${radius}px`,
          "--ag-gap": `${gap}px`,
          height: isMobile ? undefined : `${height}px`,
        } as React.CSSProperties
      }
    >
      {items.map((item, i) => {
        const isActive = i === activeIndex;
        const Icon = serviceIcons[item.icone];
        const hoverHandlers =
          effectiveTrigger === "hover"
            ? {
                onMouseEnter: () => activar(i),
              }
            : {
                onClick: () => activar(i),
              };

        return (
          <div
            key={item.id}
            ref={(el) => {
              panelRefs.current[i] = el;
            }}
            className="ag-panel"
            data-active={isActive}
            role="button"
            tabIndex={0}
            aria-expanded={isActive}
            aria-label={item.titulo}
            onKeyDown={(e) => onKeyDown(e, i)}
            {...hoverHandlers}
            style={
              effectiveTilt
                ? { transform: isActive ? `rotateY(${effectiveTilt}deg)` : undefined }
                : undefined
            }
          >
            <div className="ag-panel__media">
              {item.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.image}
                  alt={item.alt ?? item.titulo}
                  className={grayscale && !isActive ? "ag-grayscale" : undefined}
                />
              ) : (
                <Icon
                  aria-hidden="true"
                  className="ag-panel__icon"
                  ref={(el) => {
                    iconRefs.current[i] = el;
                  }}
                />
              )}
            </div>

            {/* Regra binária: só um dos dois (label ou content) fica visível
                por vez — nunca os dois ao mesmo tempo. */}
            <div
              className="ag-panel__label"
              ref={(el) => {
                labelRefs.current[i] = el;
              }}
              aria-hidden={isActive}
            >
              <span className="ag-panel__label-num">{item.num}</span>
              <span className="ag-panel__label-title">{item.titulo}</span>
            </div>

            <div
              className="ag-panel__content"
              ref={(el) => {
                contentRefs.current[i] = el;
              }}
              aria-hidden={!isActive}
            >
              <span data-stagger className="ag-panel__bar" aria-hidden="true" />
              <span data-stagger className="ag-panel__num">
                {item.num}
              </span>
              <h3 data-stagger className="ag-panel__title">
                {item.titulo}
              </h3>
              <p data-stagger className="ag-panel__desc">
                {item.descricao}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
