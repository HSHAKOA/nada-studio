import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Capa from "@/components/Capa";
import SectionMarker from "@/components/SectionMarker";
import WhatsAppFixo from "@/components/WhatsAppFixo";
import CTA from "@/components/sections/CTA";
import GaleriaProjeto from "@/components/sections/GaleriaProjeto";
import { PROJETOS, ROTULO_TIPO, projetoPorSlug } from "@/data/portfolio";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return PROJETOS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const projeto = projetoPorSlug((await params).slug);
  if (!projeto) return {};
  const titulo = `${projeto.nome} · ${projeto.subtitulo}`;
  const descricao = `${projeto.subtitulo} feito pela NADA Studio. ${projeto.chamada}`;
  // Sobrescrever openGraph descarta o da raiz: a imagem padrão volta explícita.
  // ponytail: imagem de compartilhamento própria por case quando houver arte 1200×630.
  const imagem = { url: "/opengraph-image.png", width: 1200, height: 630, alt: "NADA Studio · Do nada nasce tudo" };
  return {
    title: titulo,
    description: descricao,
    alternates: { canonical: `/portfolio/${projeto.slug}` },
    openGraph: {
      type: "article",
      locale: "pt_BR",
      siteName: "NADA Studio",
      url: `/portfolio/${projeto.slug}`,
      title: `${titulo} · NADA Studio`,
      description: descricao,
      images: [imagem],
    },
    twitter: {
      card: "summary_large_image",
      title: `${titulo} · NADA Studio`,
      description: descricao,
      images: [imagem],
    },
  };
}

function Bloco({ rotulo, texto }: { rotulo: string; texto: string }) {
  return (
    <div>
      <p className="eyebrow">{rotulo}</p>
      <p className="prose-measure mt-3 text-[18px] leading-relaxed text-black/75">{texto}</p>
    </div>
  );
}

