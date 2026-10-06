// Frase-mãe da marca, atravessa a copy inteira:
// "Seu negócio não deveria precisar de você pra funcionar."
export const HERO_HEADLINE_FIXA = "Se o seu negócio para quando você para,";

// O que a NADA Studio é, em uma linha: a primeira coisa lida na home, antes
// do título. Os três nomes são os mesmos de SERVICOS, do menu e do rodapé.
export const HERO_DESCRITOR = "Estúdio de sites, automação e vídeo.";

// Frase que se reveza no título (TituloRotativo): `metal` é a palavra em cromo.
export type Variacao = { antes: string; metal: string; depois: string };

// Duas frases: o problema e a resposta. O título troca uma vez e para na
// resposta (sem movimento, só ela aparece).
export const HERO_VARIACOES: Variacao[] = [
  { antes: "você não tem negócio, tem ", metal: "emprego", depois: "." },
  { antes: "a gente ", metal: "constrói", depois: " o que trabalha por você." },
];

export const HERO_SUB =
  "Site que vende, atendimento que responde sozinho e vídeo que mostra o que você faz. Pra profissionais e pequenos negócios.";

// Linha de prova na base do hero. Só dado real: o número vem do portfólio.
// Sem contagem de projetos: número pequeno enfraquecia mais do que provava.
export const HERO_LOCAL = "Jundiaí e região · Brasil inteiro no remoto";

// A pessoa declara a própria dor ao clicar.
export const HERO_CTA = "Quero parar de fazer isso na mão";
export const HERO_CTA_MSG = "Oi! Quero parar de fazer isso na mão.";

const WHATSAPP_NUMBER = "5511932159328";
const WHATSAPP_DEFAULT_MESSAGE = "Oi! Quero saber mais sobre a NADA Studio.";

export function buildWhatsAppLink(mensagem: string = WHATSAPP_DEFAULT_MESSAGE) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;
}

export const WHATSAPP_LINK = buildWhatsAppLink();
export const INSTAGRAM_LINK = "https://www.instagram.com/nada.studio.br/";

// Bloco do Instagram no Sobre (Instagram.tsx).
export const INSTAGRAM = {
  marcador: "Instagram",
  titulo: "Tem mais trabalho nosso no Instagram.",
  usuario: "@nada.studio.br",
  botao: "Seguir no Instagram",
};
export const GOOGLE_REVIEW_LINK = "https://maps.app.goo.gl/wyPhb2ahTweBx9yDA";

// A oferta concreta do site: rótulo dominante dos CTAs de decisão.
export const DIAGNOSTICO_CTA = "Pedir diagnóstico gratuito";

// "IA para empresas" fica fora do cabeçalho: o site fala com profissional e
// pequeno negócio, e empresa maior é outra conversa. A página continua no ar,
// alcançada pelo pé da lista de serviços (SERVICOS_EMPRESAS) e pelo rodapé.
export const navLinks = [
  { label: "Sobre", href: "/sobre" },
  { label: "Portfólio", href: "/portfolio" },
  { label: "Vídeo", href: "/motion" },
  { label: "Equipe", href: "/equipe" },
  { label: "Como funciona", href: "/como-funciona" },
  { label: "FAQ", href: "/faq" },
];

// Lista de sintomas: a pessoa se reconhece sozinha antes da gente vender nada.
// Nunca escrever "Você precisa de NADA se…" — a marca é sempre NADA Studio.
export const ISSO_E_COM_A_GENTE = {
  marcador: "Isso é com a gente",
  titulo: "Isso é com a gente se…",
  itens: [
    "Você responde a mesma pergunta todo dia.",
    "Alguém copia informação de um lugar pro outro.",
    "Você controla tudo por planilha.",
    "O cliente espera alguém responder.",
    "Você precisa cobrar pra tarefa simples sair.",
    "Uma semana fora e a empresa trava.",
  ],
  instrucao: "Marca os que batem com o seu dia.",
  fecho:
    "Se dois ou mais bateram, tem coisa aí que já devia estar rodando sozinha.",
  fechoUm: "Bateu um. Já dá uma boa conversa.",
  fechoVarios: (n: number) => `Bateram ${n}. Tem coisa aí que já devia estar rodando sozinha.`,
  cta: "Quero descobrir o quê",
  ctaMsg:
    "Oi! Bateram dois ou mais da lista. Quero descobrir o que já devia estar rodando sozinho.",
  ctaMsgMarcados: (itens: string[]) =>
    `Oi! Bateram estes da lista: ${itens.map((i) => i.replace(/\.$/, "")).join("; ")}. Quero descobrir o que já devia estar rodando sozinho.`,
};

