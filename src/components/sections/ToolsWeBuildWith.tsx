"use client";

import Reveal from "@/components/Reveal";
import SectionMarker from "@/components/SectionMarker";
import { sectionMarkers } from "@/data/content";
import { OpenAIIcon } from "@/components/icons/OpenAIIcon";
import {
  SiAnthropic,
  SiGoogle,
  SiMeta,
  SiN8N,
  SiSupabase,
  SiNextdotjs,
  SiStripe,
  SiVercel,
} from "react-icons/si";

const FERRAMENTAS = [
  {
    nome: "OpenAI",
    papel: "IA Generativa",
    desc: "Respostas automáticas inteligentes e extração de dados.",
    Icone: OpenAIIcon,
  },
  {
    nome: "Anthropic Claude",
    papel: "Raciocínio Avançado",
    desc: "Análise contextual profunda e apoio na tomada de decisão.",
    Icone: SiAnthropic,
  },
  {
    nome: "n8n",
    papel: "Automação de Fluxos",
    desc: "Conecta seus sistemas e roda rotinas no piloto automático.",
    Icone: SiN8N,
  },
  {
    nome: "Supabase",
    papel: "Banco de Dados & Auth",
    desc: "Armazenamento seguro em nuvem com sincronização em tempo real.",
    Icone: SiSupabase,
  },
  {
    nome: "Next.js",
    papel: "Alta Performance",
    desc: "Carregamento instantâneo e indexação máxima no Google.",
    Icone: SiNextdotjs,
  },
  {
    nome: "Google & Workspace",
    papel: "Agenda & E-mail",
    desc: "Sincronização de calendários, planilhas e notificações.",
    Icone: SiGoogle,
  },
  {
    nome: "Meta & WhatsApp",
    papel: "Mensageria & Alertas",
    desc: "Comunicação direta e disparos inteligentes para clientes.",
    Icone: SiMeta,
  },
  {
    nome: "Stripe & Pix",
    papel: "Pagamentos",
    desc: "Checkout transparente e confirmação instantânea de cobrança.",
    Icone: SiStripe,
  },
  {
    nome: "Vercel",
    papel: "Hospedagem Global",
    desc: "Infraestrutura com 99.9% de uptime e segurança de ponta.",
    Icone: SiVercel,
  },
];

export default function ToolsWeBuildWith() {
  return (
    <section id="ferramentas" className="section bg-[#fafafa]">
      <div className="wrap">
        <Reveal>
          <SectionMarker label="Ferramentas" number={sectionMarkers.tools} />
        </Reveal>
        <Reveal delay={80}>
          <h2 className="max-w-2xl text-[clamp(32px,4.2vw,52px)]">
            A gente constrói com quem já é bom nisso.
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="prose-measure mt-6 text-[18px] text-black/70">
            Nada de reinventar a roda. Escolhemos as tecnologias mais sólidas e modernas do mercado pra cada parte do seu negócio.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FERRAMENTAS.map((item, i) => {
            const Icon = item.Icone;
            return (
              <Reveal key={item.nome} delay={80 + i * 40}>
                <div className="group flex h-full flex-col justify-between rounded-2xl border border-black/10 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-black/30 hover:shadow-md">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-black/5 text-black transition-colors group-hover:bg-black group-hover:text-white">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="rounded-full bg-black/5 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider text-black/60">
                        {item.papel}
                      </span>
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-black">
                      {item.nome}
                    </h3>
                    <p className="mt-2 text-sm text-black/65">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
