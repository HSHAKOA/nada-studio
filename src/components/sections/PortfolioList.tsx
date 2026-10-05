"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import Capa from "@/components/Capa";
import SectionMarker from "@/components/SectionMarker";
import { sectionMarkers } from "@/data/content";
import { GRUPOS, PROJETOS, type TipoProjeto } from "@/data/portfolio";
import { MQ, useMedia } from "@/lib/motion";

const ORDEM: TipoProjeto[] = ["cliente", "interno"];

// No celular a primeira capa já aparece na primeira tela e é a maior pintura
// da página: vai com prioridade (Capa, prioridade).
const PRIMEIRA_CAPA = ORDEM.flatMap((tipo) => PROJETOS.filter((p) => p.tipo === tipo)).find(
  (p) => p.capa.tipo !== "tipografica"
)?.slug;
const NUMERO: Record<TipoProjeto, string> = { cliente: sectionMarkers.clientes, interno: sectionMarkers.nosso };
const porSlug = (slug: string) => PROJETOS.find((p) => p.slug === slug) ?? PROJETOS[0];

type Previa = { ativo: string; anterior: string | null; aberta: boolean };
type Atualizar = (fn: (p: Previa) => Previa) => void;

// Projeto novo na prévia. Com ela já aberta, a capa nova entra por cima da
// anterior (troca cruzada, sem fundo vazando); abrindo agora, entra seca.
function ver(set: Atualizar, slug: string, cruzarSempre = false) {
  set((p) => {
    if (p.ativo === slug && p.aberta) return p;
    const cruzar = (cruzarSempre || p.aberta) && p.ativo !== slug;
    return { ativo: slug, anterior: cruzar ? p.ativo : null, aberta: true };
  });
}

function fechar(set: Atualizar) {
  set((p) => (p.aberta ? { ...p, aberta: false } : p));
}

