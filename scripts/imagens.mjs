// Gera os recortes das capas e as larguras que o loader de imagem serve
// (src/lib/imageLoader.ts). Rodar depois de trocar ou incluir imagem em
// public/portfolio, public/equipe ou public/motion:  node scripts/imagens.mjs
// O sharp vem junto com o Next; não é dependência direta do projeto.
import sharp from "sharp";
import { existsSync, readdirSync } from "node:fs";

const DIR = "public/portfolio";
const PASTAS = [DIR, "public/equipe", "public/motion"];
const LARGURAS = [480, 960, 1600]; // iguais a images.deviceSizes do next.config.ts
const E_VARIACAO = /-\d+\.webp$/;
// Portfólio é quase tudo print de tela, com texto miúdo: qualidade mais alta
// e croma sem borrar a letra. Equipe é foto: o padrão basta. Motion é pôster
// de vídeo, quase sempre com letra: igual ao portfólio.
const TELA = { quality: 86, smartSubsample: true };
const WEBP = { [DIR]: TELA, "public/equipe": { quality: 80 }, "public/motion": TELA };

// Recorte de capa (tipos `recorte` e `numero`) = pedaço da interface real, em
// px do arquivo de origem. Formato de cada entrada:
//   "capa-nome": ["origem.webp", { left: 0, top: 0, width: 1200, height: 1500 }],
// A proporção de cada recorte vai em data/portfolio.ts.
// As capas em filme (capa-ana, capa-hub...) não passam por aqui: o filme e o
// pôster saem de scripts/gravar-capa.mjs. Pra elas, este script só gera as
// larguras. Hoje todas as capas com imagem são filme.
const RECORTES = {};

for (const [nome, [origem, area]] of Object.entries(RECORTES)) {
  await sharp(`${DIR}/${origem}`).extract(area).webp({ quality: 92, smartSubsample: true }).toFile(`${DIR}/${nome}.webp`);
}

for (const pasta of PASTAS.filter((p) => existsSync(p))) {
  for (const arquivo of readdirSync(pasta)) {
    if (E_VARIACAO.test(arquivo) || !/\.(webp|jpe?g|png)$/.test(arquivo)) continue;
    const base = arquivo.replace(/\.\w+$/, "");
    for (const largura of LARGURAS) {
      await sharp(`${pasta}/${arquivo}`)
        .resize({ width: largura, withoutEnlargement: true })
        .webp(WEBP[pasta])
        .toFile(`${pasta}/${base}-${largura}.webp`);
    }
  }
}

console.log("imagens geradas em", PASTAS.join(", "));
