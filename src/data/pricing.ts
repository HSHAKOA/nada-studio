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

export const PACOTES: Pacote[] = [
  {
    id: "landing-page",
    nome: "Landing Page",
    prazo: "3 a 7 dias úteis",
    promessa: "Página única pensada para converter visitantes em clientes pagantes.",
    inclui: [
      "Design sob medida e ultra-rápido no celular",
      "Otimizada para tráfego pago e alta conversão",
      "Botão de WhatsApp e formulário com aviso instantâneo",
      "Configuração de domínio, SSL e tags de rastreamento",
    ],
    cta: "Pedir proposta de Landing Page",
    whatsappMsg: "Oi! Quero uma proposta para criação de Landing Page.",
  },
  {
    id: "site-completo",
    nome: "Site & Automação",
    prazo: "2 a 3 semanas",
    promessa: "Seu negócio estruturado na internet com atendimento no automático.",
    destaque: true,
    inclui: [
      "Site multipáginas sob medida (Next.js)",
      "Atendimento automático e triagem de leads no WhatsApp",
      "Agendamento sincronizado com Google Agenda",
      "SEO técnico completo para aparecer nas buscas do Google",
    ],
    cta: "Pedir proposta para Site Completo",
    whatsappMsg: "Oi! Quero uma proposta para Site Institucional com Automação.",
  },
  {
    id: "sistema-sob-medida",
    nome: "Sistema Sob Medida",
    prazo: "Escopo sob medida",
    promessa: "Aplicação web ou ferramenta feita exatamente para o seu fluxo operacional.",
    inclui: [
      "Aplicação web ou painel de gestão exclusivo",
      "Fluxos inteligentes com IA (OpenAI), n8n e integrações",
      "Banco de dados seguro e autenticação de usuários",
      "Acompanhamento e suporte técnico contínuo",
    ],
    cta: "Conversar sobre Sistema",
    whatsappMsg: "Oi! Quero entender sobre o desenvolvimento de um Sistema sob medida.",
  },
];

export const SOB_MEDIDA = {
  titulo: "Precisa de uma automação pontual ou projeto misto?",
  texto:
    "Conta pra gente qual tarefa repetitiva está travando seu dia a dia. Analisamos sua rotina e desenhamos a solução ideal sem enrolação.",
  cta: "Pedir diagnóstico gratuito",
  whatsappMsg: "Oi! Preciso de uma solução personalizada, posso explicar minha rotina?",
};

export const MANUTENCAO =
  "Depois de pronto, cuidamos de tudo: hospedagem de alta performance, certificado SSL, ajustes contínuos e suporte direto no WhatsApp. Opcional e sem contrato de fidelidade.";

export const SELO_DESTAQUE = "mais pedido";