export const ANTES_DEPOIS = {
  marcador: "Antes / depois",
  titulo: "O primeiro problema que a gente resolveu foi o nosso.",

  antes: {
    label: "Antes",
    manchete: "Planilha aberta todo fim de semana.",
    linhas: [
      "Duas horas todo sábado lançando gasto na mão, um por um.",
      "Fatura de um lado, extrato do outro, tentando bater o que sobrou.",
      "Descobria que tinha estourado o mês quando já era tarde.",
    ],
    valor: "8",
    unidade: "horas",
    legenda: "por mês, só pra saber onde o dinheiro tinha ido",
  },

  depois: {
    label: "Depois",
    manchete: "O gasto entra sozinho.",
    linhas: [
      "Abre o app e vê onde está o dinheiro, sem precisar montar nada.",
      "Estourou o limite de uma categoria, avisa antes, não depois.",
    ],
    valor: "10",
    unidade: "minutos",
    legenda: "por mês. O resto do tempo voltou pra vida.",
  },

  credito: "Projeto da NADA Studio · No Azul",
  creditoHref: "/portfolio/no-azul",
};

// Os três serviços, com o nome na frente: quem bate o olho lê o que a gente
// faz antes de ler pra que serve. A lista da home e a coluna do rodapé saem
// daqui. `href`: serviço que tem página própria.
export const SERVICOS = [
  {
    num: "01",
    titulo: "Sites",
    descricao: "Sob medida, rápido no celular, pronto pro Google e pra anúncio. Quem chega cai direto no seu WhatsApp.",
  },
  {
    num: "02",
    titulo: "Automação",
    descricao:
      "Atendimento, agenda e cobrança andando sem você. Quando a planilha não dá mais conta, a gente monta o sistema no lugar dela.",
  },
  {
    num: "03",
    titulo: "Vídeo",
    descricao: "Edição e motion pra mostrar o que você faz, do reels à abertura do site.",
    href: "/motion",
    rotulo: "Ver os vídeos",
  },
] as { num: string; titulo: string; descricao: string; href?: string; rotulo?: string }[];

// Empresa maior é outra conversa: tem porta própria, fora da lista.
export const SERVICOS_EMPRESAS = {
  texto: "Empresa com equipe? A conversa é outra:",
  link: "IA para empresas",
  href: "/ia-para-empresas",
};

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

// Pra quem a NADA Studio trabalha: do profissional sozinho à empresa com
// equipe, e quem só quer tirar uma tarefa da frente. Cada público com a cena
// do que sai das costas dele.
export const forYou = {
  title: "Pra quem tem trabalho que se repete.",
  itens: [
    {
      num: "01",
      publico: "Profissionais",
      texto: "Professor, nutricionista, psicóloga, personal. Confirmar horário, cobrar e lembrar quem faltou saem das suas costas. Você fica com o atendimento.",
    },
    {
      num: "02",
      publico: "Pequenos negócios",
      texto: "Barbearia, loja, oficina, restaurante. A agenda e o estoque param de depender de caderno e de memória.",
    },
    {
      num: "03",
      publico: "Empresas",
      texto: "Equipe que copia dado de um sistema pro outro e monta o mesmo relatório todo mês. A gente liga os sistemas e ensina a equipe a usar.",
    },
    {
      num: "04",
      publico: "Quem tem uma tarefa só",
      texto: "Não precisa de projeto grande. Uma planilha que se preenche sozinha ou um aviso que sai na hora certa já devolve tempo.",
    },
  ],
};

// Capacidade, não tecnologia: o que passa a conversar entre si. Sem nome de
// fornecedor (as ferramentas aparecem no Sobre e no FAQ). A quantidade de
// áreas é livre: o desenho da árvore se ajusta (Ecosystem.tsx).
export const ecosystemIntro = {
  marcador: "Tudo conectado",
  header: "Seu negócio, conectado no lugar certo.",
  sub: "Divulgação, venda, operação, atendimento e dinheiro conversando entre si. A informação entra uma vez e chega aonde precisa, sem você copiando de um lugar pro outro.",
};

