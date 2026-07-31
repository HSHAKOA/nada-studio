"use client";

import dynamic from "next/dynamic";

const HeroScene = dynamic(() => import("@/components/scene/HeroScene"), {
  ssr: false,
});

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-24"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center font-bold text-[26vw] leading-none text-black/[0.04]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        NADA
      </span>

      <div className="wrap relative z-10 grid items-center gap-10 md:grid-cols-2">
        <div>
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

        <div className="relative h-[360px] md:h-[520px]">
          <HeroScene />
        </div>
      </div>
    </section>
  );
}
