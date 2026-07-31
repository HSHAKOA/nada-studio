import { INSTAGRAM_LINK, WHATSAPP_LINK, navLinks } from "@/data/content";

export default function Footer() {
  return (
    <footer className="section-invert border-t border-white/10 py-16">
      <div className="wrap flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div>
          <span
            className="text-3xl"
            style={{ fontFamily: "var(--font-hand)" }}
          >
            NADA
          </span>
          <p className="mt-2 text-white/60">Do nada nasce tudo.</p>
        </div>

        <nav className="flex flex-wrap gap-x-8 gap-y-3">
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

        <div className="flex flex-col gap-2 text-sm text-white/70">
          <a href={WHATSAPP_LINK} className="hover:text-white">
            WhatsApp
          </a>
          <a href={INSTAGRAM_LINK} className="hover:text-white">
            Instagram
          </a>
        </div>
      </div>

      <div className="wrap mt-14 text-xs text-white/40">
        © 2026 NADA Studio. Todos os direitos reservados.
      </div>
    </footer>
  );
}
