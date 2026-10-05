import Image from "next/image";
import type { Projeto } from "@/data/portfolio";

// Imagens reais do projeto, na página do case. Sem galeria, não renderiza nada.
export default function GaleriaProjeto({ projeto }: { projeto: Projeto }) {
  if (!projeto.galeria?.length) return null;

  return (
    <section aria-label="Imagens do projeto" className="wrap py-[clamp(56px,8vw,112px)]">
      <p className="eyebrow mb-8">Por dentro</p>
      <div className="space-y-14">
        {projeto.galeria.map((item) => {
          // Print em pé (celular) na largura toda vira uma torre: limita a largura.
          const emPe = item.altura > item.largura;
          return (
            <figure key={item.src} className={emPe ? "mx-auto max-w-[360px]" : undefined}>
              <div data-entra="imagem" className="overflow-hidden border border-black/10 bg-black/[0.03]">
                <Image
                  src={item.src}
                  alt={item.legenda}
                  width={item.largura}
                  height={item.altura}
                  sizes={emPe ? "360px" : "(min-width: 1248px) 1104px, 100vw"}
                  className="assenta h-auto w-full"
                />
              </div>
              <figcaption className="mt-3 text-sm text-black/60">{item.legenda}</figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
}
