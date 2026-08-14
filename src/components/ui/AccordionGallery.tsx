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
  const mediaRefs = useRef<(HTMLDivElement | null)[]>([]);

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
      // limpa a dimensão da orientação anterior — senão um width/height
      // inline sobrevive à troca de orientação (ex.: resize pra mobile).
      gsap.set(panel, { clearProps: outroProp });
      const target = i === activeIndex ? activeSize : restSize;
      if (reducedMotion) {
        gsap.set(panel, { [sizeProp]: target });
      } else {
        gsap.to(panel, { [sizeProp]: target, duration, ease });
      }
    });

    contentRefs.current.forEach((content, i) => {
      if (!content) return;
      const words = content.querySelectorAll<HTMLElement>("[data-stagger]");
      if (i === activeIndex) {
        if (reducedMotion) {
          gsap.set(words, { opacity: 1, y: 0 });
        } else {
          gsap.fromTo(
            words,
            { opacity: 0, y: 14 },
            {
              opacity: 1,
              y: 0,
              duration: duration * 0.55,
              ease,
              stagger: 0.07,
              delay: duration * 0.3,
            }
          );
        }
      } else {
        gsap.set(words, { opacity: 0, y: 14 });
      }
    });

    const media = mediaRefs.current[activeIndex];
    if (media && !reducedMotion) {
      gsap.fromTo(
        media,
        { y: 18 * parallax },
        { y: 0, duration, ease }
      );
    }
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
            <div
              className="ag-panel__media"
              ref={(el) => {
                mediaRefs.current[i] = el;
              }}
            >
              {item.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.image}
                  alt={item.alt ?? item.titulo}
                  className={grayscale && !isActive ? "ag-grayscale" : undefined}
                />
              ) : (
                <Icon aria-hidden="true" className="ag-panel__icon" />
              )}
            </div>

            <div className="ag-panel__label" aria-hidden={isActive}>
              <span className="ag-panel__label-num">{item.num}</span>
              <span className="ag-panel__label-title">{item.titulo}</span>
            </div>

            <div
              className="ag-panel__content"
              ref={(el) => {
                contentRefs.current[i] = el;
              }}
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
