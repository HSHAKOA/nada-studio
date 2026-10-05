export type Pacote = {
  id: string;
  nome: string;
  prazo: string;
  promessa: string;
  destaque?: boolean;
  inclui: string[];
  cta: string;
  whatsappMsg: string;
};

// Cada item fala do que muda pro cliente, nunca da tecnologia por trás.
// Sem valor público aprovado: os formatos não mostram preço.
export const PACOTES: Pacote[] = [
  {
    id: "landing-page",
    nome: "Página de venda",
    prazo: "3 a 7 dias úteis",
    promessa: "Uma página só, feita pra transformar quem chega em conversa no WhatsApp.",
    inclui: [
      "Desenho sob medida, rápido no celular",
      "Pronta pra receber anúncio do Google e do Instagram",
      "Botão de WhatsApp e formulário que te avisam na hora",
      "No seu endereço, segura e medindo de onde vem cada contato",
    ],
    cta: "Pedir proposta de página",
    whatsappMsg: "Oi! Quero uma proposta de página de venda.",
  },
  {
    id: "site-completo",
    nome: "Site & Automação",
    prazo: "2 a 3 semanas",
    promessa: "Seu negócio inteiro na internet, com o atendimento andando sozinho.",
    destaque: true,
    inclui: [
      "Site com várias páginas, do jeito do seu negócio",
      "WhatsApp que responde e já separa quem quer contratar",
      "Horário marcado caindo direto na sua agenda",
      "Preparado pra ser encontrado no Google",
    ],
    cta: "Pedir proposta de site",
    whatsappMsg: "Oi! Quero uma proposta de site com automação.",
  },
  {
    id: "sistema-sob-medida",
    nome: "Sistema sob medida",
    prazo: "Escopo sob medida",
    promessa: "Uma ferramenta feita pro jeito que a sua operação já funciona.",
    inclui: [
      "Painel próprio pra controlar o que hoje está em planilha",
      "Tarefa repetitiva rodando sozinha, ligada ao que você já usa",
      "Dados guardados com segurança, com acesso só de quem você autorizar",
      "Suporte direto com quem construiu",
    ],
    cta: "Conversar sobre sistema",
    whatsappMsg: "Oi! Quero entender como seria um sistema sob medida pro meu negócio.",
  },
];

export const DIAGNOSTICO = {
  titulo: "Não sabe qual é o seu? Começa pelo diagnóstico gratuito.",
  texto:
    "Você conta a rotina e o que está travando. A gente olha o seu caso e diz o que resolver primeiro, sem compromisso.",
  whatsappMsg: "Oi! Quero o diagnóstico gratuito. Posso explicar minha rotina?",
};

export const MANUTENCAO =
  "Depois de pronto, a gente cuida: site no ar e rápido, ajustes quando precisar e suporte direto no WhatsApp. Opcional e sem fidelidade.";

export const SELO_DESTAQUE = "mais pedido";
