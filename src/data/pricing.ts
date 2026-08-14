export type Plano = {
  id: string;
  nome: string;
  promessa: string;
  setup: string;
  mensal: number;
  anual: number;
  destaque?: boolean;
  inclui: string[];
};

export const PLANOS: Plano[] = [
  {
    id: "arrumada",
    nome: "Casa Arrumada",
    promessa: "Seu negócio achável e com cara de sério.",
    setup: "a partir de R$ 900",
    mensal: 100,
    anual: 83,
    inclui: [
      "Site sob medida",
      "Aparece no Google",
      "Botão de WhatsApp",
      "Hospedagem e ajustes inclusos",
    ],
  },
  {
    id: "automatizada",
    nome: "Casa Automatizada",
    promessa: "O trabalho repetitivo sai das suas costas.",
    setup: "a partir de R$ 2.500",
    mensal: 350,
    anual: 292,
    destaque: true,
    inclui: [
      "Tudo da Casa Arrumada",
      "Atendimento respondendo sozinho",
      "Agendamento e pedido sem você no meio",
      "Suporte no WhatsApp",
    ],
  },
  {
    id: "inteligente",
    nome: "Casa Inteligente",
    promessa: "Roda sozinho e melhora todo mês.",
    setup: "a partir de R$ 5.900",
    mensal: 790,
    anual: 658,
    inclui: [
      "Tudo da Casa Automatizada",
      "Sistema sob medida pro seu processo",
      "Relatório do que economizou",
      "Ajustes contínuos junto com você",
    ],
  },
];

export const SOB_MEDIDA = {
  titulo: "Precisa de outra coisa?",
  texto: "Loja online, aplicativo próprio, vídeo e conteúdo, integração com o sistema que você já usa.",
  cta: "Pedir orçamento",
};

export const GARANTIA = "30 dias. Não gostou, devolvo o setup.";
export const NOTA_ANUAL = "12 meses pelo preço de 10";
