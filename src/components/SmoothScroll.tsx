"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // toque fica nativo — sem scroll-jack no mobile
      syncTouch: false,
      // O `anchors: true` do Lenis não dá preventDefault no link, então o pulo
      // nativo chega primeiro e corta a animação. Tratamos âncora na mão.
      anchors: false,
    });

    let id = requestAnimationFrame(function raf(time: number) {
      lenis.raf(time);
      id = requestAnimationFrame(raf);
    });

    // O scroll-behavior nativo é cancelado pelo Lenis (ele reassume a posição),
    // então os links de âncora precisam passar pelo próprio Lenis.
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }
      const link = (e.target as Element | null)?.closest?.("a");
      if (!(link instanceof HTMLAnchorElement) || link.target === "_blank") return;

      const url = new URL(link.href, window.location.href);
      const here = new URL(window.location.href);
      if (url.host !== here.host || url.pathname !== here.pathname || !url.hash) {
        return;
      }

      const target = document.querySelector(url.hash);
      if (!target) return;

      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, {
        onComplete: () => history.replaceState(null, "", url.hash),
      });
    }

    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(id);
      lenis.destroy();
    };
  }, []);

  return null;
}
