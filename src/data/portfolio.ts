import { buildWhatsAppLink } from "@/data/content";

export type TipoProjeto = "cliente" | "produto" | "interno";

// Cada projeto é contado em quatro blocos: antes, problema, depois, resultado.
// Cena concreta em cada um, nunca resumo abstrato.
export type Projeto = {
  id: string;
  num: string;
  nome: string;
  subtitulo: string;
  tipo: TipoProjeto;
  antes: string;
  problema: string;
  depois: string;
  resultado: string;
  tecnica?: string;
  link?: string;
  linkLabel?: string;
  image?: string; // reservado, vazio por enquanto
};

export const SELO_TIPO: Record<TipoProjeto, string> = {
  cliente: "CLIENTE",
  produto: "PRODUTO",
  interno: "INTERNO",
};

export const PROJETOS: Projeto[] = [
  {
    id: "thayana",
    num: "01",
    nome: "Thayana de Oliveira",
    subtitulo: "Psicóloga",
    tipo: "cliente",
    antes:
      "Paciente nova chegava por indicação e caía direto no WhatsApp, sem ela saber nada sobre a pessoa.",
    problema:
      "Gastava a primeira meia hora perguntando o básico no WhatsApp.",
    depois:
      "O próprio site colhe a informação antes da conversa: um formulário curto, respondido no tempo da pessoa, e o WhatsApp só depois. Quando alguém responde, a Thayana é avisada na hora e as respostas ficam guardadas.",
    resultado:
      "Ela abre o WhatsApp já sabendo com quem fala e o que a pessoa procura.",
    link: "https://thayanadeoliveira.com.br",
    linkLabel: "Ver o site",
  },
  {
    id: "vitrine",
    num: "02",
    nome: "VITRINE 01",
    subtitulo: "Esporte",
    tipo: "produto",
    antes: "Loja de artigo esportivo vendendo por marketplace.",
    problema:
      "Comissão em toda venda, e o cliente ficava sendo do marketplace, não da loja.",
    depois:
      "Loja própria, com catálogo e pedido caindo direto no WhatsApp. O cliente monta a camisa com nome e número e vê como fica antes de comprar.",
    resultado:
      "A venda acontece no canal da loja, e o contato do cliente fica com ela.",
    // TODO: confirmar se existe demo hospedada. Enquanto não existe, o botão cai
    // no WhatsApp em vez de apontar pra um link quebrado.
    link: buildWhatsAppLink("Oi! Quero ver a VITRINE 01."),
    linkLabel: "Saiba mais pra ter acesso",
  },
  {
    id: "barcode",
    num: "03",
    nome: "Leitor de código de barras",
    subtitulo: "Controle de estoque",
    tipo: "interno",
    antes: "Entrada e saída de matéria-prima anotada na mão.",
    problema: "Papel se perdia, contagem não batia.",
    depois: "Um bip registra a peça.",
    resultado: "Estoque atualizado na hora, sem ninguém digitar nada.",
    tecnica: "Feito em Python.",
  },
  {
    id: "transcricao",
    num: "04",
    nome: "Transcrição de reunião",
    subtitulo: "Ferramenta interna",
    tipo: "interno",
    antes: "Reunião ficava gravada em áudio e ninguém revia.",
    problema:
      "A informação existia, mas achar dava mais trabalho que perguntar de novo.",
    depois: "O áudio vira texto organizado, leve e buscável.",
    resultado: "Abre e acha, sem depender de arquivo pesado.",
  },
  {
    id: "noazul",
    num: "05",
    nome: "No Azul",
    subtitulo: "Controle financeiro",
    tipo: "interno",
    antes:
      "Duas horas todo sábado batendo fatura com extrato, lançando gasto na mão.",
    problema:
      "Descobria que tinha estourado o mês quando já era tarde.",
    depois:
      "O gasto entra sozinho. Abre e vê onde o dinheiro está, e avisa antes de estourar.",
    resultado: "8 horas por mês viraram 10 minutos.",
  },
  {
    id: "hub",
    num: "06",
    nome: "Hub NADA Studio",
    subtitulo: "Sistema interno",
    tipo: "interno",
    antes: "Cliente em planilha, follow-up esquecido.",
    problema: "Proposta refeita do zero toda vez.",
    depois:
      "Um painel só, com o funil, os relatórios e a proposta saindo pronta.",
    resultado:
      "A operação inteira num lugar só, e nada mais depende de alguém lembrar.",
  },
];

export const PORTFOLIO_HEADER = {
  marcador: "Portfólio",
  num: "001",
  titulo: "O que a gente já construiu.",
  subtitulo:
    "Trabalho de cliente, produto próprio e ferramenta que a gente fez porque precisava.",
};
