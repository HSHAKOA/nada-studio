import Link from "next/link";
import SectionMarker from "@/components/SectionMarker";

// 404 no mesmo sistema do resto do site: fundo claro (o cabeçalho aparece),
// tipografia grande e dois caminhos de volta. Sem efeito.
export default function NotFoundHero() {
  return (
    <section className="section flex min-h-[78svh] items-center">
      <div className="wrap">
        <SectionMarker label="Página não encontrada" number="404" />
        <h1 className="max-w-4xl text-[clamp(56px,10vw,148px)] font-black leading-[0.9] tracking-[-0.045em]">
          Nada por aqui.
        </h1>
        <p className="prose-measure mt-8 text-[18px] text-black/70">
          O endereço mudou ou nunca existiu. Do início dá pra chegar em tudo.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/" className="btn btn-primary">
            Ir para o início <span className="seta" aria-hidden>→</span>
          </Link>
          <Link href="/portfolio" className="btn btn-secondary">
            Ver o portfólio
          </Link>
        </div>
      </div>
    </section>
  );
}
