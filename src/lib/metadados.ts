import type { Metadata } from "next";

// Imagem de compartilhamento padrão (app/opengraph-image.png).
export const IMAGEM_SOCIAL = {
  url: "/opengraph-image.png",
  width: 1200,
  height: 630,
  alt: "NADA Studio · Do nada nasce tudo",
};

// Metadados de página interna, com Open Graph e Twitter da própria página. O
// metadata do Next é mesclado raso: sem openGraph aqui, a página herdava o
// og:url, o título e a descrição da home; com ele, o da raiz sai inteiro, e a
// imagem padrão volta explícita (como nos cases).
export function metadadosDePagina({
  titulo,
  descricao,
  caminho,
}: {
  titulo: string;
  descricao: string;
  caminho: string;
}): Metadata {
  const tituloSocial = `${titulo} · NADA Studio`;
  return {
    title: titulo,
    description: descricao,
    alternates: { canonical: caminho },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      siteName: "NADA Studio",
      url: caminho,
      title: tituloSocial,
      description: descricao,
      images: [IMAGEM_SOCIAL],
    },
    twitter: {
      card: "summary_large_image",
      title: tituloSocial,
      description: descricao,
      images: [IMAGEM_SOCIAL],
    },
  };
}
