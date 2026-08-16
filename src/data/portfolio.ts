import { buildWhatsAppLink } from "@/data/content";

export type TipoProjeto = "cliente" | "produto" | "interno";

export type Projeto = {
  id: string;
  num: string;
  nome: string;
  subtitulo: string;
  tipo: TipoProjeto;
  tags: string[];
  imagem: string;
  imagemPos?: string;
  problema: string;
  solucao: string;
  resultado?: string;
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
    subtitulo: "Site & Triagem para Psicologia",
    tipo: "cliente",
    tags: ["Next.js", "WhatsApp API", "Triagem de Leads", "SEO"],
    imagem: "/portfolio/thayana.webp",
    imagemPos: "center 10%",
    problema:
      "Paciente nova chegava por indicação e caía direto no WhatsApp, sem contexto nenhum. Ela abria a conversa sem saber quem era a pessoa nem o que estava buscando, gastando a primeira meia hora perguntando o básico.",
    solucao:
      "Um site institucional com design acolhedor e um formulário curto antes da conversa. A pessoa responde no tempo dela e só segue pro WhatsApp se quiser continuar. A psicóloga é avisada na hora com o perfil completo do paciente.",
    resultado:
      "Abre as conversas já sabendo exatamente o que o paciente busca, economizando horas de triagem.",
    link: "https://thayanadeoliveira.com.br",
    linkLabel: "Ver site no ar",
  },
  {
    id: "vitrine",
    num: "02",
    nome: "VITRINE 01",
    subtitulo: "E-commerce & Catálogo Esportivo",
    tipo: "produto",
    tags: ["E-commerce", "Personalizador 3D", "WhatsApp Checkout", "Next.js"],
    imagem: "/portfolio/vitrine-01.jpg",
    problema:
      "Lojas de artigo esportivo vendem por marketplaces, pagam até 20% de comissão por venda e perdem o contato direto com o cliente.",
    solucao:
      "Plataforma de catálogo própria com personalizador de uniforme (nome e número ao vivo) e pedido fechado direto no WhatsApp do vendedor.",
    resultado: "Venda direta sem intermediários com margem 100% retida na loja.",
    link: buildWhatsAppLink("Oi! Quero ver a demonstração da VITRINE 01."),
    linkLabel: "Solicitar demonstração",
  },
  {
    id: "hub",
    num: "03",
    nome: "Hub NADA Studio",
    subtitulo: "Sistema Interno de Gestão & CRM",
    tipo: "interno",
    tags: ["Next.js", "Supabase", "n8n", "Propostas Automáticas"],
    imagem: "/portfolio/hub.jpg",
    problema:
      "Controle de leads em planilhas dispersas, follow-ups esquecidos e propostas comerciais refeitas do zero toda semana.",
    solucao:
      "Painel unificado com funil de vendas, acompanhamento de projetos em tempo real e geração automática de propostas comerciais em PDF.",
    resultado: "Processo comercial 100% centralizado e tempo de resposta ao cliente reduzido para minutos.",
  },
  {
    id: "barcode",
    num: "04",
    nome: "Leitor & Controle de Estoque",
    subtitulo: "Automação Operacional",
    tipo: "interno",
    tags: ["Python", "Automação de Estoque", "Hardware / Scanner", "Postgres"],
    imagem:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=900&auto=format&fit=crop&q=80",
    problema:
      "Entrada e saída de matéria-prima anotada na mão em prancheta. Papel se perdia, contagem no fim do mês nunca batia.",
    solucao:
      "Um bip no scanner registra a peça instantaneamente. Estoque atualizado no banco em tempo real sem ninguém precisar digitar nada.",
    resultado: "Zero divergência no balanço e conferência 10x mais rápida.",
    tecnica: "Desenvolvido em Python com integração a banco relacional.",
  },
  {
    id: "transcricao",
    num: "05",
    nome: "Transcrição & Resumo de Reuniões",
    subtitulo: "Inteligência Artificial & Whisper",
    tipo: "interno",
    tags: ["IA / OpenAI Whisper", "n8n", "Busca Semântica", "Automação"],
    imagem:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=900&auto=format&fit=crop&q=80",
    problema:
      "Reuniões de alinhamento ficavam gravadas em áudios gigantes que ninguém tinha tempo de ouvir novamente. Decisões importantes se perdiam no histórico.",
    solucao:
      "Pipeline automatizado: assim que a gravação termina, a IA transcreve, gera um resumo executivo com os combinados e envia no canal da equipe.",
    resultado: "Atas de reunião instantâneas e buscáveis por qualquer palavra-chave.",
  },
  {
    id: "noazul",
    num: "06",
    nome: "No Azul",
    subtitulo: "Gestão Financeira Automatizada",
    tipo: "interno",
    tags: ["n8n", "Open Finance", "Alertas WhatsApp", "Dashboard"],
    imagem:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=900&auto=format&fit=crop&q=80",
    problema:
      "Duas horas todo sábado batendo fatura com extrato, lançando despesas na mão em planilhas que ficavam desatualizadas.",
    solucao:
      "Fluxo de integração automática: cada gasto é categorizado e consolidado sozinho. O sistema gera alertas no WhatsApp antes de estourar orçamentos.",
    resultado: "8 horas por mês de trabalho manual viraram apenas 10 minutos.",
  },
];

export const PORTFOLIO_HEADER = {
  marcador: "Portfólio",
  num: "001",
  titulo: "O que a gente já construiu.",
  subtitulo:
    "Trabalhos sob medida para clientes, produtos próprios e ferramentas que construímos para resolver problemas reais.",
};
