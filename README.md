# JAX MADE 3D

Portfólio online de Jonatas Araújo, artista 3D com foco em modelagem, level design, cinematics e Unreal Engine.

## Desenvolvimento local

```bash
npm install
npm run dev
```

## Build de produção

```bash
npm run build
```

O resultado é gerado em `dist/` e pode ser publicado diretamente na Vercel.

## Estrutura e conteúdo

| Arquivo | O que tem |
|---|---|
| `src/copy.js` | **Todos os textos**, em português e inglês (interface, projetos, experiência, formação, ferramentas) |
| `src/data.js` | Estrutura que não depende de idioma: projetos (chaves, categorias, imagens), WhatsApp, números do topo |
| `src/gallery.js` | Monta as galerias no idioma escolhido, juntando os projetos curados com o ArtStation |
| `src/i18n.jsx` | Idioma (detecção, troca, memória, `<html lang>`, título) |
| `src/visitors.js` | Contador de visitantes (serviço, regras do que conta e do que não conta) |
| `src/App.jsx` · `src/hooks.jsx` · `src/styles.css` | Seções, animações de rolagem e visual (cores e fontes em `:root`) |
| `src/work-manifest.json` | Tamanhos das imagens otimizadas de `public/work/` (gerado por `scripts/optimize-image.mjs`) |
| `public/cv/` | Os currículos em PDF (os links do site apontam para estes dois arquivos) |

Fontes (Space Grotesk e JetBrains Mono) são auto-hospedadas via `@fontsource-variable`, sem requisições ao Google.
Os números do topo e a "Trajetória" seguem os currículos em `public/cv/`; ao atualizá-los, atualize `src/copy.js` também.

### Idiomas (PT / EN)
O site abre no idioma do navegador (português → PT; qualquer outro → EN), lembra a escolha do visitante e aceita `?lang=pt` ou `?lang=en` na URL (útil para compartilhar). A troca atualiza `<html lang>`, o título e a descrição, para tradutores automáticos e leitores de tela agirem certo; a página é remontada ao trocar de idioma, o que evita erros com a tradução automática do Chrome.
Nomes de projetos, empresas e ferramentas não são traduzidos (`translate="no"`).

### Adicionar um projeto à galeria
1. Otimize as imagens (uma por vez; a primeira será a capa):
   ```bash
   npm install --no-save sharp          # uma vez; não faz parte do site
   node scripts/optimize-image.mjs "caminho/render.png" meu-projeto/01-capa
   ```
   Isso gera `public/work/meu-projeto/01-capa-{640,1280,1920}.webp` e atualiza o manifesto. Use `--crop esquerda,topo,largura,altura` para recortar (por exemplo, para tirar a interface de um editor).
2. Em `src/data.js`, inclua o projeto em `projects` (`key`, `title`, `categories`, `images`).
3. Em `src/copy.js`, inclua os textos em `pt.projects.<key>` e `en.projects.<key>` (`subtitle`, `description`, `tags` e um `alt` por imagem).

## Contador de visitantes

O número no topo da página ("N visitantes no portfólio") é um contador anônimo: cada navegador é contado **uma vez** (a marca fica no `localStorage`) e o único dado enviado é o pedido de "+1" ao serviço público [Abacus](https://jasoncameron.dev/abacus), que guarda só o número. Se o serviço não responder, o contador some e o resto do site não é afetado.

- **Não contam:** `localhost`, navegadores automatizados (`navigator.webdriver`), user agents de robôs, e quem não consegue guardar a marca (assim uma pessoa não é contada a cada abertura).
- **Dono do site:** abra uma vez `https://jax-made-3d.vercel.app/?contador=off` no seu navegador para parar de contar as suas visitas (`?contador=on` desfaz).
- **Limites:** o número é indicativo, não uma auditoria: quem limpa os dados do navegador ou usa outro aparelho conta de novo, e qualquer pessoa que conheça o endereço do contador pode somar. O Abacus é gratuito e sem garantia: ele diz renovar o prazo de 6 meses a cada acesso, mas num teste de 12 minutos o prazo não renovou, então não conte com isso. Se o número voltar a zero um dia, é por esse motivo (ou o serviço saiu do ar); a saída durável é um contador próprio (função da Vercel + Upstash Redis, ligados pelo painel).
- **Trocar de serviço:** só `src/visitors.js` conhece o Abacus; basta mudar `service`/`counter` (ou reescrever `call`). As estatísticas completas (páginas, países, dispositivos) ficam no Vercel Web Analytics, que se liga no painel do projeto.

## ArtStation

A faixa "Novidades no ArtStation" e as galerias completas (Varkos, Virex, Wolf Skull, Xenoform) vêm do **feed RSS oficial** do perfil, gravado em `src/artstation.generated.json`. O navegador do visitante nunca chama o ArtStation: o site lê só esse arquivo.

```bash
npm run sync:artstation   # busca o feed e atualiza o arquivo (também roda antes de cada build)
```

- **Limites do feed:** o ArtStation não tem API pública e só publica os **6 projetos mais recentes** no RSS; os mais antigos continuam na galeria curada (`src/data.js`).
- **Ligação com a galeria:** cada projeto pode ter `artstationId` em `src/data.js` (o código está na URL do projeto: `artstation.com/artwork/<código>`); sem ele, só liga se o título for idêntico. Projetos do feed que não estão na galeria vão para "Novidades".
- **Textos e créditos** vêm do ArtStation, em inglês. A tradução para português fica em `artstationPt` (`src/copy.js`, por código de projeto); sem tradução, o texto original é usado. **Mantenha os créditos** (conceito de outros artistas, cursos).
- **Não quebra o build:** se o ArtStation estiver fora do ar, bloquear a requisição ou mudar o formato, o script avisa e mantém o último arquivo salvo.
- O script se identifica com um User-Agent próprio e não tenta contornar a proteção do site. Não troque isso por um User-Agent de navegador.
- **Atualização automática:** o fluxo `.github/workflows/sync-artstation.yml` roda todo dia (e sob demanda, na aba Actions), busca o feed e, se houver projeto novo ou alterado, grava o arquivo na `main`; esse envio faz a Vercel publicar de novo. (A busca durante o build da Vercel não funcionou, por isso a rotina fica no GitHub.) Projetos novos entram em "Novidades" com o texto original em inglês até alguém adicionar a tradução em `artstationPt`.
- Manualmente: rode `npm run sync:artstation`, confira `git diff src/artstation.generated.json`, faça commit e envie.

## Publicação na Vercel

1. Importe este repositório em https://vercel.com/new.
2. Mantenha o preset **Vite** detectado automaticamente.
3. Use `npm run build` como Build Command e `dist` como Output Directory.
4. Clique em **Deploy**.

Após conectar o projeto, cada atualização enviada à branch `main` gera uma nova publicação automaticamente.
