// Gera os arquivos das peças de vídeo da página Motion (public/motion) a
// partir dos brutos, que ficam em brutos/motion/: fora de public/ (o bruto
// pode passar do teto de 25 MiB por arquivo do Cloudflare Pages) e fora do
// git (o repositório é público; o .gitignore cobre a pasta).
//
//   node scripts/motion.mjs                    todas as peças
//   node scripts/motion.mjs ferrari            só uma
//   node scripts/motion.mjs ferrari --folha 0.5 [início] [duração]
//        folha de quadros do bruto (um a cada 0,5 s), pra escolher o trecho
//
// Por peça:
//   nome-previa.mp4     trecho mudo em loop, pro cartão
//   nome-previa-p.mp4   o mesmo trecho pra tela de celular
//   nome.mp4            a peça inteira, com som: só carrega no clique
//   nome.webp           pôster = primeiro quadro da prévia (a troca não aparece)
// Depois: node scripts/imagens.mjs (larguras do pôster) e a entrada da peça em
// MOTION_TRABALHOS (src/data/content.ts). Precisa do ffmpeg (variável FFMPEG,
// se não estiver no lugar padrão).
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";

const SAIDA = "public/motion";

// previa: [início, duração] em segundos do bruto. Sem `previa`, a peça inteira.
// O primeiro quadro do trecho vira o pôster: precisa se sustentar parado.
// copiar: o bruto já está em tamanho de web (H.264, até 720 px de largura); a
// peça inteira é só remontada, sem recodificar.
const PECAS = [
  // "Mesmo que você trabalhe 16 horas por dia…" até "…decidindo por você."
  { nome: "hub-anuncio", fonte: "motion mais completo o melhor.mp4", previa: [3.9, 5.45] },
  // "Marca. Texto. Tela.": o ponto, o texto que respira e a tela.
  { nome: "tipografia", fonte: "Nada motion de fazer motion ref.mp4", previa: [8.3, 8.05] },
  // "Só faltava o carro…", a troca e a volta em torno dele.
  { nome: "ferrari", fonte: "ferrari.mp4", previa: [3.15, 6.75], copiar: true },
  { nome: "logotipo-cortes", fonte: "varios cortes video.mp4", copiar: true },
];
const BRUTOS = "brutos/motion";
for (const peca of PECAS) peca.fonte = path.join(BRUTOS, peca.fonte);

// Teto em MB (docs/NADA-SITE-ENGINEERING-BASE.md, performance budget). O CRF
// sobe até o arquivo caber.
const VERSOES = {
  previa: { sufixo: "-previa", largura: 720, teto: 1.2, crfs: [26, 28, 30, 32], som: false },
  previaP: { sufixo: "-previa-p", largura: 480, teto: 0.6, crfs: [27, 29, 31, 33], som: false },
  inteira: { sufixo: "", largura: 720, teto: 12, crfs: [25, 27, 29, 31], som: true },
};

// Mesma busca de scripts/gravar-capa.mjs.
function ffmpeg() {
  if (process.env.FFMPEG) return process.env.FFMPEG;
  if (spawnSync("ffmpeg", ["-version"]).status === 0) return "ffmpeg";
  // Instalado pelo winget e ainda fora do PATH desta sessão.
  const pacotes = path.join(process.env.LOCALAPPDATA ?? "", "Microsoft/WinGet/Packages");
  for (const pacote of fs.existsSync(pacotes) ? fs.readdirSync(pacotes) : []) {
    if (!pacote.startsWith("Gyan.FFmpeg")) continue;
    for (const versao of fs.readdirSync(path.join(pacotes, pacote))) {
      const exe = path.join(pacotes, pacote, versao, "bin/ffmpeg.exe");
      if (fs.existsSync(exe)) return exe;
    }
  }
  throw new Error("ffmpeg não encontrado. Instale (winget install Gyan.FFmpeg.Essentials) ou aponte a variável FFMPEG.");
}

function rodar(args, opcoes = {}) {
  const r = spawnSync(ffmpeg(), ["-y", "-hide_banner", "-loglevel", "error", ...args], { maxBuffer: 256 * 1024 * 1024, ...opcoes });
  if (r.status !== 0) throw new Error(`ffmpeg falhou:\n${r.stderr}`);
  return r.stdout;
}

