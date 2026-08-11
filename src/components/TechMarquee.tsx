import type { ComponentType } from "react";
import { Bot, BarChart3, Sparkles } from "lucide-react";
import {
  SiAnthropic,
  SiDeepseek,
  SiGoogle,
  SiGooglegemini,
  SiHuggingface,
  SiMeta,
  SiN8N,
  SiNotebooklm,
  SiOllama,
  SiSupabase,
  SiX,
} from "react-icons/si";

type Tech = { nome: string; Icone: ComponentType<{ className?: string }> };

// Manus, OpenAI e Power BI não têm logo no Simple Icons (removidos a pedido das
// marcas), então entram com ícone conceitual do lucide.
const TECHS: Tech[] = [
  { nome: "Manus", Icone: Bot },
  { nome: "OpenAI", Icone: Sparkles },
  { nome: "Gemini", Icone: SiGooglegemini },
  { nome: "Meta", Icone: SiMeta },
  { nome: "Grok", Icone: SiX },
  { nome: "Anthropic", Icone: SiAnthropic },
  { nome: "Google Flow", Icone: SiGoogle },
  { nome: "Google Workspace", Icone: SiGoogle },
  { nome: "Power BI", Icone: BarChart3 },
  { nome: "NotebookLM", Icone: SiNotebooklm },
  { nome: "n8n", Icone: SiN8N },
  { nome: "Ollama", Icone: SiOllama },
  { nome: "Hugging Face", Icone: SiHuggingface },
  { nome: "DeepSeek", Icone: SiDeepseek },
  { nome: "Supabase", Icone: SiSupabase },
];

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <div
      className="flex shrink-0 items-center gap-12 pr-12"
      aria-hidden={hidden || undefined}
    >
      {TECHS.map(({ nome, Icone }) => (
        <span
          key={nome}
          className="flex items-center gap-2.5 whitespace-nowrap text-lg font-medium tracking-tight text-neutral-400 transition-colors duration-300 hover:text-black"
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
      <p className="mb-5 text-center text-xs uppercase tracking-[0.2em] text-neutral-400">
        Construído com
      </p>
      {/* A segunda cópia é só pro loop fechar sem emenda — leitor de tela lê a primeira. */}
      <div className="marquee-track" style={{ animationDuration: "28s" }}>
        <Row />
        <Row hidden />
      </div>
    </section>
  );
}
