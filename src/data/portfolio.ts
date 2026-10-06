export type TipoProjeto = "cliente" | "interno";

// Capa no sistema da NADA Studio (components/Capa.tsx). A capa é a prévia do
// que o projeto tem de mais forte, nunca um print de página:
//   filme        o projeto em movimento, em tela cheia (pôster + vídeo)
//   recorte      pedaço da interface real, inteiro, sobre o fundo da capa
//   numero       o resultado em tipografia, com a faixa da interface
//   foto         foto real do material
//   cena         motion em código, pra projeto sem tela pra filmar: ilustra o
//                que ele faz no desenho da marca, sem imitar interface
//   tipografica  sem asset real: só o nome
// Interface sempre real. Nunca foto de banco.
export type Capa = {
  tipo: "filme" | "recorte" | "foto" | "numero" | "cena" | "tipografica";
  cena?: "leitor" | "transcricao" | "jornal"; // tipo cena: qual motion (components/CapaCena.tsx)
  imagem?: string; // pôster do filme (o primeiro quadro), recorte ou foto
  video?: string; // filme em pé, 4:5 (índice e home)
  // largura ÷ altura do recorte: a capa mostra o recorte inteiro, na forma
  // dele. Os recortes saem de scripts/imagens.mjs.
  proporcao?: number;
  // Versão do topo do case (16:10); videoPequeno é o mesmo filme pra tela de celular.
  larga?: { imagem: string; proporcao?: number; video?: string; videoPequeno?: string };
  posicao?: string; // object-position do recorte (só sem proporção)
  metrica?: string; // tipo número: o resultado em tipografia grande
};

// Capa em filme. Os quatro arquivos saem de scripts/gravar-capa.mjs, que
// grava o site real do projeto quadro a quadro.
const filme = (nome: string): Capa => ({
  tipo: "filme",
  imagem: `/portfolio/capa-${nome}.webp`,
  video: `/portfolio/capa-${nome}.mp4`,
  larga: {
    imagem: `/portfolio/capa-${nome}-larga.webp`,
    video: `/portfolio/capa-${nome}-larga.mp4`,
    videoPequeno: `/portfolio/capa-${nome}-larga-p.mp4`,
  },
});

// Cada projeto é contado em quatro blocos: antes, problema, depois, resultado.
// Cena concreta em cada um, nunca resumo abstrato.
export type Projeto = {
  slug: string;
  num: string;
  nome: string;
  subtitulo: string;
  tipo: TipoProjeto;
  entrega: string; // em palavra comum: site, sistema, catálogo. Nunca tecnologia.
  chamada: string; // uma linha de resultado, pro índice e pra capa
  // Na voz de quem lê, tirado do "antes" do próprio case: completa o
  // "me identifiquei:" da mensagem do WhatsApp no fim da página.
  identifica: string;
  capa: Capa;
  antes: string;
  problema: string;
  depois: string;
  resultado: string;
  metrica?: { valor: string; legenda: string }; // só número real
  link?: string;
  linkLabel?: string;
  galeria?: { src: string; largura: number; altura: number; legenda: string }[];
  // Ferramenta que vive dentro de outro projeto (as do Hub): slug do projeto-mãe.
  parteDe?: string;
  // Chamada final própria, no lugar do "Me identifiquei" (ex.: pedir a ferramenta).
  cta?: { texto: string; botao: string; mensagem: string };
  // Rótulo curto ao lado do nome no índice; no case, explicado em uma linha.
  selo?: { rotulo: string; texto: string };
};

export const ROTULO_TIPO: Record<TipoProjeto, string> = {
  cliente: "cliente",
  interno: "nosso",
};

