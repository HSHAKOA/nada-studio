---
name: checklist-site-no-ar
description: Audita um site que acabou de entrar no ar (ou já está no ar) contra a checklist de 10 requisitos técnicos de SEO e indexação, e devolve nota, o que falta e o prompt de correção. SEMPRE use esta skill quando o usuário pedir para checar, auditar, revisar ou "passar o pente fino" num site, perguntar se o site está pronto pra subir, se está indexado, se o Google acha, se tem sitemap/robots/llms.txt/Search Console/Analytics, se o site está lento, ou quando ele mandar uma URL pedindo diagnóstico técnico. Ative também quando ele entregar um site pra cliente e quiser conferir se não esqueceu nada, ou quando disser "checklist do site", "o site tá redondo?", "subi o site, e agora?", "audita esse site pra mim".
---

# Checklist de site no ar

## Para que serve

Site publicado não é site funcionando. A página pode estar linda e o Google
não saber que ela existe, a IA não conseguir ler, o celular demorar 6
segundos pra pintar o primeiro pixel e ninguém nunca descobrir o negócio.

Esta skill roda uma auditoria fechada de 10 itens, dá uma nota honesta e
devolve o que falta em dois blocos separados: o que resolve com código e o
que só o dono resolve fora do repositório.

Uso duplo: auditar os próprios sites da NADA e auditar site de cliente
antes da entrega. Se for entrega de cliente, a auditoria vira também o
argumento de venda da mensalidade, porque mostra tudo que precisa de
manutenção contínua.

## Antes de começar: descobrir o modo

Existem dois modos de auditoria. Escolha pelo que estiver disponível, sem
perguntar se der pra deduzir.

**Modo repositório** (preferido): existe acesso ao código do projeto.
Consegue verificar tudo com certeza, inclusive o que não aparece no HTML
final. Use quando estiver rodando no terminal ou quando os arquivos do
projeto estiverem no contexto.

**Modo externo**: só existe a URL. Verifique buscando as páginas
diretamente (`/robots.txt`, `/sitemap.xml`, `/llms.txt`) e lendo o HTML da
home. Alguns itens ficam sem resposta definitiva por serem de conta
externa. Marque esses como "não dá pra confirmar de fora" em vez de chutar.

Nunca invente resultado. Item não verificado é pior que item reprovado,
porque item reprovado o dono conserta e item inventado passa batido.

## Os 10 itens

Verifique nesta ordem. A ordem é de impacto, não de dificuldade.

### 1. Velocidade
O item mais pesado da lista. Site lento derruba todos os outros nove.

- Modo repositório: rodar o build e olhar o tamanho do bundle inicial.
  Procurar biblioteca pesada carregada de forma síncrona na primeira tela
  (Three.js, mapa, player de vídeo, carrossel de imagem sem lazy).
  Verificar se as imagens usam formato moderno e dimensão declarada.
- Modo externo: instruir o dono a rodar `pagespeed.web.dev` na aba mobile e
  trazer o número. Sem esse dado, marque como pendente.
- Reprova se: LCP acima de 2.5s no mobile. Alerta vermelho acima de 4s.

### 2. Google Search Console
Sem isso o dono está cego. Não sabe se o Google indexou, quais buscas
trazem gente nem quais páginas deram erro.

- Verificação: existe a meta tag de verificação no HTML ou o registro TXT
  no DNS. No modo externo, quase sempre precisa perguntar.
- Reprova se: não existe propriedade criada ou o sitemap nunca foi
  submetido.

### 3. Google Meu Negócio
Só se aplica a negócio com atendimento local ou regional. Para produto
100% digital sem recorte geográfico, marque como não aplicável em vez de
reprovar.

- Verificação: buscar o nome do negócio mais a cidade e ver se o painel
  lateral aparece.
- Reprova se: negócio local sem perfil, ou perfil sem verificação, ou
  perfil com dado divergente do site (telefone, endereço, horário).

### 4. sitemap.xml
- Verificação: buscar `/sitemap.xml`. Conferir se lista todas as rotas
  públicas reais, se as URLs usam o domínio final (não o subdomínio de
  preview da hospedagem) e se não lista página que devia ficar fora.
