import type { ComponentType, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 100 100",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

// 01 — janela de navegador
export function SiteIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="12" y="20" width="76" height="60" rx="2" />
      <line x1="12" y1="36" x2="88" y2="36" />
      <circle cx="22" cy="28" r="2.2" fill="currentColor" stroke="none" />
      <circle cx="31" cy="28" r="2.2" fill="currentColor" stroke="none" />
      <circle cx="40" cy="28" r="2.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

// 02 — caixa com check e setas descendo
export function ManualIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M50 12v34" />
      <path d="M38 34 50 46 62 34" />
      <path d="M20 46 20 82 80 82 80 46" />
      <path d="M38 64 46 72 64 56" />
    </svg>
  );
}

// 03 — escudo com check
export function PaginaIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M50 14 82 26v24c0 22-14 34-32 36-18-2-32-14-32-36V26Z" />
      <path d="M36 50 46 60 66 38" />
    </svg>
  );
}

// 04 — alvo concêntrico
export function AnuncioIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="50" cy="50" r="36" />
      <circle cx="50" cy="50" r="21" />
      <circle cx="50" cy="50" r="6" fill="currentColor" stroke="none" />
    </svg>
  );
}

// 05 — dois blocos com setas em ciclo
export function IntegracaoIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="14" y="16" width="26" height="26" rx="2" />
      <rect x="60" y="58" width="26" height="26" rx="2" />
      <path d="M40 24h30a10 10 0 0 1 10 10v6" />
      <path d="M74 34 82 40 74 46" />
      <path d="M60 76H30a10 10 0 0 1-10-10v-6" />
      <path d="M26 66 18 60 26 54" />
    </svg>
  );
}

// 06 — coroa desenhada à mão
export function SobMedidaIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M16 40 32 56 50 26 68 56 84 40 78 74H22Z" />
      <path d="M22 74h56" />
    </svg>
  );
}

export type IconeServico =
  | "site"
  | "manual"
  | "pagina"
  | "anuncio"
  | "integracao"
  | "sobMedida";

export const serviceIcons: Record<IconeServico, ComponentType<IconProps>> = {
  site: SiteIcon,
  manual: ManualIcon,
  pagina: PaginaIcon,
  anuncio: AnuncioIcon,
  integracao: IntegracaoIcon,
  sobMedida: SobMedidaIcon,
};
