import type { IconeServico } from "@/components/icons/ServiceIcons";

export const HERO_HEADLINE_FIXA = "Menos tarefa manual.";

export type HeroVariacao = { antes: string; metal: string; depois: string };

export const HERO_VARIACOES: HeroVariacao[] = [
  { antes: "Mais tempo pro seu ", metal: "negócio", depois: "." },
  { antes: "Mais tempo pra ", metal: "vender", depois: "." },
  { antes: "Mais tempo pro que ", metal: "importa", depois: "." },
  { antes: "Menos ", metal: "caderno", depois: ". Menos planilha." },
  { antes: "O sistema trabalha ", metal: "sozinho", depois: "." },
  { antes: "Você só ", metal: "usa", depois: "." },
  { antes: "Mais tempo pra ", metal: "crescer", depois: "." },
];

const WHATSAPP_NUMBER = "5511932159328";
const WHATSAPP_DEFAULT_MESSAGE = "Oi! Quero saber mais sobre a NADA Studio.";

export function buildWhatsAppLink(mensagem: string = WHATSAPP_DEFAULT_MESSAGE) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;
}

export const WHATSAPP_LINK = buildWhatsAppLink();
export const INSTAGRAM_LINK = "https://www.instagram.com/nada.studio.br/";

export const navLinks = [
  { label: "Sobre", href: "/sobre" },
  { label: "Portfólio", href: "/portfolio" },
  { label: "Equipe", href: "/equipe" },
  { label: "Como funciona", href: "/como-funciona" },
  { label: "FAQ", href: "/faq" },
];

export const ANTES_DEPOIS = {
  marcador: "Antes / depois",
  num: "002",
  titulo: "O primeiro problema que a gente resolveu foi o nosso.",

  antes: {
    label: "Antes",
    manchete: "Planilha aberta todo fim de semana.",
    linhas: [
      "Duas horas todo sábado lançando gasto na mão, um por um.",
      "Fatura de um lado, extrato do outro, tentando bater o que sobrou.",
      "Descobria que tinha estourado o mês quando já era tarde.",
    ],
    metrica: "8 horas",
    metricaUnidade: "por mês",
    metricaLegenda: "só pra saber onde o dinheiro tinha ido",
  },

  depois: {
    label: "Depois",
    manchete: "O gasto entra sozinho.",
    linhas: [
      "Abre o app e vê onde está o dinheiro, sem precisar montar nada.",
      "Estourou o limite de uma categoria, avisa antes, não depois.",
    ],
    metrica: "10 minutos",
    metricaUnidade: "por mês",
    metricaLegenda: "o resto do tempo voltou pra vida",
  },

  fecho: "De 8 horas para 10 minutos por mês.",
  credito: "Projeto interno da NADA Studio · No Azul",
};

export const services = [
  {
    number: "01",
    title: "Sites",
    headline: "Site que trabalha por você",
    body: "Bonito, rápido e feito pra virar visitante em cliente. Aparece no Google, funciona no celular e representa seu negócio do jeito certo.",
  },
  {
    number: "02",
    title: "Tarefa repetitiva",
    headline: "Chega de fazer na mão",
    body: "Aquela tarefa que come seu dia sai das suas costas. Mensagem, planilha, agendamento, cobrança: passa a acontecer sem você no meio. Você ganha o tempo de volta.",
  },
  {
    number: "03",
    title: "Ferramenta sob medida",
    headline: "Ferramenta com a sua cara",
    body: "Uma coisa pequena e simples, feita pro seu problema específico. Um sistema de pedido, um controle, um cálculo. Nada de mais, nada de menos.",
  },
];

export type ServicoPainel = {
  id: string;
  num: string;
  titulo: string;
  descricao: string;
  icone: IconeServico;
  image?: string;
  alt?: string;
};

