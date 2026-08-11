"use client";

import dynamic from "next/dynamic";

const BigBangHero = dynamic(() => import("@/components/BigBangHero"), {
  ssr: false,
});

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-24"
    >
      <div className="wrap relative z-10 grid grid-cols-1 items-center gap-16 md:grid-cols-[1fr_1.15fr] md:gap-10">
        <div className="min-w-0">
          <p className="eyebrow mb-6">DO NADA NASCE TUDO</p>
          <h1 className="text-[clamp(40px,6vw,72px)]">
            Menos tarefa manual.
            <br />
            Mais tempo pro seu negócio.
          </h1>
          <p className="prose-measure mt-6 text-[18px] text-black/70">
            A gente cria seu site, automatiza o repetitivo e cuida de tudo por
            você. Você foca no que importa: vender.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href="#comecar" className="btn btn-primary">
              Começar do nada
            </a>
            <a href="#como-funciona" className="btn btn-secondary">
              Ver como funciona
            </a>
          </div>
        </div>

        <div className="relative h-[320px] min-w-0 md:h-[560px]">
          <BigBangHero logoSrc="/NADAlogopretatransparente.png" />
        </div>
      </div>
    </section>
  );
}
