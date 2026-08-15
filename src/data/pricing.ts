export type Porte = {
  id: string;
  nome: string;
  precoBase: number;
  prazo: string;
  promessa: string;
  destaque?: boolean;
  inclui: string[];
  cta: string;
  whatsappMsg: string;
};

export const PORTES: Porte[] = [
  {
    id: "pequeno",
    nome: "Pequeno",
    precoBase: 100,
    prazo: "2 a 5 dias",
    promessa: "Uma coisa só, resolvida rápido.",
    inclui: [
      "Página única",
      "Ajuste no site que você já tem",
      "Uma tarefa repetitiva saindo das suas costas",
      "Formulário ou orçamento automático",
    ],
    cta: "Quero começar por aqui",
    whatsappMsg: "Oi! Quero saber sobre um projeto pequeno.",
  },
  {
    id: "medio",
    nome: "Médio",
    precoBase: 500,
    prazo: "1 a 3 semanas",
    promessa: "Seu negócio inteiro no ar.",
    destaque: true,
    inclui: [
      "Site completo sob medida",
      "Página feita pra vender",
      "Atendimento respondendo sozinho",
      "Agenda e pedido sem você no meio",
    ],
    cta: "Quero o médio",
    whatsappMsg: "Oi! Quero saber sobre um projeto médio.",
  },
  {
    id: "grande",
    nome: "Grande",
    precoBase: 2500,
    prazo: "prazo a combinar",
    promessa: "Sistema feito pro seu processo.",
    inclui: [
      "Ferramenta sob medida",
      "Loja online",
      "Tudo que você usa conversando entre si",
      "Acompanhamento e ajuste contínuo",
    ],
    cta: "Quero conversar sobre isso",
    whatsappMsg: "Oi! Quero saber sobre um projeto grande.",
  },
];

export const SOB_MEDIDA = {
  titulo: "Não achou o seu?",
  texto:
    "Conta o que você precisa. Se der pra fazer, a gente faz. Orçamento em 1 minuto.",
  cta: "Pedir orçamento",
  whatsappMsg: "Oi! Preciso de algo diferente, posso explicar?",
};

export const MANUTENCAO =
  "Depois de pronto, mantemos tudo rodando por R$ 100/mês: hospedagem, ajustes e suporte no WhatsApp. Opcional, sem fidelidade.";

export const SELO_DESTAQUE = "mais pedido";
