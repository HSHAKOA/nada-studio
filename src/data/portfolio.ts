import { buildWhatsAppLink } from "@/data/content";

export type TipoProjeto = "cliente" | "produto" | "interno";

export type Projeto = {
  id: string;
  num: string;
  nome: string;
  subtitulo: string;
  tipo: TipoProjeto;
  problema: string;
  solucao: string;
  resultado?: string;
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
    problema:
      "Paciente nova chegava por indicação e caía direto no WhatsApp, sem contexto nenhum. Ela abria a conversa sem saber quem era a pessoa nem o que a pessoa estava buscando, e gastava a primeira meia hora perguntando o básico.",
    solucao:
      "Um site que explica o trabalho dela, com um formulário curto antes da conversa. A pessoa responde no tempo dela e só segue pro WhatsApp se quiser continuar. Quando responde, a Thayana é avisada na hora e as respostas ficam guardadas.",
    resultado:
      "Ela abre a conversa já sabendo com quem está falando e o que a pessoa procura.",
    link: "https://thayanadeoliveira.com.br",
    linkLabel: "Ver o site",
  },
  {
    id: "vitrine",
    num: "02",
    nome: "VITRINE 01",
    subtitulo: "Esporte",
    tipo: "produto",
    problema:
      "Loja de artigo esportivo vende por marketplace, paga comissão em toda venda e o cliente fica sendo do marketplace.",
    solucao:
      "Loja própria, com catálogo e pedido caindo direto no WhatsApp. O cliente monta a camisa com nome e número e vê como fica antes de comprar.",
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
    problema:
      "Entrada e saída de matéria-prima anotada na mão. Papel se perdia, contagem não batia.",
    solucao:
      "Um bip registra a peça. Estoque atualizado na hora, sem ninguém digitar nada.",
    tecnica: "Feito em Python.",
  },
  {
    id: "transcricao",
    num: "04",
    nome: "Transcrição de reunião",
    subtitulo: "Ferramenta interna",
    tipo: "interno",
    problema:
      "Reunião ficava gravada em áudio e ninguém revia. A informação existia, mas achar dava mais trabalho que perguntar de novo.",
    solucao:
      "O áudio vira texto organizado, leve e buscável. Abre e acha, sem depender de arquivo pesado.",
  },
  {
    id: "noazul",
    num: "05",
    nome: "No Azul",
    subtitulo: "Controle financeiro",
    tipo: "interno",
    problema:
      "Duas horas todo sábado batendo fatura com extrato, lançando gasto na mão.",
    solucao:
      "O gasto entra sozinho. Abre e vê onde o dinheiro está, e avisa antes de estourar.",
    resultado: "8 horas por mês viraram 10 minutos.",
  },
  {
    id: "hub",
    num: "06",
    nome: "Hub NADA Studio",
    subtitulo: "Sistema interno",
    tipo: "interno",
    problema:
      "Cliente em planilha, follow-up esquecido, proposta refeita do zero toda vez.",
    solucao: "Um painel só, com o funil, os relatórios e a proposta saindo pronta.",
  },
];

export const PORTFOLIO_HEADER = {
  marcador: "Portfólio",
  num: "001",
  titulo: "O que a gente já construiu.",
  subtitulo:
    "Trabalho de cliente, produto próprio e ferramenta que a gente fez porque precisava.",
};