export const ECOSSISTEMA = {
  centro: "Seu negócio",
  areas: [
    { nome: "Marketing", acoes: ["Vídeo e motion", "Aparecer no Google", "Anúncios", "Conteúdo"] },
    { nome: "Vendas", acoes: ["Contatos novos", "Propostas", "Pedidos", "Catálogo"] },
    { nome: "Operação", acoes: ["Estoque", "Tarefas", "Documentos", "Aprovações"] },
    { nome: "Clientes", acoes: ["WhatsApp", "Agenda", "Atendimento", "Avisos"] },
    { nome: "Financeiro", acoes: ["Cobrança", "Pagamentos", "Relatórios", "Fechamento do mês"] },
  ],
};

// Sem pergunta de preço: o site não levanta objeção que a pessoa ainda não
// fez. O assunto aqui é o tempo que ela já perde, não o valor do projeto.
export const costOfNotDoing = {
  header: "Não fazer nada também custa.",
  text: "Faz a conta. Quantas horas por semana você (ou sua equipe) gasta no repetitivo? Multiplica por um mês. Por um ano. Esse tempo já tem um custo. Só que ele é invisível, sai fatiado, todo dia.",
  destaque: "E você já paga, em hora perdida.",
  microCta: "Descobrir quanto você perde",
};

export const foundersIntro = {
  header: "A NADA Studio são duas pessoas.",
  text: "João e Eric, de Jundiaí. Quem conversa com você é quem desenha, constrói e cuida do projeto depois de pronto. Não tem vendedor nem atendente no meio. O atendimento é presencial na região e remoto pro Brasil inteiro.",
};

// retrato: foto em pé, mostrada em cor num quadro 9:16, só na página Equipe.
// O arquivo vai em public/equipe/ e depois roda node scripts/imagens.mjs. Sem
// o arquivo, o site não mostra o quadro (src/lib/retratos.ts confere no build).
// posicao: object-position do retrato, quando o rosto não está no meio da foto.
// frase: uma linha em primeira pessoa, escrita pelo próprio sócio, em duas
// metades: a segunda entra um tempo depois da primeira (FraseSocio).
export const founders: {
  name: string;
  role: string;
  photo?: string;
  retrato?: string;
  posicao?: string;
  frase?: readonly [string, string];
  skills: string[];
}[] = [
  {
    name: "João Passos",
    role: "Fundador",
    photo: "/Joao_IMG.jpeg",
    retrato: "/equipe/joao.webp",
    frase: ["Se dá trabalho todo dia,", "provavelmente dá pra fazer melhor."],
    skills: [
      "Desenvolvimento de produtos e sistemas",
      "Processos e arquitetura",
      "Análise de processos",
    ],
  },
  {
    name: "Eric Crispim",
    role: "Fundador",
    photo: "/Eric_IMG.jpeg",
    retrato: "/equipe/eric.png",
    posicao: "70% 50%",
    frase: ["O óbvio funciona.", "Eu prefiro o que surpreende."],
    skills: [
      "Desenvolvimento de produtos e sistemas",
      "Infraestrutura e integrações",
      "Sistemas internos e suporte técnico",
    ],
  },
];

export const trustBadges = [
  "Preço fechado antes de começar",
  "100% sob medida",
];

// A linha "Fala direto com o sócio" virou argumento, não mais um selo discreto.
export const SEM_VENDEDOR = {
  titulo: "Sem vendedor no meio.",
  texto:
    "Você fala direto com quem vai pensar e construir a solução. Não tem pacote pronto pra te empurrar.",
};