// Página do case: enxuta. Capa, problema, solução, resultado, número real
// (quando há), imagens reais e CTA. Nada inventado.
export default async function CasePage({ params }: Props) {
  const projeto = projetoPorSlug((await params).slug);
  if (!projeto) notFound();

  const proximo = PROJETOS[(PROJETOS.indexOf(projeto) + 1) % PROJETOS.length];
  const nosso = projeto.tipo === "interno";
  // Mensagem do WhatsApp já pronta: qual projeto e por que a pessoa se viu nele.
  const identifiquei = `Oi! Vi o projeto ${projeto.nome} no site da NADA Studio e me identifiquei: ${projeto.identifica}. ${
    nosso ? "Quero entender se dá pra adaptar pro meu negócio." : "Quero conversar sobre algo assim pro meu negócio."
  }`;
  // Ferramenta do Hub aponta pro Hub; o Hub lista as ferramentas dele.
  const mae = projeto.parteDe ? projetoPorSlug(projeto.parteDe) : undefined;
  const ferramentas = PROJETOS.filter((p) => p.parteDe === projeto.slug);
  const mensagem = projeto.cta?.mensagem ?? identifiquei;

  return (
    <>
      <Navbar />
      <main className="pt-24">
        <article>
          <div className="wrap pt-6">
            <Link href="/portfolio" className="link-u inline-block py-3 text-sm text-black/70">
              <span aria-hidden>←</span> Todos os projetos
            </Link>
            <div className="mt-4">
              <Capa projeto={projeto} formato="case" sizes="(min-width: 1248px) 1104px, 100vw" preload />
            </div>
          </div>

          <div className="wrap grid gap-12 py-[clamp(56px,8vw,112px)] md:grid-cols-12">
            <header className="md:col-span-5">
              <SectionMarker label={ROTULO_TIPO[projeto.tipo]} number={projeto.num} />
              <h1 data-entra="titulo" className="text-[clamp(40px,5.5vw,72px)] font-black leading-[0.95] tracking-[-0.035em]">
                {projeto.nome}
              </h1>
              <p className="mt-5 text-lg text-black/65">{projeto.subtitulo}</p>
              <dl className="regua-topo mt-8 pt-5">
                <dt className="eyebrow">Entrega</dt>
                <dd className="mt-1 text-lg">{projeto.entrega}</dd>
                {mae && (
                  <>
                    <dt className="eyebrow mt-5">Faz parte de</dt>
                    <dd className="mt-1 text-lg">
                      <Link href={`/portfolio/${mae.slug}`} className="link-u">
                        {mae.nome}
                      </Link>
                    </dd>
                  </>
                )}
                {/* O selo do índice, aqui em preto e explicado. */}
                {projeto.selo && (
                  <>
                    <dt className="eyebrow mt-5 text-black">{projeto.selo.rotulo}</dt>
                    <dd className="mt-1 text-lg">{projeto.selo.texto}</dd>
                  </>
                )}
              </dl>
              {projeto.link && projeto.linkLabel && (
                <a href={projeto.link} target="_blank" rel="noopener noreferrer" className="btn btn-secondary mt-8">
                  {projeto.linkLabel} <span className="seta" aria-hidden>↗</span>
                </a>
              )}
            </header>

            <div className="space-y-10 md:col-span-7">
              <Bloco rotulo="O problema" texto={`${projeto.antes} ${projeto.problema}`} />
              <Bloco rotulo="O que a gente fez" texto={projeto.depois} />
              <Bloco rotulo="O resultado" texto={projeto.resultado} />
            </div>
          </div>

          {/* Quando a capa já é o número, ele não se repete aqui. */}
          {projeto.metrica && projeto.capa.tipo !== "numero" && (
            <div data-escuro className="section-invert">
              <div className="wrap py-[clamp(56px,9vw,128px)]">
                <p className="eyebrow">O número</p>
                <p className="mt-6 text-[clamp(64px,12vw,184px)] font-black leading-[0.9] tracking-[-0.05em]">
                  {projeto.metrica.valor}
                </p>
                <p className="mt-5 max-w-xl text-lg text-white/65">{projeto.metrica.legenda}</p>
              </div>
            </div>
          )}

          <GaleriaProjeto projeto={projeto} />

          {/* O Hub é a junção de várias ferramentas: cada uma tem a página dela. */}
          {ferramentas.length > 0 && (
            <section aria-labelledby="dentro" className="wrap pb-[clamp(56px,8vw,112px)]">
              <p className="eyebrow">O que tem dentro</p>
              <h2 id="dentro" data-entra="titulo" className="mt-3 max-w-2xl text-[clamp(28px,3.4vw,44px)]">
                Dá pra levar o {projeto.nome} inteiro, ou só a parte que você precisa.
              </h2>
              <ul data-entra="linha" className="regua-topo mt-10">
                {ferramentas.map((ferramenta) => (
                  <li key={ferramenta.slug} data-entra="linha" className="regua">
                    <Link href={`/portfolio/${ferramenta.slug}`} className="group flex items-baseline gap-4 py-6">
                      <span className="w-7 shrink-0 text-sm text-black/40">{ferramenta.num}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[clamp(22px,2.6vw,32px)] font-bold leading-[1.1] tracking-tight">
                          <span className="link-u">{ferramenta.nome}</span>
                        </span>
                        <span className="mt-2 block text-[15px] text-black/65">{ferramenta.chamada}</span>
                      </span>
                      <span aria-hidden className="seta shrink-0 text-lg">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>

        {/* Antes da chamada final: o caminho de leitura continua e a página
            termina no preto da chamada, sem tira branca solta no fim. */}
        <nav aria-label="Próximo projeto" className="wrap">
          <Link
            href={`/portfolio/${proximo.slug}`}
            className="group regua-topo flex items-baseline justify-between gap-6 pt-10 pb-[clamp(56px,8vw,112px)]"
          >
            <span>
              <span className="eyebrow block">Próximo projeto</span>
              <span className="mt-2 block text-[clamp(26px,3.4vw,44px)] font-bold tracking-tight">
                <span className="link-u">{proximo.nome}</span>
              </span>
            </span>
            <span aria-hidden className="seta text-2xl">
              →
            </span>
          </Link>
        </nav>

        <CTA
          numero=""
          titulo={nosso ? "É nosso. Pode ser seu." : "Se viu nesse projeto?"}
          texto={
            projeto.cta?.texto ??
            (nosso
              ? "A gente adapta essa solução pro jeito que o seu negócio funciona. A mensagem já vai pronta, é só mandar."
              : "A mensagem já vai pronta, com o projeto e o motivo. É só mandar.")
          }
          botao={projeto.cta?.botao ?? "Me identifiquei com esse projeto"}
          mensagem={mensagem}
        />
      </main>
      <Footer />
      <WhatsAppFixo mensagem={mensagem} />
    </>
  );
}
