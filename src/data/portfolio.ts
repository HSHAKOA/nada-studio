export type TipoProjeto = "cliente" | "produto" | "interno";

// Cada projeto é contado em quatro blocos: antes, problema, depois, resultado.
// Cena concreta em cada um, nunca resumo abstrato.
export type Projeto = {
  id: string;
  num: string;
  nome: string;
  subtitulo: string;
  tipo: TipoProjeto;
  tags: string[];
  imagem: string;
  imagemPos?: string;
  antes: string;
  problema: string;
  depois: string;
  resultado: string;
  tecnica?: string;
  link?: string;
  linkLabel?: string;
  galeria?: { src: string; largura: number; altura: number; legenda: string }[];
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
    subtitulo: "Site e triagem para psicóloga",
    tipo: "cliente",
    tags: ["Next.js", "WhatsApp API", "Triagem de paciente", "SEO"],
    imagem: "/portfolio/thayana.webp",
    imagemPos: "center 10%",
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
  },
  {
    id: "mileide",
    num: "02",
    nome: "Mileide Rodrigues",
    subtitulo: "Site e anúncio para psicanalista",
    tipo: "cliente",
    tags: ["Next.js", "Meta Ads", "Anúncio pro WhatsApp", "SEO"],
    imagem: "/portfolio/mileide.jpg",
    imagemPos: "center 25%",
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
  },
  {
    id: "gcstyle",
    num: "03",
    nome: "Espaço GC Style",
    subtitulo: "Catálogo digital e banner de balcão",
    tipo: "cliente",
    tags: ["Catálogo digital", "Banner impresso", "NFC + QR Code", "Pedido no WhatsApp"],
    imagem: "/portfolio/gcstyle-banner.webp",
    imagemPos: "center 55%",
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
      { src: "/portfolio/gcstyle.webp", largura: 1440, altura: 900, legenda: "O catálogo: o balcão é só uma amostra." },
      { src: "/portfolio/gcstyle-catalogo.webp", largura: 1240, altura: 840, legenda: "Busca por marca, grife de inspiração ou família olfativa." },
      { src: "/portfolio/gcstyle-vip.webp", largura: 1240, altura: 370, legenda: "Grupo VIP no WhatsApp pra avisar de lote novo." },
      { src: "/portfolio/gcstyle-mobile.webp", largura: 600, altura: 1298, legenda: "Feito pra abrir no celular, na cadeira do corte." },
    ],
  },
  {
    id: "hub",
    num: "04",
    nome: "Hub NADA Studio",
    subtitulo: "Sistema interno de gestão",
    tipo: "interno",
    tags: ["Next.js", "Supabase", "n8n", "Proposta em PDF"],
    imagem: "/portfolio/hub.jpg",
    antes: "Cliente em planilha espalhada, follow-up esquecido.",
    problema: "Proposta refeita do zero toda semana.",
    depois:
      "Um painel só, com o funil, o acompanhamento dos projetos e a proposta saindo pronta em PDF.",
    resultado:
      "A operação inteira num lugar só, e nada mais depende de alguém lembrar.",
  },
  {
    id: "torre",
    num: "05",
    nome: "Torre de Controle",
    subtitulo: "Busca de vaga no automático",
    tipo: "interno",
    tags: ["n8n", "IA", "Triagem de vagas", "Currículo sob medida"],
    imagem: "/portfolio/torre.webp",
    imagemPos: "left top",
    antes:
      "Procurar vaga era abrir o LinkedIn todo dia, ler descrição por descrição e reescrever o currículo pra cada uma.",
    problema:
      "A vaga boa se perdia no meio de centenas que não tinham nada a ver.",
    depois:
      "As vagas chegam por e-mail e o n8n puxa tudo pro painel. Uma triagem em duas camadas, regra fixa primeiro e IA depois, dá nota de 0 a 100 pra cada uma. Pra vaga que vale, o painel monta um dossiê com o currículo reescrito pra ela, usando só o que já existe no currículo real.",
    resultado:
      "De 248 vagas que entraram, 85 passaram na triagem e já chegaram com o currículo pronto.",
    tecnica:
      "Cinco workflows em n8n em produção, triagem com regras determinísticas e chamadas de LLM.",
    galeria: [
      { src: "/portfolio/torre-inicio.webp", largura: 1600, altura: 785, legenda: "Início: o que chegou, o que tem mais aderência e o que está em processo." },
      { src: "/portfolio/torre-dossie.webp", largura: 744, altura: 813, legenda: "Dossiê: currículo reescrito pra vaga, pronto pra conferir e enviar." },
    ],
  },
  {
    id: "barcode",
    num: "06",
    nome: "Leitor & Controle de Estoque",
    subtitulo: "Controle de estoque",
    tipo: "interno",
    tags: ["Python", "Controle de estoque", "Scanner", "Postgres"],
    imagem:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=900&auto=format&fit=crop&q=80",
    antes: "Entrada e saída de matéria-prima anotada na mão, na prancheta.",
    problema: "Papel se perdia e a contagem do fim do mês nunca batia.",
    depois: "Um bip no scanner registra a peça.",
    resultado: "Estoque atualizado na hora, sem ninguém digitar nada.",
    tecnica: "Desenvolvido em Python, ligado direto no banco.",
  },
  {
    id: "transcricao",
    num: "07",
    nome: "Transcrição & Resumo de Reuniões",
    subtitulo: "Áudio de reunião virando texto",
    tipo: "interno",
    tags: ["OpenAI Whisper", "n8n", "Busca por palavra", "Resumo de reunião"],
    imagem:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=900&auto=format&fit=crop&q=80",
    antes: "Reunião ficava gravada em áudio e ninguém revia.",
    problema:
      "A informação existia, mas achar dava mais trabalho que perguntar de novo.",
    depois:
      "Quando a gravação termina, o áudio vira texto organizado e um resumo com os combinados cai no canal da equipe.",
    resultado: "Abre e acha, buscando por qualquer palavra.",
  },
  {
    id: "noazul",
    num: "08",
    nome: "No Azul",
    subtitulo: "Controle financeiro",
    tipo: "interno",
    tags: ["n8n", "Open Finance", "Aviso no WhatsApp", "Painel"],
    imagem:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=900&auto=format&fit=crop&q=80",
    antes:
      "Duas horas todo sábado batendo fatura com extrato, lançando gasto na mão.",
    problema: "Descobria que tinha estourado o mês quando já era tarde.",
    depois:
      "O gasto entra e se categoriza sozinho, e um aviso chega no WhatsApp antes de estourar.",
    resultado: "8 horas por mês viraram 10 minutos.",
  },
];

export const PORTFOLIO_HEADER = {
  marcador: "Portfólio",
  num: "001",
  titulo: "O que a gente já construiu.",
  subtitulo:
    "Trabalho de cliente, produto próprio e ferramenta que a gente fez porque precisava.",
};
