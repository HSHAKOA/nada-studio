import Image from "next/image";
import { ViewTransition } from "react";
import { ROTULO_TIPO, type Projeto } from "@/data/portfolio";
import CapaCena from "./CapaCena";
import CapaVideo from "./CapaVideo";

type Props = {
  projeto: Projeto;
  // 4:5 no índice, 16:10 no topo do case: mesma composição, outra proporção.
  formato?: "indice" | "case";
  sizes: string;
  preload?: boolean;
  // Primeira capa da tela no celular: pedida cedo e com prioridade, direto no
  // <img>, sem hint de preload (que vazava pelo prefetch pra outras rotas).
  prioridade?: boolean;
  // Participa da transição índice → case (só uma capa por projeto na tela).
  transicao?: boolean;
  // Falso: fica só o pôster (capa que está na página mas escondida).
  filme?: boolean;
};

// Capa no sistema da NADA Studio: fundo preto (cliente) ou branco (nosso) e um
// tipo de composição. No filme, o projeto em movimento ocupa a capa inteira,
// sem marcador por cima (a tela do cliente já tem o cabeçalho dela). Nos
// outros tipos, o marcador fica no canto. Tudo fica dentro do miolo, que é o
// que assenta na entrada (a moldura não se mexe). Estilos em globals.css.
export default function Capa({ projeto, formato = "indice", sizes, preload, prioridade, transicao = true, filme = true }: Props) {
  const { capa } = projeto;
  // No topo do case entra a versão larga, quando existe.
  const larga = formato === "case" ? capa.larga : undefined;
  const src = larga?.imagem ?? capa.imagem;
  const proporcao = larga ? larga.proporcao : capa.proporcao;
  const video = larga ? larga.video : capa.video;

  const imagem = (classe: string) =>
    src && (
      <div className={classe} style={proporcao ? ({ "--proporcao": proporcao } as React.CSSProperties) : undefined}>
        <Image
          src={src}
          alt=""
          fill
          sizes={sizes}
          preload={preload}
          loading={prioridade ? "eager" : undefined}
          fetchPriority={prioridade ? "high" : undefined}
          className="object-cover"
          style={{ objectPosition: capa.posicao }}
        />
        {video && filme && <CapaVideo src={video} pequeno={larga?.videoPequeno} />}
      </div>
    );

  const conteudo = (
    <div
      aria-hidden
      className={`capa capa-${capa.tipo} ${projeto.tipo === "interno" ? "capa-nosso" : ""} ${
        formato === "case" ? "capa-larga aspect-[16/10]" : "aspect-[4/5]"
      }`}
    >
      <div className="capa-miolo">
        {capa.tipo !== "filme" && (
          <span className="capa-marcador">
            ( {ROTULO_TIPO[projeto.tipo]} ) {projeto.num}
          </span>
        )}
        {capa.tipo === "tipografica" && <span className="capa-nome">{projeto.nome}</span>}
        {capa.tipo === "cena" && capa.cena && <CapaCena cena={capa.cena} />}
        {capa.tipo === "numero" ? (
          // O número inteiro, centrado, com a faixa da interface real logo
          // abaixo dele (nunca atravessando os dígitos).
          <div className="capa-numero-grupo">
            <span className="capa-num">{capa.metrica}</span>
            {imagem("capa-faixa")}
          </div>
        ) : (
          // Com proporção, o recorte aparece inteiro, na forma dele.
          imagem(proporcao ? "capa-tela" : "capa-imagem")
        )}
      </div>
    </div>
  );

  return transicao ? (
    <ViewTransition name={`capa-${projeto.slug}`} share="capa">
      {conteudo}
    </ViewTransition>
  ) : (
    conteudo
  );
}
