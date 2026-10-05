import Link from "next/link";
import Marquee from "@/components/Marquee";
import NadaWordmark from "@/components/NadaWordmark";
import { SiGooglemaps, SiInstagram, SiWhatsapp } from "react-icons/si";
import {
  GOOGLE_REVIEW_LINK,
  INSTAGRAM_LINK,
  WHATSAPP_LINK,
  navLinks,
  services,
  trustBadges,
} from "@/data/content";

// Só o ícone, sem caixa: a área de toque de 44 px continua, e o recuo da
// fileira (-ml-3) alinha o primeiro ícone com o texto de cima.
const ICONE = "flex h-11 w-11 items-center justify-center text-white/70 transition-colors hover:text-white";
const LINK = "link-u self-start py-3 text-sm text-white/70 hover:text-white";

export default function Footer() {
  return (
    <footer className="section-invert border-t border-white/10 py-16">
      <Marquee />
      <div className="wrap mt-14 grid gap-12 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <div>
          {/* A marca nunca aparece como "NADA" solto: é o logotipo. */}
          <NadaWordmark className="w-[120px] fill-white" />
          <p className="mt-4 max-w-[32ch] text-white/60">
            Do nada nasce tudo. Sites, tarefa repetitiva e ferramenta sob
            medida pra quem quer o tempo de volta.
          </p>
          <div className="mt-6 -ml-3 flex items-center gap-1">
            <a href={WHATSAPP_LINK} aria-label="WhatsApp" className={ICONE}>
              <SiWhatsapp size={20} aria-hidden="true" />
            </a>
            <a href={INSTAGRAM_LINK} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={ICONE}>
              <SiInstagram size={20} aria-hidden="true" />
            </a>
            <a
              href={GOOGLE_REVIEW_LINK}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Avalie a gente no Google"
              className={ICONE}
            >
              <SiGooglemaps size={20} aria-hidden="true" />
            </a>
          </div>
        </div>

        <div>
          <p className="eyebrow mb-3">Navegação</p>
          <nav className="flex flex-col">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={LINK}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <p className="eyebrow mb-3">Serviços</p>
          <nav className="flex flex-col">
            {services.map((service) => (
              <Link key={service.number} href="/#o-que-fazemos" className={LINK}>
                {service.title}
              </Link>
            ))}
            <Link href="/motion" className={LINK}>
              Vídeo e motion
            </Link>
            <Link href="/ia-para-empresas" className={LINK}>
              IA para empresas
            </Link>
          </nav>
        </div>

        <div>
          <p className="eyebrow mb-3">Contato</p>
          <div className="flex flex-col">
            <a href={WHATSAPP_LINK} className={LINK}>
              WhatsApp
            </a>
            <a href={INSTAGRAM_LINK} target="_blank" rel="noopener noreferrer" className={LINK}>
              Instagram
            </a>
          </div>
        </div>
      </div>

      {/* Selos como texto puro, sem caixa em volta. */}
      <div className="wrap mt-14 flex flex-wrap gap-x-8 gap-y-2 border-t border-white/10 pt-10">
        {trustBadges.map((badge) => (
          <span key={badge} className="text-xs font-medium text-white/60">
            {badge}
          </span>
        ))}
      </div>

      <div className="wrap mt-10 flex flex-col gap-2 text-xs text-white/50 md:flex-row md:items-center md:justify-between">
        <span>© 2026 NADA Studio. Todos os direitos reservados.</span>
        <div className="flex gap-5">
          <Link href="/termos-de-uso" className="link-u py-3.5 hover:text-white/80">
            Termos de Uso
          </Link>
          <Link href="/politica-de-privacidade" className="link-u py-3.5 hover:text-white/80">
            Política de Privacidade
          </Link>
        </div>
        <span>Jundiaí e região. Brasil inteiro no remoto.</span>
      </div>
    </footer>
  );
}