- Reprova se: não existe, retorna 404, está desatualizado ou aponta pro
  domínio errado.

### 5. robots.txt
- Verificação: buscar `/robots.txt`. Conferir se não está bloqueando o
  site inteiro por engano (herança de ambiente de staging é o erro mais
  comum) e se aponta pro sitemap.
- Reprova se: não existe, ou contém `Disallow: /` em produção, ou não
  referencia o sitemap.

### 6. Títulos e meta descriptions
- Verificação: cada rota pública precisa do seu próprio title e
  description. Página herdando o metadata da home é falha silenciosa.
  Conferir também `og:url` e canonical apontando pro domínio de produção,
  porque projeto migrado de preview costuma manter a URL antiga da
  hospedagem e canoniza tudo no lugar errado.
- Reprova se: alguma rota herda metadata, ou title passa de 60 caracteres,
  ou description passa de 155, ou canonical aponta pra fora do domínio.

### 7. Palavra-chave do negócio
- Verificação: a palavra que o cliente digitaria no Google precisa existir
  em texto indexável de verdade (title, H1, H2, parágrafo). Meta keywords
  não conta, o Google ignora desde 2009. Se o negócio for local, a cidade
  precisa aparecer em algum lugar do conteúdo.
- Reprova se: a palavra-chave só existe em meta keywords, ou o site inteiro
  usa linguagem de marca sem nunca nomear o serviço, ou negócio local sem
  nenhuma menção de cidade.

### 8. llms.txt
Arquivo em markdown na raiz que resume o site pra modelo de linguagem ler.
Padrão novo, adoção crescente, custo perto de zero.

- Verificação: buscar `/llms.txt`.
- Reprova se: não existe. Se existir, conferir se descreve serviço,
  atendimento e contato, e se os links estão vivos.

### 9. Analytics
- Verificação: procurar o script no HTML. Vercel Analytics, Google
  Analytics, Plausible, Umami, qualquer um serve.
- Reprova se: nenhum. Anote se o escolhido exige banner de cookie por LGPD,
  porque isso muda o peso da decisão.

### 10. Domínio personalizado
- Verificação: o site responde no domínio próprio, com HTTPS válido, e o
  subdomínio da hospedagem redireciona pro domínio final em vez de servir
  cópia duplicada.
- Reprova se: ainda no domínio da hospedagem, ou certificado inválido, ou
  as duas versões respondem 200 e criam conteúdo duplicado.

## Formato da resposta

Sempre nesta estrutura, sem enfeite.

### Nota
`X de 10` na primeira linha. Se algum item for não aplicável, use
`X de 9 aplicáveis` e diga qual saiu.

### Tabela
Uma linha por item, três colunas: item, status, observação de uma linha.
Status usa só três valores: `ok`, `falta`, `não dá pra confirmar de fora`.

### O que resolve com código
Bloco de prompt pronto pra colar no terminal, com as correções específicas
desse site. Inclua caminho de arquivo real quando estiver no modo
repositório. Termine o prompt com as regras de copy da NADA e com pedido de
build e type-check.

### O que só o dono resolve
Lista numerada das ações de conta externa (Search Console, Meu Negócio,
PageSpeed), cada uma com onde fazer e quanto tempo leva. Sinalize as que
demoram por verificação de terceiro, porque essas precisam começar antes.

### O item que dói mais
Um parágrafo curto apontando qual falha tem o maior custo real nesse site
específico e por quê. Um só. Se apontar cinco prioridades, não apontou
nenhuma.

## Regras

- Nota honesta. Se der 2 de 10, escreva 2 de 10. Auditoria que passa a mão
  não serve pra nada e some com a confiança do diagnóstico seguinte.
- Não sugira reescrever o site. A skill conserta o que falta, não troca a
  stack nem redesenha nada.
- Item de conta externa nunca vira tarefa de código. Não invente meta tag
  de verificação sem ter o código real na mão.
- Copy que a skill escrever segue as regras da NADA: sem travessão, sem
  construção "não é X, é Y", sem emoji, sem linguagem genérica de agência,
  português brasileiro falado.
- Se a auditoria for de site de cliente, feche com uma linha sobre quais
  desses itens precisam de acompanhamento contínuo, porque é isso que
  justifica a mensalidade.