export const SERVICOS: ServicoPainel[] = [
  {
    id: "site",
    num: "01",
    titulo: "Site que trabalha por você",
    descricao:
      "Seu negócio achável, com cara de sério, e o cliente chegando sem você correr atrás.",
    icone: "site",
    image: "/servicos/01-site.webp",
    alt: "Objeto tridimensional brilhante em preto e branco representando um site",
  },
  {
    id: "manual",
    num: "02",
    titulo: "Chega de fazer na mão",
    descricao:
      "O que você repete toda semana passa a acontecer sozinho, sem você no meio.",
    icone: "manual",
    image: "/servicos/02-manual.webp",
    alt: "Objeto tridimensional brilhante em preto e branco representando uma tarefa manual que saiu das costas do dono",
  },
  {
    id: "pagina",
    num: "03",
    titulo: "Página feita pra vender",
    descricao:
      "Uma página só, com um objetivo só: transformar quem clicou em quem comprou.",
    icone: "pagina",
    image: "/servicos/03-pagina.webp",
    alt: "Objeto tridimensional brilhante em preto e branco representando uma página de vendas",
  },
  {
    id: "anuncio",
    num: "04",
    titulo: "Anúncio que traz cliente",
    descricao:
      "Seu dinheiro aparecendo pra quem já está procurando o que você vende. Sem torrar verba.",
    icone: "anuncio",
    image: "/servicos/04-anuncio.webp",
    alt: "Objeto tridimensional brilhante em preto e branco representando um anúncio",
  },
  {
    id: "integracao",
    num: "05",
    titulo: "Tudo conversando entre si",
    descricao:
      "WhatsApp, agenda, pedido e planilha parando de ser ilhas separadas.",
    icone: "integracao",
    image: "/servicos/05-integracao.webp",
    alt: "Objeto tridimensional brilhante em preto e branco representando integração entre sistemas",
  },
  {
    id: "sobMedida",
    num: "06",
    titulo: "Ferramenta com a sua cara",
    descricao:
      "Quando nada pronto serve, a gente constrói do jeito que o seu processo pede.",
    icone: "sobMedida",
    image: "/servicos/06-sob-medida.webp",
    alt: "Objeto tridimensional brilhante em preto e branco representando uma ferramenta sob medida",
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
  "O repetitivo rodando sem parar, 24h",
  "Suporte direto no WhatsApp, com quem construiu",
];

export const forYouPro = {
  title: "Profissionais",
  body: "Professor, nutricionista, personal, médico. A papelada da rotina sai das suas costas: confirmar consulta, cobrar, lembrar quem faltou. Você fica com o atendimento.",
};

export const forYouPersonal = {
  title: "Pessoa comum",
  intro:
    "Não precisa ser da área de tecnologia. A gente resolve o que trava o seu dia:",
  items: [
    "Controle pessoal e de rotina",
    "Controle financeiro",
    "E-mail e mensagem que se respondem sozinhos",
  ],
};

export const ecosystemIntro = {
  header: "Tudo que seu negócio usa. Conectado num lugar só.",
  sub: "A gente liga as ferramentas que você já usa (WhatsApp, Gmail, Google Agenda, Pix) pra tudo funcionar junto, sozinho.",
};

export const ecosystemNodes = [
  { id: "whatsapp", label: "WhatsApp", short: "Atendimento", ring: 0, icon: "whatsapp" },
  { id: "gmail", label: "Gmail", short: "E-mail", ring: 0, icon: "mail" },
  { id: "agenda", label: "Google Agenda", short: "Agendamento", ring: 0, icon: "calendar" },
  { id: "instagram", label: "Instagram", short: "Seu perfil", ring: 1, icon: "instagram" },
  { id: "n8n", label: "n8n", short: "Sem você no meio", ring: 1, icon: "n8n" },
  { id: "openai", label: "OpenAI", short: "Resposta pronta", ring: 2, icon: "openai" },
  { id: "pix", label: "Pix", short: "Cobrança", ring: 2, icon: "pix" },
] as const;

export const costOfNotDoing = {
  header: "“É caro?” O caro é continuar perdendo tempo.",
  text: "Faz a conta. Quantas horas por semana você (ou sua equipe) gasta no repetitivo? Multiplica por um mês. Por um ano. Esse tempo já tem um custo. Só que ele é invisível, sai fatiado, todo dia. A gente devolve esse tempo em forma de sábado livre e cliente bem atendido.",
  destaque: "Não fazer nada também custa. Só que você paga em hora perdida.",
  microCta: "Descobrir quanto você perde →",
};

export const portfolioIntro = {
  header: "A gente começou construindo pra nós mesmos.",
  sub: "Antes de vender, a gente fez. Cada projeto abaixo nasceu de um problema que era nosso. É a nossa prova de que funciona.",
  fecho: "Os três a gente usa todo dia.",
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
  text: "A NADA Studio é tocada por dois sócios de Jundiaí que gostam de resolver problema de gente. O atendimento é presencial na região e remoto pro Brasil inteiro. A gente atende de perto e não some depois de entregar. Aqui você fala direto com quem constrói.",
  fecho: "Quando você contrata a NADA Studio, você sabe com quem tá falando.",
};

export const founders: { name: string; role: string; photo?: string }[] = [
  { name: "João Passos", role: "Fundador", photo: "/Joao_IMG.jpeg" },
  { name: "Eric Crispim", role: "Fundador", photo: "/Eric_IMG.jpeg" },
];

export const trustBadges = [
  "Preço fechado antes de começar",
  "100% sob medida",
  "Fala direto com o sócio",
];

export const faqItems = [
  {
    q: "Preciso entender de tecnologia para contratar?",
    a: "Não. Esse é exatamente o nosso trabalho. Você conta a sua rotina e o que consome seu tempo, a gente desenha, programa e entrega tudo pronto funcionando na prática.",
  },
  {
    q: "Quanto custa criar um site ou automação?",
    a: "Cada projeto é planejado sob medida para a realidade e as necessidades do seu negócio. Definimos o escopo e o valor fechado antes de começar, sem surpresas nem cobranças ocultas.",
  },
  {
    q: "Qual é o prazo de entrega do projeto?",
    a: "Landing pages e automações pontuais são entregues em 3 a 7 dias úteis. Sites completos e ecossistemas sob medida levam entre 2 e 3 semanas. Você acompanha cada etapa da construção.",
  },
  {
    q: "O site já vem otimizado para aparecer no Google (SEO)?",
    a: "Sim. Todos os nossos sites são desenvolvidos em Next.js com arquitetura de alta performance, meta tags estruturadas, OpenGraph, sitemap.xml, robots.txt e dados estruturados Schema.org para indexação rápida no Google.",
  },
  {
    q: "Como funciona a automação de WhatsApp e atendimento?",
    a: "A automação funciona através de mensagens disparadas pelo nosso próprio número e servidor. Nós não instalamos bot no seu número pessoal de WhatsApp. O sistema qualifica clientes, envia lembretes, responde dúvidas frequentes, agenda horários na sua Google Agenda e gera links de cobrança Pix automaticamente, deixando o seu número livre e sem risco.",
  },
  {
    q: "Quais ferramentas vocês conseguem integrar?",
    a: "Integramos qualquer ferramenta que possua API aberta: WhatsApp, n8n, OpenAI (ChatGPT), Google Agenda, Gmail, Supabase, gateways de pagamento (Pix, Stripe, Mercado Pago), CRMs, planilhas e sistemas de gestão. Não temos limitações técnicas de integração.",
  },
  {
    q: "E se eu já tiver um site ou domínio registrado?",
    a: "Nós aproveitamos seu domínio existente, modernizamos o design, otimizamos a velocidade e plugamos as automações necessárias sem tirar seu negócio do ar.",
  },
  {
    q: "Como funciona o suporte e manutenção depois de pronto?",
    a: "Oferecemos planos de suporte contínuo para manter seu site e suas automações sempre seguros, atualizados, com hospedagem de alta velocidade e suporte direto no WhatsApp com quem construiu o projeto.",
  },
  {
    q: "Tem contrato de fidelidade ou multa de cancelamento?",
    a: "Não temos contratos de fidelidade de 12 meses. O cliente fica porque o serviço funciona. Você tem total liberdade e o código/domínio é 100% seu.",
  },
  {
    q: "Vocês atendem presencialmente ou apenas online?",
    a: "Temos base em Jundiaí e região para atendimento presencial e atendemos clientes remotamente em todo o Brasil.",
  },
];

// Numeração por página (cada rota reinicia em 001).
export const sectionMarkers = {
  // home
  beforeAfter: "001",
  whatWeDo: "002",
  pricing: "003",
  cta: "004",
  // /sobre
  whyNada: "001",
  forYou: "002",
  portfolio: "003",
  tools: "004",
  // /equipe
  founders: "001",
  // /como-funciona
  problem: "001",
  howItWorks: "002",
  membership: "003",
  ecosystem: "004",
  costOfNotDoing: "005",
  // /faq
  faq: "001",
  trust: "002",
};
