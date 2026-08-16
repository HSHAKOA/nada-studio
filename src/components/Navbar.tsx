"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { navLinks, WHATSAPP_LINK } from "@/data/content";
import NadaWordmark from "./NadaWordmark";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
        <Link
          href="/"
          aria-label="NADA Studio, início"
          className="group relative transition-transform duration-300 hover:scale-[1.03] active:scale-[0.97]"
        >
          <NadaWordmark className="w-[120px] transition-all duration-300 group-hover:drop-shadow-[0_2px_12px_rgba(0,0,0,0.2)]" />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-black/70 hover:text-black transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <a
          href={WHATSAPP_LINK}
          className="btn btn-primary hidden md:inline-flex"
         
        >
          Falar no WhatsApp
        </a>

        <button
          type="button"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5"
         
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
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-2xl font-medium"
            >
              {link.label}
            </Link>
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
