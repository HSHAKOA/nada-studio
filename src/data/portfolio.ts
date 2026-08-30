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
    id: "hub",
    num: "03",
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
    id: "barcode",
    num: "04",
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
    num: "05",
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
    num: "06",
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
