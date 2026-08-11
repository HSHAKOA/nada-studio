import Marquee from "@/components/Marquee";
import { SiInstagram, SiWhatsapp } from "react-icons/si";
import {
  INSTAGRAM_LINK,
  WHATSAPP_LINK,
  navLinks,
  services,
  trustBadges,
} from "@/data/content";

export default function Footer() {
  return (
    <footer className="section-invert border-t border-white/10 py-16">
      <Marquee />
      <div className="wrap mt-14 grid gap-12 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <div>
          <span
            className="text-3xl"
            style={{ fontFamily: "var(--font-hand)" }}
          >
            NADA
          </span>
          <p className="mt-3 max-w-[32ch] text-white/60">
            Do nada nasce tudo. Sites, automação e aplicações sob medida pra
            quem quer devolver tempo pro que importa.
          </p>
          <div className="mt-6 flex items-center gap-4">
            <a
              href={WHATSAPP_LINK}
              aria-label="WhatsApp"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-white/40 hover:text-white"
            >
              <SiWhatsapp size={17} />
            </a>
            <a
              href={INSTAGRAM_LINK}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-white/40 hover:text-white"
            >
              <SiInstagram size={17} />
            </a>
          </div>
        </div>

        <div>
          <p className="eyebrow mb-5">Navegação</p>
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-white/70 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div>
          <p className="eyebrow mb-5">Serviços</p>
          <nav className="flex flex-col gap-3">
            {services.map((service) => (
              <a
                key={service.number}
                href="#o-que-fazemos"
                className="text-sm text-white/70 hover:text-white"
              >
                {service.title}
              </a>
            ))}
          </nav>
        </div>

        <div>
          <p className="eyebrow mb-5">Contato</p>
          <div className="flex flex-col gap-3 text-sm text-white/70">
            <a href={WHATSAPP_LINK} className="hover:text-white">
              WhatsApp
            </a>
            <a
              href={INSTAGRAM_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              Instagram
            </a>
            <a href="#comecar" className="hover:text-white">
              Fale com a gente
            </a>
          </div>
        </div>
      </div>

      <div className="wrap mt-14 flex flex-wrap gap-3 border-t border-white/10 pt-10">
        {trustBadges.map((badge) => (
          <span
            key={badge}
            className="inline-flex items-center rounded-full border border-white/15 px-4 py-2 text-xs font-medium text-white/60"
          >
            {badge}
          </span>
        ))}
      </div>

      <div className="wrap mt-10 flex flex-col gap-4 text-xs text-white/40 md:flex-row md:items-center md:justify-between">
        <span>© 2026 NADA Studio. Todos os direitos reservados.</span>
        <div className="flex gap-4">
          <a href="/termos-de-uso" className="hover:text-white/70">
            Termos de Uso
          </a>
          <a href="/politica-de-privacidade" className="hover:text-white/70">
            Política de Privacidade
          </a>
        </div>
        <span>Feito pela NADA Studio. Do nada nasce tudo.</span>
      </div>
    </footer>
  );
}
