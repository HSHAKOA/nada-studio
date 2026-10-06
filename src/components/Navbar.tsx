"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks, WHATSAPP_LINK } from "@/data/content";
import NadaWordmark from "./NadaWordmark";
import TrocaDeLetras from "./TrocaDeLetras";
import { travarScroll } from "@/lib/scrollLock";
import { MQ } from "@/lib/motion";

// Rótulo que troca por máscara no hover: o texto sobe e uma cópia entra por
// baixo, dentro da própria caixa da linha (CSS em .rolo, globals.css).
function Rolo({ children }: { children: string }) {
  return (
    <span className="rolo">
      <span>{children}</span>
      <span aria-hidden>{children}</span>
    </span>
  );
}

// Cabeçalho protegido pelo PDF auditado: o desenho segue igual, e o menu do
// celular voltou ao original. Mudou o comportamento: o menu completo só a
// partir de 1180 px (limite medido com sete links; hoje são seis), a página atual
// marcada, a troca de letras em sequência no hover dos links (o botão segue com o
// rolo) e o recolher ao descer (volta ao subir), que tira a barra de cima das
// seções escuras.
export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [recolhido, setRecolhido] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  // Aberto pelo teclado (Enter/Espaço): só aí o foco entra no menu. Com toque
  // ou mouse, mover o foco desenhava um contorno em volta do primeiro link.
  const peloTeclado = useRef(false);

  useEffect(() => {
    let ultimo = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      // Tolerância: tremida de poucos pixels não esconde nem mostra.
      if (Math.abs(y - ultimo) < 8) return;
      setRecolhido(y > ultimo && y > 160);
      ultimo = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menu aberto: trava a página, deixa o resto inerte (o foco não escapa pra
  // trás do menu) e fecha no Esc. Pelo teclado, o foco vai pro primeiro link.
  useEffect(() => {
    if (!open) return;
    const destravar = travarScroll();
    const fundo = document.querySelectorAll<HTMLElement>("main, footer");
    fundo.forEach((el) => (el.inert = true));
    if (peloTeclado.current) menuRef.current?.querySelector("a")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);

    // Girar o tablet ou alargar a janela até o menu completo: o do celular
    // some (menu:hidden), então fecha de vez. Aberto, ele deixava a página
    // travada e inerte por trás de um menu que ninguém via. O foco que estava
    // num link dele vai pro logotipo (o botão do menu também some).
    const largo = matchMedia(MQ.menu);
    const aoAlargar = () => {
      if (!largo.matches) return;
      if (menuRef.current?.contains(document.activeElement)) {
        document.querySelector<HTMLElement>('header a[href="/"]')?.focus();
      }
      setOpen(false);
    };
    largo.addEventListener("change", aoAlargar);

    return () => {
      window.removeEventListener("keydown", onKey);
      largo.removeEventListener("change", aoAlargar);
      fundo.forEach((el) => (el.inert = false));
      destravar();
    };
  }, [open]);

  const atual = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header
        data-recolhido={(recolhido && !open) || undefined}
        className={`cabecalho fixed inset-x-0 top-0 z-50 ${
          open
            ? "bg-transparent"
            : scrolled
              ? "bg-white/85 backdrop-blur-md border-b border-black/10"
              : "bg-transparent"
        }`}
      >
      <div className="wrap flex items-center justify-between py-4">
        <Link
          href="/"
          aria-label="NADA Studio, início"
          className="relative transition-transform duration-300 ease-[var(--ease-out)] hover:scale-[1.03] active:scale-[0.97]"
        >
          <NadaWordmark className="w-[120px]" />
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-8 menu:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={atual(link.href) ? "page" : undefined}
              className="nav-link"
            >
              <TrocaDeLetras label={link.label} />
            </Link>
          ))}
        </nav>

        <a href={WHATSAPP_LINK} className="btn btn-primary btn-pill hidden menu:inline-flex">
          <Rolo>Falar no WhatsApp</Rolo>
        </a>

        <button
          ref={toggleRef}
          type="button"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          aria-controls="menu-mobile"
          onClick={(e) => {
            // detail 0: clique gerado por Enter/Espaço, não por toque ou mouse.
            peloTeclado.current = e.detail === 0;
            setOpen((v) => !v);
          }}
          className="relative z-50 flex h-11 w-11 flex-col items-center justify-center gap-1.5 menu:hidden"
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

      {/* Menu do celular: o desenho original (fundo branco, links centralizados).
          Ao abrir, a visibilidade vira na hora; ao fechar, espera o fade, e
          fechado ele sai do teclado.
          Os links ficam numa faixa que começa abaixo do cabeçalho (top-24) e
          rola sozinha quando não cabem: tela baixa, celular deitado, zoom de
          200% a 400%. O pb-24 espelha esse topo, então quando cabem eles
          continuam centralizados na tela inteira, no mesmo lugar de antes.
          data-lenis-prevent: com mouse (janela estreita, zoom) o Lenis fica
          parado enquanto o menu está aberto e engolia a roda; assim a faixa
          rola nativa. */}
      <div
        id="menu-mobile"
        ref={menuRef}
        className={`fixed inset-0 z-40 bg-white duration-300 menu:hidden ${
          open ? "visible opacity-100 transition-opacity" : "invisible opacity-0 transition-[opacity,visibility]"
        }`}
      >
        <div data-lenis-prevent className="absolute inset-x-0 top-24 bottom-0 overflow-y-auto overscroll-contain">
          <nav aria-label="Menu" className="flex min-h-full flex-col items-center justify-center gap-8 pb-24">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={atual(link.href) ? "page" : undefined}
                className="text-2xl font-medium"
              >
                {link.label}
              </Link>
            ))}
            <a href={WHATSAPP_LINK} onClick={() => setOpen(false)} className="btn btn-primary mt-4">
              Falar no WhatsApp
            </a>
          </nav>
        </div>
      </div>
    </>
  );
}
