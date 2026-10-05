import type { PapelPonto } from "@/lib/ponto";

// O ponto da marca numa estação (ver src/lib/ponto.ts). O papel fica no DOM
// pra deixar claro, no inspetor, o que cada ponto está fazendo.
export default function Ponto({ papel, className = "" }: { papel: PapelPonto; className?: string }) {
  return <span aria-hidden data-papel={papel} className={`ponto ${className}`} />;
}
