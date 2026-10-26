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

- `src/data.js`: **todo o conteúdo** (projetos da galeria, ferramentas, experiência, formação e números do topo). Para adicionar um projeto, coloque a imagem em `public/work/` e inclua um item em `projects`; a galeria, o filtro e o lightbox se ajustam sozinhos.
- `src/App.jsx`: seções e componentes. `src/hooks.jsx`: animações de rolagem, destaque do menu e contadores. `src/styles.css`: visual (cores e fontes em `:root`).
- Fontes (Space Grotesk e JetBrains Mono) são auto-hospedadas via `@fontsource-variable`, sem requisições ao Google.
- Os números do topo e o texto de "Trajetória" vêm dos currículos em `public/cv/`; ao atualizá-los, atualize `src/data.js` também.

## ArtStation

A faixa "Novidades no ArtStation" e as galerias de várias imagens (por exemplo Varkos e Virex) vêm do **feed RSS oficial** do perfil, gravado em `src/artstation.generated.json`. O navegador do visitante nunca chama o ArtStation: o site lê só esse arquivo.

```bash
npm run sync:artstation   # busca o feed e atualiza o arquivo (também roda antes de cada build)
```

- **Limites do feed:** o ArtStation não tem API pública e só publica os **6 projetos mais recentes** no RSS; projetos mais antigos continuam na galeria curada (`src/data.js`). Para um projeto antigo ter várias imagens, o título dele em `src/data.js` precisa ser idêntico ao do ArtStation.
- **Não quebra o build:** se o ArtStation estiver fora do ar, bloquear a requisição ou mudar o formato, o script avisa e mantém o último arquivo salvo.
- O script se identifica com um User-Agent próprio e não tenta contornar a proteção do site. Não troque isso por um User-Agent de navegador.
- Textos e créditos vêm do ArtStation (em inglês); ficam exatamente como foram publicados lá.
- Para publicar projetos novos: rode o comando, confira `git diff src/artstation.generated.json`, faça commit e envie.

## Publicação na Vercel

1. Importe este repositório em https://vercel.com/new.
2. Mantenha o preset **Vite** detectado automaticamente.
3. Use `npm run build` como Build Command e `dist` como Output Directory.
4. Clique em **Deploy**.

Após conectar o projeto, cada atualização enviada à branch `main` gera uma nova publicação automaticamente.
