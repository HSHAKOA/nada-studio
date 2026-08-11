const TECHS = [
  "Manus",
  "OpenAI",
  "Gemini",
  "Meta",
  "Grok",
  "Anthropic",
  "Google Flow",
  "Google Workspace",
  "Power BI",
  "NotebookLM",
  "n8n",
  "Ollama",
  "Hugging Face",
  "DeepSeek",
  "Supabase",
];

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <div
      className="flex shrink-0 items-center gap-12 pr-12"
      aria-hidden={hidden || undefined}
    >
      {TECHS.map((tech) => (
        <span
          key={tech}
          className="whitespace-nowrap text-lg font-medium tracking-tight text-neutral-400 transition-colors duration-300 hover:text-black"
        >
          {tech}
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
