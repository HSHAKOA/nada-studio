"use client";

// Cada imagem de /portfolio, /equipe e /motion tem as larguras de
// images.deviceSizes geradas ao lado do original (nome-480.webp,
// nome-960.webp, nome-1600.webp).
export default function imageLoader({ src, width }: { src: string; width: number }) {
  if (!/^\/(portfolio|equipe|motion)\//.test(src)) return src;
  return src.replace(/\.\w+$/, `-${width}.webp`);
}