export const PROJETOS: Projeto[] = [
  {
    slug: "ana-marocci",
    num: "01",
    nome: "Ana Marocci",
    subtitulo: "Site para nutricionista",
    tipo: "cliente",
    entrega: "Site",
    chamada: "Um site que mostra quem ela é e serve de destino pra anúncio.",
    identifica: "meu site também só tem a minha apresentação",
    capa: filme("ana"), // a abertura da marca
    antes:
      "A Ana tinha um site com a apresentação profissional dela, e só isso.",
    problema:
      "Quem chegava via a profissional, mas não conhecia a Ana nem entendia como era trabalhar com ela. E o site não servia de destino pra anúncio.",
    depois:
      "Um site novo, com página pra quem ela é, pra como funciona o acompanhamento e pras dúvidas de quem ainda não decidiu. Abre com a marca dela em animação e vai direto na ideia que ela defende: emagrecimento sem abrir mão da vida real. O botão do WhatsApp está em todas as páginas, e o formulário fica como segundo caminho pra quem prefere começar escrevendo.",
    resultado:
      "O link da bio do Instagram agora leva a um site que mostra quem a Ana é e como ela trabalha, e que serve de destino pra anúncio no Google e no Meta quando ela quiser.",
    link: "https://anamaroccinutri.com.br",
    linkLabel: "Ver site no ar",
    galeria: [
      { src: "/portfolio/ana-site.webp", largura: 2880, altura: 1800, legenda: "A primeira tela já diz a ideia que a Ana defende." },
      { src: "/portfolio/ana-site-celular.webp", largura: 1170, altura: 2532, legenda: "No celular, o primeiro botão já abre o WhatsApp dela." },
    ],
  },
  {
    slug: "thayana-de-oliveira",
    num: "02",
    nome: "Thayana de Oliveira",
    subtitulo: "Site e triagem para psicóloga",
    tipo: "cliente",
    entrega: "Site com triagem",
    chamada: "Ela abre o WhatsApp já sabendo com quem fala.",
    identifica: "também recebo contato novo sem saber nada sobre a pessoa",
    capa: filme("thayana"), // a triagem, pergunta por pergunta
    antes:
      "Paciente nova chegava por indicação e caía direto no WhatsApp, sem ela saber nada sobre a pessoa.",
    problema:
      "Gastava a primeira meia hora perguntando o básico no WhatsApp.",
    depois:
      "O próprio site colhe a informação antes da conversa: um formulário curto, respondido no tempo da pessoa, e o WhatsApp só depois. Quando alguém responde, a Thayana é avisada na hora.",
    resultado:
      "Ela abre o WhatsApp já sabendo com quem fala e o que a pessoa procura.",
    link: "https://thayanadeoliveira.com.br",
    linkLabel: "Ver site no ar",
    galeria: [
      { src: "/portfolio/thayana-site.webp", largura: 2880, altura: 1800, legenda: "Na primeira tela, pra quem é o atendimento e o botão da triagem." },
      { src: "/portfolio/thayana-site-celular.webp", largura: 1170, altura: 2532, legenda: "No celular, a triagem começa no primeiro botão." },
    ],
  },
  {
    slug: "mileide-rodrigues",
    num: "03",
    nome: "Mileide Rodrigues",
    subtitulo: "Site e anúncio para psicanalista",
    tipo: "cliente",
    entrega: "Site e anúncio",
    chamada: "Quem clica no anúncio chega no WhatsApp já sabendo o que procura.",
    identifica: "também dependo de indicação pra encher a agenda",
    capa: filme("mileide"), // a pergunta que abre o site
    antes:
      "Psicanalista em Anicuns, interior de Goiás, com paciente novo chegando só por indicação e pelo Instagram.",
    problema:
      "Ela atende online pro Brasil inteiro, mas só enchia a agenda com quem morava perto.",
    depois:
      "Um site que explica o trabalho dela, e anúncio no Meta levando quem clica pra esse site. Cada botão da página abre o WhatsApp dela, sem formulário e sem etapa no meio.",
    resultado:
      "O anúncio cai direto no WhatsApp: a pessoa chega já tendo lido sobre o trabalho e sabendo o que procura.",
    link: "https://mileidepsi.com.br",
    linkLabel: "Ver site no ar",
    galeria: [
      { src: "/portfolio/mileide-site.webp", largura: 2880, altura: 1800, legenda: "Uma pergunta na primeira tela e um botão que abre o WhatsApp dela." },
      { src: "/portfolio/mileide-site-celular.webp", largura: 1170, altura: 2532, legenda: "No celular, os dois botões abrem o WhatsApp." },
    ],
  },
  {
    slug: "espaco-gc-style",
    num: "04",
    nome: "Espaço GC Style",
    subtitulo: "Catálogo digital e banner de balcão",
    tipo: "cliente",
    entrega: "Catálogo e banner",
    chamada: "O balcão virou amostra de um catálogo com mais de 70 fragrâncias.",
    identifica: "também tenho mais produto do que cabe no balcão",
    capa: filme("gc-style"), // do banner do balcão pro catálogo e o quiz
    antes:
      "Barbearia que vende perfume árabe no balcão, com espaço pra só alguns provadores.",
    problema:
      "O cliente só conhecia o que estava na frente dele. O resto da linha nem chegava a ser visto.",
    depois:
      "A gente criou o banner do balcão e o catálogo digital. No banner, uma tag NFC e um QR code: o cliente aproxima o celular ou aponta a câmera e cai num catálogo com mais de 70 fragrâncias, busca por marca, pela grife que inspirou o perfume ou pela família olfativa, e um quiz que indica o perfume pelo gosto de quem responde. O pedido sai pronto no WhatsApp, pra retirar no próximo corte ou receber em casa.",
    resultado:
      "O balcão virou amostra: o cliente escolhe entre o catálogo inteiro, pelo celular, enquanto espera o corte.",
    link: "https://catalogo-perfumes.pages.dev",
    linkLabel: "Ver catálogo no ar",
    galeria: [
      { src: "/portfolio/gcstyle-banners.webp", largura: 1624, altura: 1000, legenda: "Os dois banners do balcão, linha masculina e linha feminina." },
      { src: "/portfolio/gcstyle-nfc.webp", largura: 1200, altura: 330, legenda: "Aproximou o celular ou apontou a câmera, abriu o catálogo." },
      { src: "/portfolio/gcstyle-site.webp", largura: 2880, altura: 1800, legenda: "O catálogo: o balcão é só uma amostra." },
      { src: "/portfolio/gcstyle-catalogo.webp", largura: 1240, altura: 840, legenda: "Busca por marca, grife de inspiração ou família olfativa." },
      { src: "/portfolio/gcstyle-site-celular.webp", largura: 1170, altura: 2532, legenda: "Feito pra abrir no celular, na cadeira do corte." },
    ],
  },
  {
    slug: "torre-de-controle",
    num: "05",
    nome: "Torre de Controle",
    subtitulo: "Busca de vaga no automático",
    tipo: "cliente",
    entrega: "Sistema",
    chamada: "De 248 vagas, 85 passaram na triagem já com o currículo pronto.",
    identifica: "também perco tempo garimpando o que vale no meio do que não serve",
    capa: filme("torre"), // o Início e a lista de vagas ordenada pela nota
    antes:
      "Procurar vaga era abrir o LinkedIn todo dia, ler descrição por descrição e reescrever o currículo pra cada uma.",
    problema:
      "A vaga boa se perdia no meio de centenas que não tinham nada a ver.",
    depois:
      "As vagas chegam por e-mail e vão sozinhas pro painel. Uma triagem em duas camadas, regra fixa primeiro e IA depois, dá nota de 0 a 100 pra cada uma. Pra vaga que vale, o painel monta um dossiê com o currículo reescrito pra ela, usando só o que já existe no currículo real.",
    resultado:
      "De 248 vagas que entraram, 85 passaram na triagem e já chegaram com o currículo pronto.",
    metrica: { valor: "248 → 85", legenda: "vagas que entraram → vagas que passaram na triagem" },
    galeria: [
      { src: "/portfolio/torre.webp", largura: 1571, altura: 886, legenda: "Vagas: tudo que chegou, ordenado pela nota." },
      { src: "/portfolio/torre-inicio.webp", largura: 1600, altura: 785, legenda: "Início: o que chegou, o que tem mais aderência e o que está em processo." },
      { src: "/portfolio/torre-dossie-v2.webp", largura: 744, altura: 813, legenda: "Dossiê: currículo reescrito pra vaga, pronto pra conferir e enviar." },
    ],
  },
  {
    // Feito pra uma empresa privada, que não é citada. A tecnologia também não.
    slug: "leitor-de-estoque",
    num: "06",
    nome: "Leitor & Controle de Estoque",
    subtitulo: "Controle de estoque por leitura de código",
    tipo: "cliente",
    entrega: "Sistema",
    chamada: "Cada entrada e saída de insumo registrada num bip.",
    identifica: "também não sei quanto insumo entra e quanto sai",
    capa: { tipo: "cena", cena: "leitor" },
    antes: "Uma empresa privada não tinha controle do insumo que entrava nem do que saía.",
    problema: "Sem registro, ninguém sabia dizer quanto tinha em estoque nem pra onde tinha ido.",
    depois:
      "Um bip do leitor de código e um sistema simples: cada entrada e cada saída de insumo fica registrada na hora.",
    resultado: "Estoque atualizado a cada bip, sem ninguém digitar nada.",
  },
  {
    // Feito pra equipe de implantação e suporte de uma empresa privada, que não
    // é citada. A tecnologia também não. As telas são de uma cópia de
    // demonstração com dados inventados (ver scripts/gravar-capa.mjs).
    // O "antes" e o "problema" esperam a confirmação de quem viveu o caso.
    slug: "controle-de-ponto",
    num: "07",
    nome: "Controle de Ponto",
    subtitulo: "Ponto do dia e espelho do mês enviado sozinho",
    tipo: "cliente",
    entrega: "Sistema",
    chamada: "No último dia do mês, o espelho de ponto sai pronto pro gestor.",
    identifica: "também fecho o ponto do mês na correria",
    capa: filme("ponto"), // o dia e o mês, o banco de horas e os dois disparos do fim do mês
    antes: "O ponto da equipe ficava numa planilha, e o espelho do mês era montado na mão pra mandar pro gestor.",
    problema: "Dia sem registro só aparecia no fechamento, quando ninguém mais lembrava a hora em que tinha entrado.",
    depois:
      "Cada pessoa bate a entrada e a saída num clique e marca se o dia foi presencial ou em casa. O sistema calcula as horas, o saldo do mês e o banco de horas, e guarda os gastos do dia. No último dia do mês, avisa às 16h45 se ficou dia útil sem registro. Às 18h, monta o espelho em PDF e manda pro gestor no WhatsApp.",
    resultado: "O mês fecha sem planilha e sem ninguém precisar lembrar de enviar.",
    galeria: [
      { src: "/portfolio/ponto-registros.webp", largura: 2880, altura: 1800, legenda: "O dia de hoje no topo e o mês inteiro abaixo, com o saldo de cada dia. Os dados são de demonstração." },
      { src: "/portfolio/ponto-banco.webp", largura: 2880, altura: 1800, legenda: "Banco de horas: o saldo de cada mês e o acumulado." },
      { src: "/portfolio/ponto-envios.webp", largura: 2880, altura: 1800, legenda: "Os dois disparos do último dia do mês: o aviso de dia sem registro e o espelho em PDF." },
    ],
  },
  {
    // Mesmo sistema e mesma empresa do Controle de Ponto: vale o comentário de lá.
    slug: "implantacao-de-clientes",
    num: "08",
    nome: "Implantação de Clientes",
    subtitulo: "Acompanhamento de cliente novo, da assinatura ao lançamento",
    tipo: "cliente",
    entrega: "Sistema",
    chamada: "Cada cliente novo com a etapa e o prazo à vista, e a ata sai pronta.",
    identifica: "também perco o fio de cada cliente novo quando são vários ao mesmo tempo",
    capa: filme("implantacao"), // a lista por semana, um cliente aberto, a ata e o painel de envios
    antes: "Uma equipe colocava várias lojas virtuais no ar ao mesmo tempo, cada uma numa etapa diferente.",
    problema: "Pra saber quem estava atrasado, era abrir conversa por conversa. E a ata de cada reunião era escrita do zero.",
    depois:
      "Cada cliente segue um roteiro de semanas, com a lista do que precisa estar pronto em cada uma. A tela mostra o percentual, o prazo da etapa e quem atrasou. No fim da reunião, a ata sai montada pra e-mail ou WhatsApp, com o que foi feito, o que falta e a pauta da próxima. Um painel controla as mensagens automáticas: dá pra pausar, pôr em teste ou desligar cada uma, e em dia de instabilidade nenhuma sai. Cada pessoa da equipe só vê o que o papel dela permite.",
    resultado: "Abre a tela e vê quem está em dia, quem atrasou e o que falar na próxima reunião.",
    galeria: [
      { src: "/portfolio/implantacao-lista.webp", largura: 2880, altura: 1800, legenda: "Cada cliente na sua semana, e quem atrasou no topo. Os nomes são de demonstração." },
      { src: "/portfolio/implantacao-cliente.webp", largura: 2880, altura: 1800, legenda: "Um cliente aberto: o roteiro, o percentual e o prazo de cada etapa." },
      { src: "/portfolio/implantacao-ata.webp", largura: 2880, altura: 1800, legenda: "A ata da reunião, pronta pra colar no WhatsApp." },
      { src: "/portfolio/implantacao-envios.webp", largura: 2880, altura: 1800, legenda: "O painel das mensagens automáticas: pausar, testar ou desligar cada uma." },
      { src: "/portfolio/implantacao-usuarios.webp", largura: 2880, altura: 1800, legenda: "Cada papel da equipe enxerga só as telas de que precisa." },
    ],
  },
  {
    // Mesmo sistema e mesma empresa do Controle de Ponto: vale o comentário de
    // lá. As peças da galeria são saídas reais do gerador; o status de
    // aprovação das telas é de demonstração.
    slug: "gerador-de-banners",
    num: "09",
    nome: "Gerador de Banners",
    subtitulo: "Os banners do ano, gerados por IA no tamanho certo",
    tipo: "cliente",
    entrega: "Ferramenta",
    chamada: "O calendário de campanhas do ano, com cada banner gerado e aprovado na mesma tela.",
    identifica: "também refaço banner de campanha um por um, todo mês",
    capa: filme("banners"), // um mês aberto, a prévia dos dois formatos, o ano e os departamentos
    antes:
      "Loja virtual pede banner novo a cada campanha: Páscoa, Dia das Mães, festa junina, Black Friday. E cada peça sai em mais de um tamanho, pro site e pro celular.",
    problema: "São 48 campanhas no ano, cada uma em dois tamanhos. Feito peça por peça, não dava tempo.",
    depois:
      "O ano vira um calendário: doze meses, quatro campanhas em cada um. A ferramenta gera o banner de cada campanha com IA, já no tamanho do site e do celular, e escreve o título por cima com a fonte certa, sem erro de grafia. Cada peça passa por aprovação: dá pra ver os formatos lado a lado, aprovar ou mandar refazer só um. Existe um padrão que vale pra todas as lojas e a versão de cada loja, com a logo dela. Os banners de departamento e os kits saem do mesmo jeito.",
    resultado: "O calendário do ano fica numa tela só, com o que já foi aprovado e o que falta criar.",
    galeria: [
      { src: "/portfolio/banners-calendario.webp", largura: 2880, altura: 1800, legenda: "O ano em doze meses, com quatro campanhas em cada um. O status de aprovação é de demonstração." },
      { src: "/portfolio/banners-previa.webp", largura: 2880, altura: 1800, legenda: "Uma campanha nos dois formatos, pronta pra aprovar ou refazer." },
      { src: "/portfolio/banners-peca-pascoa.webp", largura: 2256, altura: 576, legenda: "Peça gerada pela ferramenta: banner de Páscoa no formato do site." },
      { src: "/portfolio/banners-peca-maes.webp", largura: 2256, altura: 576, legenda: "Dia das Mães." },
      { src: "/portfolio/banners-peca-arraia.webp", largura: 2256, altura: 576, legenda: "Festa junina." },
      { src: "/portfolio/banners-departamentos.webp", largura: 2880, altura: 1800, legenda: "Os banners de departamento saem da mesma tela." },
      { src: "/portfolio/banners-peca-acougue.webp", largura: 2256, altura: 382, legenda: "Banner de departamento gerado pela ferramenta." },
    ],
  },
  {
    slug: "hub-nada-studio",
    num: "10",
    nome: "Hub NADA Studio",
    subtitulo: "Sistema de gestão do estúdio",
    tipo: "interno",
    entrega: "Sistema",
    chamada: "A operação inteira num lugar só.",
    identifica: "meus clientes também estão em planilha espalhada",
    capa: filme("hub"), // o painel, o quadro de produção e o funil (nomes borrados)
    antes: "Cliente em planilha espalhada, follow-up esquecido.",
    problema: "Proposta refeita do zero toda semana.",
    depois:
      "Um painel só, com o funil, o acompanhamento dos projetos e a proposta saindo pronta em PDF.",
    resultado:
      "A operação inteira num lugar só, e nada mais depende de alguém lembrar.",
    galeria: [
      { src: "/portfolio/hub.jpg", largura: 2304, altura: 1848, legenda: "O painel: produção, funil e metas na mesma tela." },
    ],
  },
  // ── Ferramentas do Hub: cada uma é um projeto, porque quem chega pode querer
  // só uma delas. O texto descreve o que a tela faz hoje, sem número.
  {
    slug: "prospeccao-ativa",
    num: "11",
    nome: "Prospecção ativa",
    subtitulo: "Busca de cliente novo por nicho e cidade",
    tipo: "interno",
    entrega: "Ferramenta do Hub",
    parteDe: "hub-nada-studio",
    chamada: "A lista de empresas e a primeira mensagem saem prontas.",
    identifica: "também procuro cliente novo abrindo empresa por empresa",
    capa: filme("prospeccao-ativa"), // a busca (abordagem, nicho, região) e o relatório, com números borrados
    antes:
      "Procurar cliente novo era abrir o Google Maps, olhar empresa por empresa e escrever quase a mesma mensagem pra cada uma.",
    problema: "Tomava a tarde inteira, e a mensagem saía igual pra todo mundo.",
    depois:
      "Você escolhe o que quer oferecer, o nicho e a cidade. A ferramenta lista as empresas, mostra o que falta em cada uma (não tem site, tem pouca avaliação no Google, atende tudo na mão) e monta a primeira mensagem em cima disso. O envio sai aos poucos, com intervalo entre uma e outra, e cada empresa abordada já entra no funil.",
    resultado: "A abordagem sai escrita pra cada empresa, e ninguém monta uma por uma.",
  },
  {
    slug: "funil-de-clientes",
    num: "12",
    nome: "Funil de clientes",
    subtitulo: "Do primeiro contato ao cliente fechado",
    tipo: "interno",
    entrega: "Ferramenta do Hub",
    parteDe: "hub-nada-studio",
    chamada: "Ninguém fica esquecido no meio do caminho.",
    identifica: "também perco cliente porque esqueço de voltar a falar",
    capa: filme("funil-de-clientes"), // as colunas do funil e a lista de contatos (tudo que identifica alguém, borrado)
    antes: "Contato novo ficava no WhatsApp, na cabeça e numa planilha que ninguém atualizava.",
    problema: "Passava uma semana e ninguém lembrava de voltar a falar com quem tinha pedido orçamento.",
    depois:
      "Cada contato vira um cartão que anda de coluna: prospect, em contato, proposta, cliente. As etiquetas dizem quem pediu orçamento e quem é pra retomar depois. Quando o retorno atrasa, o cartão avisa. E a conversa do WhatsApp entra sem ninguém digitar de novo.",
    resultado: "Dá pra ver numa tela só com quem falar hoje.",
  },
  {
    slug: "assistente-do-hub",
    num: "13",
    nome: "Assistente do Hub",
    subtitulo: "Você pede, ele lança",
    tipo: "interno",
    entrega: "Ferramenta do Hub",
    parteDe: "hub-nada-studio",
    chamada: "Você fala o que precisa e o cartão aparece no lugar certo.",
    identifica: "também deixo de registrar as coisas porque dá trabalho",
    capa: filme("assistente-do-hub"), // o painel abrindo e um pedido sendo escrito
    antes: "Pra registrar qualquer coisa era abrir a tela certa, achar o botão e preencher campo por campo.",
    problema: "No meio do dia ninguém parava pra isso, e a coisa ficava sem registro.",
    depois:
      "Você escreve ou fala do jeito que falaria com um colega: “cria um cartão de vídeo pra campanha”, “o que está atrasado no financeiro?”. Ele cria, move e edita os cartões e lança no financeiro. Antes de mudar qualquer coisa, mostra o que vai fazer e espera você confirmar.",
    resultado: "Registrar deixou de ser uma tarefa à parte.",
  },
  {
    slug: "producao-de-conteudo",
    num: "14",
    nome: "Produção de conteúdo",
    subtitulo: "Da ideia ao vídeo publicado",
    tipo: "interno",
    entrega: "Ferramenta do Hub",
    parteDe: "hub-nada-studio",
    chamada: "Cada vídeo com a etapa à vista, da ideia ao publicado.",
    identifica: "minhas ideias de conteúdo também se perdem no bloco de notas",
    capa: filme("producao-de-conteudo"), // o quadro deslizando até "Publicado" e o calendário
    antes: "Ideia de vídeo ficava no bloco de notas, o roteiro num arquivo e a data de postar na cabeça.",
    problema: "Ninguém sabia o que estava gravado, o que faltava editar e o que já tinha saído.",
    depois:
      "Cada conteúdo é um cartão que anda por seis etapas: ideia, roteiro, gravação, edição, aprovação e publicado. O que depende de um ok fica marcado pra quem aprova. E o calendário mostra o que sai em cada dia.",
    resultado: "Abre o quadro e vê o que tem pra gravar, editar e postar na semana.",
  },
  {
    slug: "projetos-e-tarefas",
    num: "15",
    nome: "Projetos e tarefas",
    subtitulo: "Em que pé está cada projeto",
    tipo: "interno",
    entrega: "Ferramenta do Hub",
    parteDe: "hub-nada-studio",
    chamada: "Todo projeto com a etapa à vista, do pedido à entrega.",
    identifica: "também não sei em que pé está cada projeto sem perguntar",
    capa: filme("projetos-e-tarefas"), // o quadro e os filtros por tipo (títulos borrados)
    antes: "Pra saber em que pé estava um projeto, era perguntar no grupo.",
    problema: "Tarefa pequena sumia entre uma conversa e outra, e a entrega atrasava sem ninguém ver.",
    depois:
      "Cada projeto é um cartão que anda do pendente ao entregue, passando por revisão e aprovação. Dá pra filtrar o que é de cliente, o que é interno e o que é melhoria. As tarefas ficam dentro do projeto delas.",
    resultado: "Uma tela mostra o que está parado e em que etapa.",
  },
  {
    // Código aberto (Apache 2.0). O texto segue o README do projeto: gravação,
    // transcrição local, histórico e agendamento. Resumo automático ainda não
    // existe lá, então não é prometido aqui.
    slug: "transcricao-de-reunioes",
    num: "16",
    nome: "Transcrição de Reuniões",
    subtitulo: "Reunião gravada e transcrita no próprio computador",
    tipo: "interno",
    entrega: "Ferramenta de código aberto",
    chamada: "Abre e acha, buscando por qualquer palavra.",
    identifica: "minhas reuniões também ficam gravadas e ninguém revê",
    capa: { tipo: "cena", cena: "transcricao" },
    antes: "Reunião ficava gravada em áudio e ninguém revia.",
    problema:
      "A informação existia, mas achar dava mais trabalho que perguntar de novo.",
    depois:
      "A ferramenta roda no seu computador. Grava o que os outros falam e o seu microfone ao mesmo tempo, transcreve ali mesmo e guarda tudo num histórico que dá pra buscar. Dá pra deixar agendado: a reunião de toda segunda começa a gravar sozinha. Nenhum áudio sai da máquina.",
    resultado: "Abre e acha, buscando por qualquer palavra.",
    link: "https://github.com/HSHAKOA/Agente-de-transcrito-de-reuni-es-",
    linkLabel: "Ver o código",
    selo: { rotulo: "Grátis", texto: "Qualquer um pode pegar e usar." },
    cta: {
      texto: "É grátis e de código aberto. É só pedir que a gente manda.",
      botao: "Quero receber a ferramenta",
      mensagem: "Oi! Vi a ferramenta de transcrição de reuniões no site da NADA Studio e quero receber pra usar.",
    },
  },
  {
    slug: "no-azul",
    num: "17",
    nome: "No Azul",
    subtitulo: "Controle de entrada e saída de despesas",
    tipo: "interno",
    entrega: "App",
    chamada: "8 horas por mês viraram 10 minutos.",
    identifica: "também só descubro que estourei o mês quando já é tarde",
    capa: { tipo: "numero", metrica: "8h → 10min" },
    antes:
      "Duas horas todo sábado batendo fatura com extrato, lançando gasto na mão.",
    problema: "Descobria que tinha estourado o mês quando já era tarde.",
    depois:
      "Feito pra usar todo dia: o que entrou e o que saiu, sem montar planilha. O gasto entra e se categoriza sozinho, e um aviso chega no WhatsApp antes de estourar.",
    resultado: "8 horas por mês viraram 10 minutos.",
    metrica: { valor: "8 h → 10 min", legenda: "por mês, só pra saber onde o dinheiro foi" },
  },
  {
    // Programa de computador (janela), feito pelo Eric. A capa é montada com
    // capturas reais de uma busca (ver scripts/gravar-capa.mjs). As fotos dos
    // cartões são resultado da busca de imagens, de terceiros.
    slug: "imagens-para-ecommerce",
    num: "18",
    nome: "Imagens E-commerce",
    subtitulo: "Foto de produto com fundo branco, pronta pra loja virtual",
    tipo: "interno",
    entrega: "Programa",
    chamada: "Digita o produto e a foto sai com fundo branco, no formato que a loja aceita.",
    identifica: "também perco tempo procurando e ajustando foto de produto",
    capa: filme("imagens-ecommerce"), // uma busca: produto digitado, os resultados chegando e a lista pronta
    antes:
      "Pra cadastrar produto numa loja virtual, a foto precisa estar em JPG ou PNG e, de preferência, com fundo branco.",
    problema:
      "A maioria das imagens que se acha na internet vem em WebP e com fundo. Pra cada produto era procurar, baixar, converter e recortar.",
    depois:
      "Você digita o nome do produto, banana ou picanha, e o programa busca as imagens com filtro de conteúdo adulto e mostra as opções lado a lado. Um clique baixa a escolhida já recortada, com fundo branco, na pasta que você definir. Dá pra passar uma lista de produtos e fazer tudo em lote.",
    resultado: "A foto do produto sai pronta pra subir na loja, sem abrir editor de imagem.",
    galeria: [
      { src: "/portfolio/imagens-ecommerce-busca.webp", largura: 1280, altura: 800, legenda: "É só digitar o produto. A busca já sai com filtro de conteúdo adulto." },
      { src: "/portfolio/imagens-ecommerce-resultados.webp", largura: 1280, altura: 800, legenda: "As opções lado a lado, cada uma com o botão que baixa a foto com fundo branco." },
    ],
  },
  {
    // Automação da NADA Studio: uma rotina agendada escreve o jornal e o n8n
    // entrega no grupo pela Evolution API. Não tem tela pra filmar: capa em
    // cena. O "antes" e o "problema" esperam a confirmação do Eric.
    slug: "jornal-do-dia",
    num: "19",
    nome: "Jornal do Dia",
    subtitulo: "As notícias do dia no grupo do WhatsApp, toda manhã",
    tipo: "interno",
    entrega: "Automação",
    chamada: "Toda manhã, o resumo das notícias chega pronto no grupo.",
    identifica: "também quero me atualizar sem abrir dez sites toda manhã",
    capa: { tipo: "cena", cena: "jornal" },
    antes: "Pra acompanhar o que mudou no mundo e em inteligência artificial, era abrir site por site, todo dia.",
    problema: "Tomava tempo, e a mesma notícia aparecia repetida de um dia pro outro.",
    depois:
      "Uma rotina agendada pesquisa as notícias da manhã, escolhe até sete e escreve o resumo de cada uma, com a fonte. O n8n recebe o texto, confere se veio no formato combinado e manda pro grupo pela Evolution API. São duas edições por dia: uma do mundo, outra de inteligência artificial. Cada notícia enviada entra num histórico, e a rotina consulta esse histórico pra não repetir. Se o texto chega fora do formato, a mensagem não sai: jornal atrasado é melhor que jornal errado.",
    resultado: "De manhã, o grupo abre o WhatsApp e o jornal já está lá.",
  },
];

// Home: três naturezas diferentes (site, sistema, físico-digital).
export const DESTAQUES_HOME = ["ana-marocci", "torre-de-controle", "espaco-gc-style"];

export const PORTFOLIO_HEADER = {
  marcador: "Portfólio",
  titulo: "O que a gente já construiu.",
  subtitulo:
    "Trabalho de cliente e solução que nasceu aqui dentro. Em cada um, o problema e o que mudou.",
};

// Projetos internos não são "ferramenta interna": nasceram pra resolver
// problema da NADA e podem virar solução pro negócio de quem lê.
export const GRUPOS: Record<TipoProjeto, { marcador: string; titulo: string; texto?: string }> = {
  cliente: { marcador: "Clientes", titulo: "Feito pra quem confiou na gente." },
  interno: {
    marcador: "É nosso",
    titulo: "É nosso. Pode ser seu.",
    texto:
      "Nasceu pra resolver um problema da NADA Studio e roda aqui todo dia. A mesma solução pode ser adaptada pro seu negócio.",
  },
};

export function projetoPorSlug(slug: string) {
  return PROJETOS.find((p) => p.slug === slug);
}
