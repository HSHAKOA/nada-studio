import type { ComponentType } from "react";
import {
  SiAnthropic,
  SiGoogle,
  SiMeta,
  SiN8N,
  SiSupabase,
} from "react-icons/si";
import { OpenAIIcon } from "@/components/icons/OpenAIIcon";

type Tech = { nome: string; Icone: ComponentType<{ className?: string }> };

const TECHS: Tech[] = [
  { nome: "OpenAI", Icone: OpenAIIcon },
  { nome: "Anthropic", Icone: SiAnthropic },
  { nome: "Google", Icone: SiGoogle },
  { nome: "Meta", Icone: SiMeta },
  { nome: "n8n", Icone: SiN8N },
  { nome: "Supabase", Icone: SiSupabase },
];

// Só 6 itens não preenchem a largura da tela sozinhos, então cada linha repete
// o conjunto pra garantir que o loop feche sem deixar espaço em branco.
const TECHS_LOOP: Tech[] = [...TECHS, ...TECHS, ...TECHS];

function Row() {
  return (
    <div className="flex shrink-0 items-center gap-12 pr-12">
      {TECHS_LOOP.map(({ nome, Icone }, i) => (
        <span
          key={`${nome}-${i}`}
          className="flex items-center gap-2.5 whitespace-nowrap text-lg font-medium tracking-tight text-black/60 transition-colors duration-300 hover:text-black"
        >
          <Icone className="h-[1.1em] w-[1.1em] shrink-0" />
          {nome}
        </span>
      ))}
    </div>
  );
}

export default function TechMarquee() {
  return (
    <section
      className="marquee-viewport overflow-hidden border-y border-black/10 py-8"
      aria-label="Tecnologias que usamos"
    >
      <p className="mb-5 text-center text-xs uppercase tracking-[0.2em] text-black/60">
        Construímos com
      </p>
      {/* Duas cópias da linha (já repetida 3x) fecham o loop sem emenda; o
          conjunto é decorativo, então a faixa toda fica fora da árvore de
          acessibilidade e o aria-label da section já descreve o conteúdo. */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent backdrop-blur-[2px] sm:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent backdrop-blur-[2px] sm:w-32" />
        <div
          className="marquee-track"
          style={{ animationDuration: "28s" }}
          aria-hidden="true"
        >
          <Row />
          <Row />
        </div>
      </div>
    </section>
  );
}