export const faqItems = [
  {
    q: "Preciso entender de tecnologia para contratar?",
    a: "Não. Esse é exatamente o nosso trabalho. Você conta a sua rotina e o que consome seu tempo, a gente desenha, constrói e entrega tudo pronto funcionando na prática.",
  },
  {
    q: "Quanto custa criar um site ou automação?",
    a: "Cada projeto é planejado sob medida para a realidade do seu negócio. A gente define o escopo e o valor fechado antes de começar, sem surpresas nem cobranças escondidas. O primeiro passo é o diagnóstico gratuito.",
  },
  {
    q: "Qual é o prazo de entrega do projeto?",
    a: "Página única e automações pontuais ficam prontas em 3 a 7 dias úteis. Sites completos e sistemas sob medida levam de 2 a 3 semanas. Você acompanha cada etapa.",
  },
  {
    q: "O site já vem otimizado para aparecer no Google?",
    a: "Sim. O site já sai preparado para ser encontrado no Google: carrega rápido, funciona bem no celular e leva as informações que o Google usa pra entender o seu negócio.",
  },
  {
    q: "Como funciona a automação de WhatsApp e atendimento?",
    a: "As mensagens saem de um número dedicado, que a gente configura e mantém. Nada de robô instalado no seu WhatsApp pessoal: ele continua só seu. O atendimento responde as dúvidas mais comuns, separa quem já quer contratar, confirma e lembra horário, marca na sua agenda e manda o link de pagamento por Pix.",
  },
  {
    q: "Quais ferramentas vocês conseguem integrar?",
    a: "Funciona com o que você já usa: WhatsApp, Instagram, Gmail, Google Agenda, Drive, Planilhas, Forms, Meet, Notion, ClickUp, Pix e Mercado Pago. Se a ferramenta permite conexão, a gente liga.",
  },
  {
    q: "E se eu já tiver um site ou domínio registrado?",
    a: "A gente aproveita o seu domínio, renova o visual, deixa o site mais rápido e liga as automações sem tirar seu negócio do ar.",
  },
  {
    q: "Como funciona o suporte e manutenção depois de pronto?",
    a: "Tem plano de cuidado contínuo: site no ar, seguro e rápido, automações rodando e suporte direto no WhatsApp com quem construiu o projeto.",
  },
  {
    q: "Tem contrato de fidelidade ou multa de cancelamento?",
    a: "Não. O cliente fica porque o serviço funciona. Você tem total liberdade, e o site e o domínio são 100% seus.",
  },
  {
    q: "Vocês atendem presencialmente ou apenas online?",
    a: "Temos base em Jundiaí e região para atendimento presencial e atendemos clientes remotamente em todo o Brasil.",
  },
];

// Braço de vídeo da NADA Studio (/motion). Higgsfield é ferramenta, não
// posicionamento. Trabalhos: só peça real; sem vídeo, o slot fica preparado.
export const MOTION = {
  // Duas frases: a segunda entra num corte seco (MotionHero).
  titulo: ["Do nada nasce tudo.", "Inclusive o vídeo."] as const,
  sub: "Edição, motion design e produção visual, feitos pelo mesmo estúdio que faz o seu site.",
  capacidades: [
    {
      num: "01",
      titulo: "Edição",
      texto: "Do material bruto ao vídeo pronto pra postar: corte, ritmo, legenda e trilha. Reels, apresentação de serviço, depoimento que você já gravou.",
    },
    {
      num: "02",
      titulo: "Motion",
      texto: "Marca, texto e tela ganhando movimento. Vinheta, abertura de logotipo, explicação de produto e animação de interface.",
    },
    {
      num: "03",
      titulo: "Produção visual",
      texto: "Cena, objeto e ambientação que custariam caro pra gravar. Quando faz sentido, a gente produz com Higgsfield, sempre com o produto e a tela reais no centro. Pessoa e resultado nunca são inventados.",
    },
  ],
  trabalhosTitulo: "Feito aqui.",
  trabalhosTexto: "Cada peça diz de onde veio: de cliente, nossa ou estudo autoral.",
  cta: {
    titulo: "Tem coisa boa que ninguém tá vendo?",
    texto: "Conta o que você quer mostrar e onde vai passar. A gente devolve uma proposta de vídeo do tamanho do seu negócio.",
    botao: "Falar sobre vídeo",
    msg: "Oi! Quero falar sobre vídeo e motion pro meu negócio.",
  },
};

// Grupos da seção Trabalhos: a competência principal de cada peça, na ordem em
// que aparecem. Grupo sem peça não é mostrado.
export const MOTION_GRUPOS = [
  { id: "motion", titulo: "Motion design" },
  { id: "edicao", titulo: "Edição" },
] as const;

