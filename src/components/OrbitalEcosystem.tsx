"use client";

import { useEffect, useId, useRef, useState } from "react";
import gsap from "gsap";
import { ecosystemNodes } from "@/data/content";
import { ecosystemIcons } from "@/components/icons/EcosystemIcons";

const SIZE = 860;
const CENTER = SIZE / 2;
const NODE_RADIUS = 42;
const ICON_SIZE = 46;

const RINGS = [
  { radius: 170, period: 26, direction: 1 },
  { radius: 265, period: 34, direction: -1 },
  { radius: 355, period: 44, direction: 1 },
];

const nodesByRing = RINGS.map((_, ringIndex) =>
  ecosystemNodes.filter((n) => n.ring === ringIndex)
);

function getInitialReduced() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// initial angle per node: evenly spread within its ring
function computeInitialAngles() {
  return ecosystemNodes.map((node) => {
    const siblings = nodesByRing[node.ring];
    const indexInRing = siblings.findIndex((n) => n.id === node.id);
    return (indexInRing / siblings.length) * Math.PI * 2;
  });
}

export default function OrbitalEcosystem() {
  const titleId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const groupRefs = useRef<(SVGGElement | null)[]>([]);
  const lineRefs = useRef<(SVGLineElement | null)[]>([]);
  const angles = useRef<number[]>(computeInitialAngles());
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(getInitialReduced);
  const hoveredIdRef = useRef<string | null>(null);

  useEffect(() => {
    hoveredIdRef.current = hoveredId;
  }, [hoveredId]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);

    const node = wrapRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(node);
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(node);

    return () => {
      mq.removeEventListener("change", onChange);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const paint = () => {
      ecosystemNodes.forEach((node, i) => {
        const ring = RINGS[node.ring];
        const angle = angles.current[i];
        const x = CENTER + ring.radius * Math.cos(angle);
        const y = CENTER + ring.radius * Math.sin(angle);
        groupRefs.current[i]?.setAttribute("transform", `translate(${x} ${y})`);
        const line = lineRefs.current[i];
        if (line) {
          line.setAttribute("x2", String(x));
          line.setAttribute("y2", String(y));
        }
      });
    };

    // static layout for reduced motion / initial paint
    paint();

    if (reduced) return;

    const tick = (_time: number, deltaMs: number) => {
      if (document.hidden) return;
      const dt = deltaMs / 1000;
      ecosystemNodes.forEach((node, i) => {
        if (hoveredIdRef.current === node.id) return;
        const ring = RINGS[node.ring];
        angles.current[i] +=
          ((Math.PI * 2) / ring.period) * dt * ring.direction;
      });
      paint();
    };

    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
    };
  }, [reduced]);

  return (
    <div ref={wrapRef} className="mx-auto w-full max-w-[760px]">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="h-auto w-full overflow-visible"
        role="img"
        aria-labelledby={titleId}
      >
        <title id={titleId}>
          Ecossistema de ferramentas conectadas pela NADA
        </title>
        {/* connecting lines */}
        {ecosystemNodes.map((node, i) => (
          <line
            key={`line-${node.id}`}
            ref={(el) => {
              lineRefs.current[i] = el;
            }}
            x1={CENTER}
            y1={CENTER}
            x2={CENTER}
            y2={CENTER}
            className="orbit-line"
            stroke="currentColor"
            strokeWidth={hoveredId === node.id ? 2.6 : 1.8}
            strokeOpacity={hoveredId === node.id ? 0.7 : 0.32}
            style={{
              transition: "stroke-opacity 0.3s ease, stroke-width 0.3s ease",
              animationDelay: `${i * 0.35}s`,
            }}
          />
        ))}

        {/* center */}
        <g className="orbit-center-pulse">
          <circle cx={CENTER} cy={CENTER} r={62} fill="#000" />
          <circle
            cx={CENTER - 17}
            cy={CENTER - 20}
            r={22}
            fill="#fff"
            opacity={0.08}
          />
          <text
            x={CENTER}
            y={CENTER + 11}
            textAnchor="middle"
            fill="#fff"
            fontSize={28}
            style={{ fontFamily: "var(--font-hand)" }}
          >
            NADA
          </text>
        </g>

        {/* nodes */}
        {ecosystemNodes.map((node, i) => {
          const Icon = ecosystemIcons[node.icon];
          const isHovered = hoveredId === node.id;
          return (
            <g
              key={node.id}
              ref={(el) => {
                groupRefs.current[i] = el;
              }}
            >
              <g
                tabIndex={0}
                role="button"
                aria-label={`${node.label} — ${node.short}`}
                className="orbit-node"
                style={{
                  transitionDelay: visible ? `${i * 70}ms` : "0ms",
                  opacity: visible ? 1 : 0,
                  transform: `scale(${
                    (visible ? 1 : 0) * (isHovered ? 1.18 : 1)
                  })`,
                }}
                onMouseEnter={() => setHoveredId(node.id)}
                onMouseLeave={() => setHoveredId(null)}
                onFocus={() => setHoveredId(node.id)}
                onBlur={() => setHoveredId(null)}
              >
                <circle
                  r={NODE_RADIUS}
                  fill="rgba(255,255,255,0.85)"
                  stroke="#000"
                  strokeOpacity={isHovered ? 0.9 : 0.3}
                  strokeWidth={1.4}
                  style={{
                    filter: isHovered
                      ? "drop-shadow(0 14px 24px rgba(0,0,0,0.2))"
                      : "drop-shadow(0 6px 14px rgba(0,0,0,0.1))",
                    transition: "stroke-opacity 0.3s ease, filter 0.3s ease",
                  }}
                />
                <g
                  transform={`translate(${-ICON_SIZE / 2} ${-ICON_SIZE / 2})`}
                  className="text-black"
                >
                  <Icon size={ICON_SIZE} aria-hidden="true" />
                </g>
                <text
                  y={NODE_RADIUS + 26}
                  textAnchor="middle"
                  fontSize={14}
                  fontWeight={500}
                  fill="#000"
                  opacity={isHovered ? 1 : 0}
                  style={{ transition: "opacity 0.25s ease" }}
                >
                  {node.short}
                </text>
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
