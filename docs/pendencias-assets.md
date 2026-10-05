# Pendências de asset

O código já está pronto para receber cada item abaixo. Nada foi inventado no lugar: onde falta material real, o site usa capa tipográfica ou deixa o slot vazio.

## Como entra cada asset

- **Imagem de projeto ou retrato:** salvar em `public/portfolio/` (projetos) ou `public/equipe/` (sócios) e rodar `node scripts/imagens.mjs`. O script gera as larguras 480, 960 e 1600 que o site serve. Recorte novo de capa entra em `RECORTES`, no próprio script.
- **Capa de projeto:** campo `capa` em `src/data/portfolio.ts`. A capa é a prévia do que o projeto tem de mais forte, nunca um print de página. Tipos: `filme` (o projeto em movimento, em tela cheia), `cena` (motion em código, pra projeto sem tela pra filmar), `recorte` (pedaço da interface real), `numero` (métrica em tipografia com faixa da interface), `foto` (foto real, o site converte para P&B) e `tipografica` (sem asset).
- **Capa em filme:** `node scripts/gravar-capa.mjs <projeto>` grava o site real quadro a quadro e gera o filme em pé (4:5), o largo (16:10, mais a versão de celular) e os pôsteres. Cada projeto tem um roteiro dentro do script (o que mostrar e em que ordem). Precisa do Chrome e do ffmpeg. Depois, `node scripts/imagens.mjs`.
- **Tela parada pra galeria:** celular a 390 px em 3x, computador a 1440 px em 2x, depois que a abertura do site termina. Salvar como `nome-site-celular.webp` e `nome-site.webp`.
- **Vídeo de capa:** campos `capa.video` e `capa.larga.video` (o pôster é o primeiro quadro). Toca sozinho, sem som, enquanto a capa está na tela; no celular, só a capa que está no meio da tela.
- **Peça da página Motion:** o bruto fica fora de `public/` (hoje, na raiz do projeto). Uma linha na tabela de `scripts/motion.mjs` gera, em `public/motion/`, a prévia muda do cartão, a versão de celular, a peça inteira com som e o pôster: `node scripts/motion.mjs` e depois `node scripts/imagens.mjs`. `--folha` monta uma folha de quadros pra escolher o trecho da prévia. A entrada vai em `MOTION_TRABALHOS` (`src/data/content.ts`), com a competência (grupo) e a origem: cliente, nosso, estudo autoral ou spec edit.

Regras que valem para todos: interface sempre real, nunca gerada por IA. Sem moldura de navegador nem aparelho de catálogo. Nenhum dado pessoal de paciente ou cliente final visível. A foto da cliente pode aparecer quando faz parte da tela do site dela.

## Lista

| # | Asset | Formato | Resolução / proporção | Onde entra | Enquadramento | Prioridade |
|---|---|---|---|---|---|---|
| 1 | Retrato do João | — | — | — | Feito: `public/equipe/joao.webp` (1280×1920), só em `/equipe`, em cor no quadro 9:16, aproximando com o scroll | Resolvido |
| 2 | Retrato do Eric | — | — | — | Feito: `public/equipe/eric.png` (1086×1448). O enquadramento é mais aberto que o do João e o rosto fica à direita do centro: o campo `posicao` põe o rosto no meio do quadro | Resolvido |
| 3 | Frase de cada sócio | — | — | — | Feito: campo `frase`, em duas metades, com entrada em duas batidas (`FraseSocio`) | Resolvido |
| 4 | Thayana: etapas da triagem | — | — | — | Feito: a capa é o filme da triagem (gravado do código rodando local, nada enviado) | Resolvido |
| 5 | Mileide: anúncio → conversa | PNG ou MP4 | 1080×1350 | Filme da capa + galeria do case | O criativo do anúncio publicado no Meta e a conversa aberta no WhatsApp com nome e número borrados. Com eles, o filme vira anúncio → site → conversa | Recomendado (a capa atual é o filme do site) |
| 6 | No Azul: tela real do app | PNG | 1440 px de largura ou mais | Faixa da capa `numero` (8h → 10min) + galeria | Painel com as categorias e o aviso de limite, de conta real, com os valores borrados | Obrigatório |
| 7 | Leitor de Estoque: leitura real | JPG (foto) ou vídeo curto | 3000 px no lado maior | Capa `foto` ou `filme` | O leitor lendo a etiqueta, se a empresa autorizar. Hoje a capa é um motion em código (código de barras e o movimento registrado) | Opcional |
| 8 | Transcrição: tela real | Gravação da interface | — | Capa `filme` + galeria | O projeto tem interface (painel e histórico). Dá pra gravar com `scripts/gravar-capa.mjs` rodando a ferramenta local, com um áudio de exemplo. Hoje a capa é um motion em código (onda virando texto) | Opcional |
| 9 | Ana Marocci: loop da abertura de marca | — | — | — | Feito: gravado do site no ar, é a capa do case e a peça na página Motion | Resolvido |
| 10 | Espaço GC Style: celular no banner | MP4 (vídeo de celular) | 5 a 8 s, 1080 px ou mais | Abertura do filme da capa | O celular encostando no banner do balcão e o catálogo abrindo. Hoje o filme abre com a arte do banner | Recomendado |
| 11 | Hub e Torre de Controle: sessão aberta | — | — | — | Feito: gravados numa janela separada do Chrome com o login do João, com nome de cliente, contato e valor borrados. Pra regravar, é preciso a sessão aberta de novo | Resolvido |
| 12 | Filmes de case | — | — | — | Feito pros seis projetos com tela real: Ana, Thayana, Mileide, GC Style, Torre e Hub (`scripts/gravar-capa.mjs`) | Resolvido |
| 13 | Rolo do portfólio | MP4 + WebM, sem áudio | 20 a 30 s; 1920×800 | Topo de `/portfolio` (ainda sem slot) | Montado com trechos dos filmes de case. Só faz sentido com pelo menos quatro filmes | Opcional |
| 14 | Número real por case de cliente | Texto | 1 valor + legenda | Campo `metrica` do projeto | Ex.: contatos recebidos no mês, tempo de resposta, pedidos pelo catálogo. Só número medido | Opcional |
| 15 | Depoimentos | Texto + nome + profissão | 1 a 2 frases | Ainda sem componente | Só com autorização por escrito | Opcional |
| 16 | Imagem de compartilhamento por case | PNG | 1200×630 | `openGraph.images` do case | Mesma composição da capa 16:10 | Opcional (hoje usa a imagem padrão do site) |
| 17 | Funções do Hub como projetos próprios | — | — | — | Feito: prospecção ativa, funil de clientes, assistente, produção de conteúdo e projetos e tarefas, cada um com página e filme. Financeiro e Operação ficaram de fora por decisão do João | Resolvido |
| 18 | Outras peças de vídeo e motion já feitas | — | — | — | Feito: anúncio do Hub, "Motion design é com a gente", "Só faltava o carro" e o logotipo em cortes, geradas por `scripts/motion.mjs`. A do logotipo veio a 11 quadros por segundo; se existir um export melhor, vale trocar. Peça nova entra pelo mesmo caminho, com o nome do cliente só se ele autorizou | Resolvido |