// De onde a peça veio. Trabalho que ninguém contratou sai sempre com o rótulo
// (estudo autoral ou spec edit), nunca como se fosse de cliente.
export type OrigemPeca = "cliente" | "nosso" | "autoral" | "spec";
export const ROTULO_ORIGEM: Record<OrigemPeca, string> = {
  cliente: "Cliente",
  nosso: "Nosso",
  autoral: "Estudo autoral",
  spec: "Spec edit",
};

// Peças de motion e vídeo reais, sem limite de quantidade: peça nova é uma
// linha na tabela de scripts/motion.mjs (que gera os arquivos de public/motion)
// e uma entrada aqui. `formato` "vertical" é 9:16; o padrão é 16:10. Sem peça
// real, não entra nada aqui, e a descrição só diz o que se vê no vídeo.
export const MOTION_TRABALHOS: {
  titulo: string;
  competencia: (typeof MOTION_GRUPOS)[number]["id"];
  origem: OrigemPeca;
  descricao: string;
  formato?: "horizontal" | "vertical";
  poster?: string; // primeiro quadro do filme
  video?: string; // o filme: trecho mudo em loop, em tela cheia no cartão
  videoPequeno?: string; // o mesmo filme pra tela de celular
  inteira?: string; // a peça inteira, com som: toca no clique, no mesmo quadro
  duracao?: string; // da peça inteira
  href?: string; // sem `inteira`: pra onde o cartão leva
  externo?: boolean;
  abertura?: boolean; // a peça é a própria abertura do site: toca dentro do cartão
}[] = [
  {
    titulo: "Abertura do site da NADA Studio",
    competencia: "motion",
    origem: "nosso",
    descricao: "O ponto, o traço do logotipo e a passagem do preto pro branco. A primeira coisa que você viu aqui.",
    href: "/?intro",
    abertura: true,
  },
  {
    titulo: "Abertura do site da Ana Marocci",
    competencia: "motion",
    origem: "cliente",
    descricao: "A marca dela ganhando movimento na entrada do site, antes da primeira frase.",
    href: "https://anamaroccinutri.com.br",
    externo: true,
    // A própria abertura, gravada do site no ar (scripts/gravar-capa.mjs).
    poster: "/portfolio/capa-ana-larga.webp",
    video: "/portfolio/capa-ana-larga.mp4",
    videoPequeno: "/portfolio/capa-ana-larga-p.mp4",
  },
  {
    titulo: "Anúncio do Hub",
    competencia: "motion",
    origem: "nosso",
    descricao:
      "Um minuto pra apresentar o Hub, o sistema de gestão da NADA Studio. Primeiro a bagunça de planilha e post-it, depois as telas do sistema em movimento.",
    formato: "vertical",
    poster: "/motion/hub-anuncio.webp",
    video: "/motion/hub-anuncio-previa.mp4",
    videoPequeno: "/motion/hub-anuncio-previa-p.mp4",
    inteira: "/motion/hub-anuncio.mp4",
    duracao: "1:08",
  },
  {
    titulo: "Motion design é com a gente",
    competencia: "motion",
    origem: "autoral",
    descricao: "Letra que se escreve sozinha e um ponto que vira marca. Tudo em preto e branco.",
    formato: "vertical",
    poster: "/motion/tipografia.webp",
    video: "/motion/tipografia-previa.mp4",
    videoPequeno: "/motion/tipografia-previa-p.mp4",
    inteira: "/motion/tipografia.mp4",
    duracao: "0:28",
  },
  {
    titulo: "Só faltava o carro",
    competencia: "edicao",
    origem: "autoral",
    descricao: "A placa do Fiesta começa com FER. No corte, ele vira uma Ferrari e sai pra rua.",
    formato: "vertical",
    poster: "/motion/ferrari.webp",
    video: "/motion/ferrari-previa.mp4",
    videoPequeno: "/motion/ferrari-previa-p.mp4",
    inteira: "/motion/ferrari.mp4",
    duracao: "0:29",
  },
  {
    titulo: "Logotipo em cortes",
    competencia: "edicao",
    origem: "autoral",
    descricao: "O logotipo da NADA Studio em papel, vidro, tecido e tela, trocando de superfície em corte seco.",
    formato: "vertical",
    poster: "/motion/logotipo-cortes.webp",
    video: "/motion/logotipo-cortes-previa.mp4",
    videoPequeno: "/motion/logotipo-cortes-previa-p.mp4",
    inteira: "/motion/logotipo-cortes.mp4",
    duracao: "0:08",
  },
];

