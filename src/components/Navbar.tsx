"use client";

import { useCallback, useEffect, useState } from "react";
import { navLinks, WHATSAPP_LINK } from "@/data/content";
import MarcaNavbar from "./MarcaNavbar";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // 0 = marca grande no centro da tela, 1 = assentada na navbar.
  const [assentou, setAssentou] = useState(0);

  const aoProgredir = useCallback((p: number) => setAssentou(p), []);

  const esperando: React.CSSProperties = {
    opacity: assentou,
    pointerEvents: assentou > 0.9 ? undefined : "none",
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          scrolled ? "bg-white/85 backdrop-blur-md border-b border-black/10" : "bg-transparent"
        }`}
      >
      <div className="wrap flex items-center justify-between py-4">
        <MarcaNavbar aoProgredir={aoProgredir} />

        {/* Enquanto a marca está grande no centro, o resto da navbar espera. */}
        <nav className="hidden md:flex items-center gap-8" style={esperando}>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-black/70 hover:text-black transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href={WHATSAPP_LINK}
          className="btn btn-primary hidden md:inline-flex"
          style={esperando}
        >
          Falar no WhatsApp
        </a>

        <button
          type="button"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5"
          style={esperando}
        >
          <span
            className={`block h-[1.5px] w-6 bg-black transition-transform duration-300 ${
              open ? "translate-y-[3.5px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-[1.5px] w-6 bg-black transition-transform duration-300 ${
              open ? "-translate-y-[3.5px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>
      </header>

      <div
        className={`md:hidden fixed inset-0 z-40 bg-white transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex h-full flex-col items-center justify-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-2xl font-medium"
            >
              {link.label}
            </a>
          ))}
          <a
            href={WHATSAPP_LINK}
            onClick={() => setOpen(false)}
            className="btn btn-primary mt-4"
          >
            Falar no WhatsApp
          </a>
        </nav>
      </div>
    </>
  );
}
