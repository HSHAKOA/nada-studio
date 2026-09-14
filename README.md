# NADA Studio

Site institucional e portfólio da NADA Studio, empresa de tecnologia de Jundiaí-SP que desenvolve sites, sistemas e automações para pequenos negócios.

O projeto apresenta os serviços, o processo de trabalho e projetos da empresa em uma experiência responsiva construída com Next.js e exportada como site estático.

## Demonstração

**Site público:** [www.nadastudio.com.br](https://www.nadastudio.com.br)

## Problema resolvido

Pequenos negócios frequentemente dependem de processos manuais para divulgar serviços, responder clientes, organizar informações e executar tarefas repetitivas. O site precisava explicar esses problemas de forma direta, demonstrar o tipo de solução entregue pela NADA Studio e oferecer um caminho simples para iniciar uma conversa.

## Solução

A aplicação organiza a apresentação comercial da NADA Studio em páginas e seções orientadas aos problemas do público. O conteúdo conecta sites, automação e sistemas sob medida a situações operacionais concretas, com navegação responsiva, portfólio, informações sobre o processo de trabalho e chamadas para contato.

## Funcionalidades

- Página inicial com apresentação, áreas de atuação e formatos de projeto
- Portfólio com descrição dos trabalhos publicados pela empresa
- Páginas institucionais sobre a empresa, equipe e processo de trabalho
- Perguntas frequentes
- Chamadas para contato por WhatsApp
- Páginas de termos de uso e política de privacidade
- Metadados para SEO e compartilhamento social
- Sitemap e regras de indexação
- Analytics e métricas de desempenho do frontend
- Animações com tratamento para preferência de movimento reduzido
- Layout responsivo para dispositivos móveis e desktop

## Arquitetura

O projeto utiliza o App Router do Next.js. As páginas ficam em `src/app`, os componentes reutilizáveis em `src/components` e o conteúdo estruturado em `src/data`.

A configuração `output: "export"` gera uma versão estática do site. As imagens são servidas sem a otimização dinâmica do Next.js para manter compatibilidade com esse modelo de publicação.

O projeto não possui backend próprio, banco de dados ou autenticação. Os contatos externos são iniciados por links e as páginas públicas são geradas a partir do conteúdo versionado no repositório.

## Tecnologias

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- GSAP
- Lenis
- Lucide React e React Icons
- Vercel Analytics e Speed Insights

## Segurança e privacidade

- O site é uma aplicação pública e estática, sem área autenticada.
- Não existem credenciais necessárias para executar a versão local documentada.
- Termos de uso e política de privacidade fazem parte da aplicação.
- Links externos são usados para contato e redes sociais.
- Informações sensíveis não devem ser adicionadas ao código ou ao histórico Git.

## Como executar localmente

### Requisitos

- Node.js 20 ou superior
- npm

### Instalação

```bash
git clone https://github.com/HSHAKOA/nada-studio.git
cd nada-studio
npm ci
npm run dev
```

Acesse `http://localhost:3000`.

## Comandos disponíveis

```bash
npm run dev      # ambiente de desenvolvimento
npm run lint     # análise estática
npm run build    # build de produção e exportação estática
npm run start    # servidor Next.js
npm run deploy   # build e publicação pelo Wrangler
```

O comando de deploy requer configuração externa apropriada e não é necessário para executar ou validar o projeto localmente.

## Testes e qualidade

O projeto possui scripts de lint e build. Não há suíte de testes automatizados versionada nem workflow de integração contínua configurado no GitHub.

Antes de publicar alterações:

```bash
npm run lint
npm run build
```

## Estrutura do projeto

```text
public/              arquivos estáticos
src/
  app/               páginas, metadata, sitemap e robots
  components/        componentes de interface e comportamento
  data/              conteúdo estruturado do site
eslint.config.mjs    configuração do ESLint
next.config.ts       exportação estática e imagens
package.json         scripts e dependências
tsconfig.json        configuração do TypeScript
```

## Status

Site institucional em operação e acessível pelo domínio oficial.

## Limitações conhecidas

- Não possui backend, autenticação ou painel administrativo.
- O conteúdo é atualizado por alterações no código e nova publicação.
- Não há testes automatizados ou CI configurados no repositório.
- O endereço antigo `nada-studio.vercel.app` pode estar indisponível; utilize o domínio oficial.

## Licença

Este repositório não possui uma licença pública definida. O código permanece sob os direitos de seus autores e colaboradores.