// Braço de IA da NADA Studio (/ia-para-empresas). Exceção à regra da marca: no
// resto do site "IA" não aparece como argumento de venda; aqui ela é o
// próprio serviço, então é dita com todas as letras. Sem preço, prazo ou nome
// de ferramenta: isso se combina na conversa.
export const IA_EMPRESAS = {
  marcador: "IA para empresas",
  // O título se reveza como o da home (TituloRotativo) e para na última frase.
  titulo: {
    fixa: "Todo mundo fala de IA.",
    variacoes: [
      { antes: "Na sua empresa, alguém ", metal: "usa", depois: "?" },
      { antes: "Cada um usa do seu ", metal: "jeito", depois: "." },
      { antes: "Falta entrar no ", metal: "processo", depois: "." },
      { antes: "A gente implementa e ", metal: "treina", depois: "." },
    ] as Variacao[],
  },
  sub: "A gente implementa IA dentro da sua empresa e treina a equipe pra usar no próprio trabalho: com os seus documentos, no seu processo, do jeito que o seu dia funciona.",
  frentesTitulo: "Do diagnóstico à equipe usando.",
  frentes: [
    {
      num: "01",
      titulo: "Diagnóstico",
      texto: "A gente senta com cada área e olha o dia como ele é: o que se repete, o que trava, onde a IA ajuda e onde não vale a pena. Sai dali uma lista curta do que fazer primeiro.",
    },
    {
      num: "02",
      titulo: "Implementação",
      texto: "A ferramenta entra configurada no trabalho que a empresa já faz: responder cliente, montar proposta, resumir relatório, conferir planilha. Com a regra do que pode e do que não pode passar por ela.",
    },
    {
      num: "03",
      titulo: "Treinamento",
      texto: "Treinamento prático, com os casos da própria empresa. Cada pessoa sai usando no trabalho dela, sem apostila genérica.",
    },
  ],
  cta: {
    titulo: "Quer a sua equipe usando IA?",
    texto: "Conta como é o dia da sua empresa. A gente diz por onde começar.",
    botao: "Falar sobre IA pra minha empresa",
    msg: "Oi! Quero falar sobre implementação e treinamento de IA na minha empresa.",
  },
};

// Chamada final das páginas internas (toda página termina pedindo a conversa).
// Sem título próprio, vale o padrão do componente CTA.
export const CHAMADAS = {
  equipe: {
    titulo: "Fala direto com quem constrói.",
    texto: "Sem vendedor no meio. Conta o que trava o seu dia e quem responde é quem vai construir.",
  },
  comoFunciona: {
    titulo: "O primeiro passo é uma conversa.",
    texto: "Conta o que trava o seu dia. A gente olha o seu caso e diz o que resolver primeiro.",
  },
  faq: {
    titulo: "Sobrou alguma pergunta?",
    texto: "Manda no WhatsApp. Quem responde é quem constrói o seu projeto.",
    botao: "Perguntar no WhatsApp",
    msg: "Oi! Tenho uma pergunta sobre a NADA Studio.",
  },
};

// Numeração por página (cada rota reinicia em 001, na ordem em que aparece).
export const sectionMarkers = {
  // home
  whatWeDo: "001",
  isso: "002",
  beforeAfter: "003",
  portfolio: "004",
  pricing: "005",
  cta: "006",
  // /sobre
  whyNada: "001",
  forYou: "002",
  tools: "003",
  instagram: "004",
  sobreCta: "005",
  // /equipe
  founders: "001",
  equipeCta: "002",
  // /como-funciona
  problem: "001",
  howItWorks: "002",
  membership: "003",
  ecosystem: "004",
  costOfNotDoing: "005",
  comoFuncionaCta: "006",
  // /faq
  faq: "001",
  trust: "002",
  faqCta: "003",
  // /portfolio
  portfolioTopo: "001",
  clientes: "002",
  nosso: "003",
  portfolioCta: "004",
  // /motion
  motion: "001",
  capacidades: "002",
  trabalhos: "003",
  motionCta: "004",
  // /ia-para-empresas
  ia: "001",
  iaFrentes: "002",
  iaCta: "003",
};