// Índice editorial do portfólio. Celular: capa acima de cada item (só as que
// têm imagem real). Tablet: capa fixa ao lado da lista, trocando com o item
// que passa pelo meio da tela. Desktop com mouse: a capa acompanha o ponteiro
// numa faixa à direita do texto, com um pouco de inércia, e só existe enquanto
// o ponteiro está sobre uma linha de projeto. A linha tem toda a informação em
// texto; a capa nunca é a única fonte.
export default function PortfolioList() {
  const tablet = useMedia(MQ.tablet);
  const flutuante = useMedia(MQ.flutuante);
  const [{ ativo, anterior, aberta }, setPrevia] = useState<Previa>({
    ativo: PROJETOS[0].slug,
    anterior: null,
    aberta: false,
  });
  const indiceRef = useRef<HTMLDivElement>(null);
  const previaRef = useRef<HTMLDivElement>(null);
  const colunaFixa = tablet && !flutuante;
  const visivel = colunaFixa || (flutuante && aberta);

  // Desktop: a prévia segue o ponteiro, mas só aparece sobre uma linha válida.
  useEffect(() => {
    const indice = indiceRef.current;
    const previa = previaRef.current;
    if (!indice || !previa || !flutuante) return;

    const xTo = gsap.quickTo(previa, "x", { duration: 0.45, ease: "power3" });
    const yTo = gsap.quickTo(previa, "y", { duration: 0.45, ease: "power3" });
    let linha: HTMLElement | null = null;
    let px = -1;
    let py = -1;
    let quadro = 0;

    // Faixa da prévia: à direita do nome e da chamada da linha, nunca em cima
    // deles; pode cobrir a coluna da entrega, que repete a informação.
    function posicao(el: HTMLElement, cx: number, cy: number) {
      const w = previa!.offsetWidth;
      const h = previa!.offsetHeight;
      const fimTexto = Math.max(
        ...Array.from(el.querySelectorAll<HTMLElement>("[data-texto]"), (t) => t.getBoundingClientRect().right)
      );
      const x = Math.min(Math.max(cx + 40, fimTexto + 40), innerWidth - w - 24);
      const y = gsap.utils.clamp(24, innerHeight - h - 24, cy - h / 2);
      return [x, y];
    }

    function mostrar(el: HTMLElement, cx: number, cy: number) {
      const [x, y] = posicao(el, cx, cy);
      if (linha) {
        xTo(x);
        yTo(y);
      } else {
        // Abrindo: nasce no lugar, sem voar de onde estava.
        xTo(x, x);
        yTo(y, y);
      }
      if (el !== linha) ver(setPrevia, el.dataset.slug ?? "");
      linha = el;
    }

    function esconder() {
      if (!linha) return;
      linha = null;
      fechar(setPrevia);
    }

    function aoMover(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      px = e.clientX;
      py = e.clientY;
      const el = (e.target as Element).closest<HTMLElement>(".indice-item");
      if (el && indice!.contains(el)) mostrar(el, px, py);
      else esconder();
    }

    // Rolagem com o mouse parado: a linha sob o ponteiro muda (ou some).
    // Confere pelo ponto real, não pelo :hover, que o Safari só atualiza
    // quando o mouse mexe.
    function aoRolar() {
      if (!linha || quadro) return;
      quadro = requestAnimationFrame(() => {
        quadro = 0;
        if (!linha) return;
        const el = document.elementFromPoint(px, py)?.closest<HTMLElement>(".indice-item");
        if (el && indice!.contains(el)) mostrar(el, px, py);
        else esconder();
      });
    }

    // Teclado: a prévia acompanha a linha em foco.
    function aoFocar(e: FocusEvent) {
      const alvo = e.target as Element;
      const el = alvo.closest<HTMLElement>(".indice-item");
      if (!el || !alvo.matches(":focus-visible")) return;
      const r = el.getBoundingClientRect();
      px = -1;
      mostrar(el, r.left, r.top + r.height / 2);
    }

    function aoDesfocar(e: FocusEvent) {
      if (!indice!.contains(e.relatedTarget as Node | null)) esconder();
    }

    indice.addEventListener("pointermove", aoMover);
    indice.addEventListener("pointerleave", esconder);
    indice.addEventListener("focusin", aoFocar);
    indice.addEventListener("focusout", aoDesfocar);
    window.addEventListener("scroll", aoRolar, { passive: true });
    window.addEventListener("blur", esconder);
    document.addEventListener("visibilitychange", esconder);

    return () => {
      indice.removeEventListener("pointermove", aoMover);
      indice.removeEventListener("pointerleave", esconder);
      indice.removeEventListener("focusin", aoFocar);
      indice.removeEventListener("focusout", aoDesfocar);
      window.removeEventListener("scroll", aoRolar);
      window.removeEventListener("blur", esconder);
      document.removeEventListener("visibilitychange", esconder);
      cancelAnimationFrame(quadro);
      gsap.killTweensOf(previa);
      gsap.set(previa, { clearProps: "transform" });
      fechar(setPrevia);
    };
  }, [flutuante]);

  // Tablet: a capa da coluna acompanha o item que passa pelo meio da tela.
  useEffect(() => {
    const indice = indiceRef.current;
    if (!colunaFixa || !indice) return;
    const io = new IntersectionObserver(
      (entradas) => entradas.forEach((e) => e.isIntersecting && ver(setPrevia, (e.target as HTMLElement).dataset.slug ?? "", true)),
      { rootMargin: "-45% 0px -45% 0px" }
    );
    indice.querySelectorAll("[data-slug]").forEach((el) => io.observe(el));
    return () => {
      io.disconnect();
      fechar(setPrevia);
    };
  }, [colunaFixa]);

  const atual = porSlug(ativo);
  const velho = anterior ? porSlug(anterior) : null;

  return (
    <div ref={indiceRef} className="indice mt-20" data-previa={(flutuante && aberta) || undefined}>
      <div>
        {ORDEM.map((tipo) => {
          const grupo = GRUPOS[tipo];
          return (
            <section key={tipo} aria-labelledby={`grupo-${tipo}`} className="mb-24 last:mb-0">
              <SectionMarker label={grupo.marcador} number={NUMERO[tipo]} />
              <h2 id={`grupo-${tipo}`} data-entra="titulo" className="max-w-2xl text-[clamp(28px,3.4vw,44px)]">
                {grupo.titulo}
              </h2>
              {grupo.texto && <p className="prose-measure mt-4 text-[17px] text-black/70">{grupo.texto}</p>}

              <ul data-entra="linha" className="regua-topo mt-10">
                {PROJETOS.filter((p) => p.tipo === tipo).map((projeto) => (
                  <li key={projeto.slug} data-entra="linha" className="regua">
                    <Link
                      href={`/portfolio/${projeto.slug}`}
                      data-slug={projeto.slug}
                      data-ativo={(visivel && ativo === projeto.slug) || undefined}
                      className="indice-item group block py-7"
                    >
                      {/* Celular: só capa com material real. A tipográfica repetia
                          o nome numa tela inteira de preto. */}
                      {!tablet && projeto.capa.tipo !== "tipografica" && (
                        <div className="mb-6 md:hidden">
                          <Capa projeto={projeto} sizes="100vw" prioridade={projeto.slug === PRIMEIRA_CAPA} />
                        </div>
                      )}
                      <span className="flex items-baseline gap-4">
                        <span aria-hidden className="indice-ponto" />
                        <span className="w-7 shrink-0 text-sm text-black/40">{projeto.num}</span>
                        <span className="min-w-0 flex-1">
                          <span data-texto className="block w-fit text-[clamp(24px,3vw,40px)] font-bold leading-[1.05] tracking-tight">
                            {projeto.nome}
                            {/* Selo (ex.: grátis) colado no nome: a prévia
                                flutuante mede este span e não cobre o selo. */}
                            {projeto.selo && (
                              <span className="ml-3 inline-block align-middle text-[11px] font-medium uppercase tracking-[0.18em]">
                                {projeto.selo.rotulo}
                              </span>
                            )}
                          </span>
                          <span data-texto className="mt-2 block w-fit text-[15px] text-black/65">
                            {projeto.chamada}
                          </span>
                        </span>
                        <span className="hidden shrink-0 text-[11px] uppercase tracking-[0.18em] text-black/55 sm:block">
                          {projeto.entrega}
                        </span>
                        <span aria-hidden className="seta shrink-0 text-lg">
                          →
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      {tablet && (
        <div ref={previaRef} aria-hidden className="indice-previa">
          <div className="previa-pilha">
            {velho && (
              <div key={`a-${velho.slug}`} className="previa-camada">
                <Capa projeto={velho} sizes="(min-width: 1024px) 300px, 36vw" transicao={false} filme={false} />
              </div>
            )}
            {/* Só a capa visível leva o nome da transição (capa → topo do case). */}
            <div
              key={`b-${atual.slug}`}
              className={`previa-camada ${velho ? "previa-entra" : ""}`}
              style={visivel ? { viewTransitionName: `capa-${atual.slug}`, viewTransitionClass: "capa" } : undefined}
            >
              {/* O filme só toca com a prévia à vista (ela fica na página, escondida). */}
              <Capa projeto={atual} sizes="(min-width: 1024px) 300px, 36vw" transicao={false} filme={visivel} />
            </div>
          </div>
          <span className="indice-ver mt-3 block text-[11px] uppercase tracking-[0.14em] text-black/60">
            Ver case →
          </span>
        </div>
      )}
    </div>
  );
}
