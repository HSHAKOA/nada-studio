# NADA Studio

Site institucional da NADA Studio, empresa de tecnologia de Jundiaí-SP que desenvolve sites, automações e aplicações sob medida para pequenos negócios e profissionais autônomos.

[Visitar o site](https://www.nadastudio.com.br)

## Objetivo

Apresentar os serviços da NADA Studio de forma clara, conduzir potenciais clientes até o contato e demonstrar como tecnologia pode reduzir tarefas manuais e organizar operações.

## Funcionalidades

- Página institucional responsiva
- Apresentação de serviços e planos
- Seções de problema, transformação e portfólio
- Chamadas para ação e contato
- Navegação com rolagem suave
- Animações e transições de interface
- Metadados para SEO e compartilhamento social
- Dados estruturados para organização, serviços e perguntas frequentes
- Google Analytics, Vercel Analytics e Speed Insights

## Tecnologias

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- GSAP
- Lenis
- Lucide React
- Vercel Analytics e Speed Insights

## Arquitetura

A aplicação utiliza o App Router do Next.js. A página principal é composta por seções independentes em `src/components`, enquanto os textos e perguntas frequentes ficam centralizados em `src/data`. Os metadados, dados estruturados e integrações de análise são configurados no layout raiz.

```text
src/
├── app/          # rotas, layout, metadados e estilos globais
├── components/   # navegação, seções e componentes visuais
└── data/         # conteúdo estruturado do site
```

## Como executar localmente

Requisitos:

- Node.js compatível com Next.js 16
- npm

```bash
git clone https://github.com/HSHAKOA/nada-studio.git
cd nada-studio
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Verificações de qualidade

```bash
npm run lint
npm run build
```

O repositório ainda não possui uma suíte automatizada de testes. Lint e build devem ser executados antes de publicar alterações.

## Publicação

O projeto possui script de build e publicação para Cloudflare Pages:

```bash
npm run deploy
```

A publicação depende de autenticação e configuração válidas do Wrangler. Não armazene tokens ou credenciais no repositório.

## Status

Site institucional ativo e em evolução. O repositório público documenta a implementação do site; projetos de clientes e sistemas internos não são expostos aqui.

## NADA Studio

A NADA Studio cria soluções digitais com foco em uso real: sites, automações e aplicações que ajudam pequenos negócios a reduzir trabalho repetitivo e organizar sua operação.