// H.264 com a cor declarada em BT.709, como as capas: sem isso o navegador
// adivinha a matriz e a cor do filme sai diferente da do pôster. Não amplia.
function codificar(peca, { sufixo, largura, teto, crfs, som }) {
  const arquivo = path.join(SAIDA, `${peca.nome}${sufixo}.mp4`);
  const coube = (como) => {
    const mb = fs.statSync(arquivo).size / 1e6;
    if (mb <= teto) console.log(`  ${path.basename(arquivo)}  ${mb.toFixed(2)} MB (${como})`);
    return mb <= teto;
  };
  // Recodificar um arquivo já comprimido perde qualidade e ainda engorda.
  if (som && peca.copiar) {
    rodar(["-i", peca.fonte, "-c", "copy", "-movflags", "+faststart", arquivo]);
    if (coube("cópia do bruto")) return;
  }
  const trecho = !som && peca.previa ? ["-ss", String(peca.previa[0]), "-t", String(peca.previa[1])] : [];
  for (const crf of crfs) {
    rodar([
      ...trecho,
      "-i", peca.fonte,
      "-vf", `scale=w='min(${largura},iw)':h=-2:flags=lanczos,format=yuv420p`,
      "-c:v", "libx264", "-preset", "veryslow", "-crf", String(crf), "-profile:v", "high",
      "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv",
      ...(som ? ["-c:a", "aac", "-b:a", "128k", "-ac", "2"] : ["-an"]),
      "-movflags", "+faststart",
      arquivo,
    ]);
    if (coube(`crf ${crf}`)) return;
  }
  throw new Error(`${arquivo} não coube em ${teto} MB: encurte o trecho ou reveja o teto.`);
}

async function poster(peca) {
  const png = rodar([
    "-i", path.join(SAIDA, `${peca.nome}-previa.mp4`),
    "-frames:v", "1",
    "-vf", "scale=in_color_matrix=bt709:in_range=tv,format=rgb24",
    "-f", "image2pipe", "-c:v", "png", "-",
  ]);
  await sharp(png).webp({ quality: 92, smartSubsample: true }).toFile(path.join(SAIDA, `${peca.nome}.webp`));
}

// Quadro n da folha (da esquerda pra direita, de cima pra baixo, do zero) =
// início + n × passo segundos.
function folha(peca, passo = 0.5, inicio = 0, dur) {
  const total = dur ?? duracao(peca.fonte) - inicio;
  const colunas = 10;
  const linhas = Math.ceil(total / passo / colunas);
  const arquivo = path.join(os.tmpdir(), `nada-motion-${peca.nome}.jpg`);
  rodar([
    "-ss", String(inicio), "-t", String(total),
    "-i", peca.fonte,
    "-vf", `fps=${1 / passo},scale=160:-2,tile=${colunas}x${linhas}:padding=4`,
    "-frames:v", "1", "-q:v", "4",
    arquivo,
  ]);
  console.log(`${arquivo}\nquadro n = ${inicio} + n × ${passo} s (${colunas} por linha)`);
}

function duracao(fonte) {
  const { stderr } = spawnSync(ffmpeg(), ["-hide_banner", "-i", fonte], { encoding: "utf8" });
  const [, h, m, s] = /Duration: (\d+):(\d+):([\d.]+)/.exec(stderr) ?? [];
  if (!s) throw new Error(`não li a duração de ${fonte}`);
  return h * 3600 + m * 60 + Number(s);
}

const [alvo, modo, ...numeros] = process.argv.slice(2);
const pecas = PECAS.filter((p) => !alvo || p.nome === alvo);
if (pecas.length === 0) throw new Error(`peça "${alvo}" não está na tabela: ${PECAS.map((p) => p.nome).join(", ")}`);

fs.mkdirSync(SAIDA, { recursive: true });
for (const peca of pecas) {
  if (!fs.existsSync(peca.fonte)) throw new Error(`bruto não encontrado: ${peca.fonte}`);
  if (modo === "--folha") {
    folha(peca, ...numeros.map(Number));
    continue;
  }
  console.log(peca.nome);
  for (const versao of Object.values(VERSOES)) codificar(peca, versao);
  await poster(peca);
}
