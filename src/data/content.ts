export const WHATSAPP_LINK = "SEU_LINK_WHATSAPP";
export const INSTAGRAM_LINK = "PLACEHOLDER";

export const navLinks = [
  { label: "Serviços", href: "#o-que-fazemos" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Pra você", href: "#pra-voce" },
  { label: "Contato", href: "#comecar" },
];

export const services = [
  {
    number: "01",
    title: "Sites",
    headline: "Site que trabalha por você",
    body: "Bonito, rápido e feito pra virar visitante em cliente. Aparece no Google, funciona no celular e representa seu negócio do jeito certo.",
  },
  {
    number: "02",
    title: "Automação",
    headline: "Chega de fazer na mão",
    body: "Aquela tarefa repetitiva que come seu dia? A gente automatiza. Mensagem, planilha, agendamento, cobrança — no piloto automático. Você ganha o tempo de volta.",
  },
  {
    number: "03",
    title: "Aplicações sob medida",
    headline: "Ferramenta com a sua cara",
    body: "Uma solução pequena e simples, feita pro seu problema específico. Um sistema de pedido, um controle, um cálculo. Nada de mais, nada de menos.",
  },
];

export const steps = [
  {
    number: "01",
    title: "A gente conversa.",
    body: "Você conta o que trava seu dia. A gente entende seu negócio de verdade.",
  },
  {
    number: "02",
    title: "A gente constrói.",
    body: "Criamos tudo do zero, sob medida. Você acompanha e aprova. Sem surpresa.",
  },
  {
    number: "03",
    title: "A gente entrega.",
    body: "Colocamos no ar, funcionando. Te ensinamos a usar. Simples.",
  },
  {
    number: "04",
    title: "A gente cuida.",
    body: "Fica tudo sob nossa mão pra sempre funcionar. Você não mexe em nada.",
  },
];

export const membershipItems = [
  "Site no ar, rápido e sempre atualizado",
  "Ajustes e melhorias sempre que precisar",
  "Automações rodando sem parar, 24h",
  "Suporte direto no WhatsApp — fala com gente, não com robô",
];

export const forYouPro = {
  title: "Profissionais",
  body: "Professor, nutricionista, personal, médico — automatize a papelada da rotina e use IA a seu favor no atendimento, no conteúdo e na organização.",
};

export const forYouPersonal = {
  title: "Pessoa comum",
  intro:
    "Não precisa ser da área de tecnologia. A gente resolve o que trava o seu dia:",
  items: [
    "Controle pessoal e de rotina",
    "Controle financeiro",
    "Automação de e-mail e mensagens",
  ],
};

export const ecosystemIntro = {
  header: "Tudo que seu negócio usa. Conectado num lugar só.",
  sub: "A gente liga as ferramentas que você já usa — WhatsApp, Google, e-mail, automação — pra tudo funcionar junto, sozinho.",
};

export const ecosystemNodes = [
  { id: "whatsapp", label: "WhatsApp", short: "Atendimento", ring: 0, icon: "whatsapp" },
  { id: "gmail", label: "Gmail", short: "E-mail automático", ring: 0, icon: "mail" },
  { id: "agenda", label: "Google Agenda", short: "Agendamento", ring: 0, icon: "calendar" },
  { id: "n8n", label: "n8n", short: "Automação", ring: 1, icon: "workflow" },
  { id: "instagram", label: "Instagram", short: "Presença", ring: 1, icon: "camera" },
  { id: "ia", label: "IA", short: "Inteligência", ring: 1, icon: "spark" },
  { id: "sheets", label: "Google Planilhas", short: "Dados", ring: 2, icon: "table" },
  { id: "site", label: "Site", short: "Presença digital", ring: 2, icon: "globe" },
] as const;

export const trustBadges = [
  "Sem mensalidade escondida",
  "100% sob medida",
  "Suporte de gente de verdade",
  "Sem fidelidade forçada",
];

export const faqItems = [
  {
    q: "Preciso entender de tecnologia?",
    a: "Não. Esse é o nosso trabalho. Você conta o problema, a gente resolve e te ensina o simples.",
  },
  {
    q: "Quanto custa?",
    a: "Depende do que você precisa. Tem um valor pra montar e uma mensalidade pra cuidar. A primeira conversa é de graça e sem compromisso.",
  },
  {
    q: "E se eu já tenho site?",
    a: "A gente melhora, automatiza ou refaz. Você escolhe.",
  },
  {
    q: "Vocês atendem meu tipo de negócio?",
    a: "Comércio local, profissionais e pessoas comuns. Se tem tarefa repetitiva, tem solução.",
  },
  {
    q: "Tem fidelidade?",
    a: "Não. Você fica porque funciona, não porque é obrigado.",
  },
];

export const sectionMarkers = {
  problem: "001",
  whatWeDo: "002",
  ecosystem: "003",
  howItWorks: "004",
  membership: "005",
  forYou: "006",
  whyNada: "007",
  trust: "008",
  faq: "009",
  cta: "010",
};
