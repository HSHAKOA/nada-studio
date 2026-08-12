const WHATSAPP_NUMBER = "5511932159328";
const WHATSAPP_DEFAULT_MESSAGE = "Oi! Quero saber mais sobre a NADA.";

export function waLink(mensagem: string = WHATSAPP_DEFAULT_MESSAGE) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;
}

export const WHATSAPP_LINK = waLink();
export const INSTAGRAM_LINK = "https://www.instagram.com/nada.studio.br/";

export const navLinks = [
  { label: "Serviços", href: "#o-que-fazemos" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Portfólio", href: "#portfolio" },
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
    body: "Aquela tarefa repetitiva que come seu dia? A gente automatiza. Mensagem, planilha, agendamento, cobrança. Tudo no piloto automático. Você ganha o tempo de volta.",
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
    body: "Você conta o que trava seu dia. A gente entende seu negócio.",
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
  "Suporte direto no WhatsApp, com quem construiu",
];

export const forYouPro = {
  title: "Profissionais",
  body: "Professor, nutricionista, personal, médico. Automatize a papelada da rotina e use IA a seu favor no atendimento, no conteúdo e na organização.",
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
  sub: "A gente liga as ferramentas que você já usa (WhatsApp, Google, e-mail, automação) pra tudo funcionar junto, sozinho.",
};

export const ecosystemNodes = [
  { id: "whatsapp", label: "WhatsApp", short: "Atendimento", ring: 0, icon: "whatsapp" },
  { id: "gmail", label: "Gmail", short: "E-mail", ring: 0, icon: "mail" },
  { id: "agenda", label: "Google Agenda", short: "Agendamento", ring: 0, icon: "calendar" },
  { id: "instagram", label: "Instagram", short: "Presença", ring: 1, icon: "instagram" },
  { id: "n8n", label: "n8n", short: "Automação", ring: 1, icon: "n8n" },
  { id: "ia", label: "IA", short: "Inteligência", ring: 2, icon: "spark" },
  { id: "pix", label: "Pix", short: "Cobrança", ring: 2, icon: "pix" },
] as const;

export const costOfNotDoing = {
  header: "“É caro?” O caro é continuar perdendo tempo.",
  text: "Faz a conta. Quantas horas por semana você (ou sua equipe) gasta no repetitivo? Multiplica por um mês. Por um ano. Esse tempo já tem um custo. Só que ele é invisível, sai fatiado, todo dia. A gente transforma esse custo escondido numa solução que se paga em tempo livre e cliente bem atendido.",
  destaque: "Não fazer nada também custa. Só que você paga em hora perdida.",
  microCta: "Descobrir quanto você perde →",
};

export const portfolioIntro = {
  header: "A gente começou construindo pra nós mesmos.",
  sub: "Antes de vender, a gente fez. Cada projeto abaixo nasceu de um problema real que a gente resolveu com código, automação e IA. É a nossa prova de que funciona.",
  fecho: "O próximo caso de sucesso pode ser o seu.",
};

export const portfolioProjects = [
  {
    title: "NADA Studio",
    tag: "Next.js + Three.js",
    body: "O site que você tá vendo agora. Feito do zero, com objeto 3D e scroll cinematográfico.",
  },
  {
    title: "Hub interno",
    tag: "Netlify + Supabase",
    body: "Ferramenta de gestão que a gente usa todo dia pra rodar a operação. Construída sob medida, do jeito que o nosso processo pede.",
  },
  {
    title: "No Azul",
    tag: "Cakto + Supabase",
    body: "App de controle financeiro pessoal. Ajuda a saber pra onde o dinheiro vai, sem precisar de planilha.",
  },
];

export const foundersIntro = {
  header: "Tem gente por trás do código.",
  text: "A NADA é tocada por dois sócios de Jundiaí que gostam de resolver problema de gente. O atendimento é presencial na região e remoto pro Brasil inteiro. A gente atende de perto, fala a sua língua e não some depois de entregar. Aqui você fala direto com quem constrói.",
  fecho: "Quando você contrata a NADA, você sabe com quem tá falando.",
};

export const founders: { name: string; role: string; photo?: string }[] = [
  { name: "João Passos", role: "Fundador", photo: "/Joao_IMG.jpeg" },
  { name: "Eric Crispim", role: "Fundador", photo: "/Eric_IMG.jpeg" },
];

export const trustBadges = [
  "Preço fechado antes de começar",
  "100% sob medida",
  "Suporte de gente de verdade",
];

export const faqItems = [
  {
    q: "Preciso entender de tecnologia?",
    a: "Não. Esse é o nosso trabalho. Você conta o problema, a gente resolve e te ensina o simples.",
  },
  {
    q: "Quanto custa?",
    a: "Cada projeto é sob medida, então o valor sai depois que a gente entende o que você precisa. A estrutura é sempre a mesma: um valor pra montar e uma mensalidade pra cuidar. O que muda o preço é o tamanho: quantas páginas, quantas automações, quantas ferramentas conectar. Na primeira conversa você já sai com o número na mão. Ela é de graça e sem compromisso.",
  },
  {
    q: "Tem fidelidade?",
    a: "Sem contrato de 12 meses. Você avisa com 30 dias e leva tudo que é seu: site, domínio e automações.",
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
    q: "Quanto tempo demora?",
    a: "Site fica pronto em 2 a 3 semanas. Automação depende do tamanho e a gente fala o prazo já na primeira conversa.",
  },
];

export const sectionMarkers = {
  problem: "001",
  ecosystem: "002",
  whatWeDo: "003",
  howItWorks: "004",
  membership: "005",
  costOfNotDoing: "006",
  portfolio: "007",
  forYou: "008",
  founders: "009",
  whyNada: "010",
  trust: "011",
  faq: "012",
  cta: "013",
};
