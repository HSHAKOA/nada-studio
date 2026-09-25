import type { Projeto } from "@/data/portfolio";

// Prints extras do projeto, mostrados no detalhe. Sem galeria, não renderiza nada.
export default function GaleriaProjeto({ projeto }: { projeto: Projeto }) {
  if (!projeto.galeria?.length) return null;

  return (
    <div data-bloco className="space-y-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-black/50">
        Por dentro
      </p>
      {projeto.galeria.map((item) => (
        // Print em pé (celular) na largura toda vira uma torre: limita a largura.
        <figure key={item.src} className={item.altura > item.largura ? "mx-auto max-w-[320px]" : undefined}>
          <div className="overflow-hidden rounded-2xl border border-black/10 bg-black/5 shadow-xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.src}
              alt={item.legenda}
              width={item.largura}
              height={item.altura}
              loading="lazy"
              decoding="async"
              className="w-full h-auto"
            />
          </div>
          <figcaption className="mt-2 text-xs text-black/60">{item.legenda}</figcaption>
        </figure>
      ))}
    </div>
  );
}
