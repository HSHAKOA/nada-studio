"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

function getSkipIntro() {
  if (typeof window === "undefined") return true;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return reduced || Boolean(sessionStorage.getItem("nada-intro-seen"));
}

export default function IntroOverlay() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const wipeRef = useRef<HTMLSpanElement>(null);
  const [skip] = useState(getSkipIntro);
  const [done, setDone] = useState(skip);

  useEffect(() => {
    if (skip) return;

    sessionStorage.setItem("nada-intro-seen", "1");
    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => {
        document.body.style.overflow = "";
        setDone(true);
      },
    });

    tl.set(wipeRef.current, { clipPath: "inset(0 100% 0 0)" })
      .to(wipeRef.current, { clipPath: "inset(0 0% 0 0)", duration: 1.1 })
      .to(overlayRef.current, { autoAlpha: 0, duration: 0.7 }, "+=0.35");

    return () => {
      document.body.style.overflow = "";
    };
  }, [skip]);

  if (done) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-white"
      aria-hidden
    >
      <span
        ref={wipeRef}
        className="text-[18vw] leading-none"
        style={{ fontFamily: "var(--font-hand)" }}
      >
        NADA
      </span>
    </div>
  );
}
