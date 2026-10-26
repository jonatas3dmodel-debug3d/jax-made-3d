// Sincroniza os projetos mais recentes do ArtStation para src/artstation.generated.json.
//
//   npm run sync:artstation
//
// Usa o feed RSS oficial do perfil (o ArtStation não tem API pública e bloqueia acesso automatizado às demais
// rotas), com um User-Agent que se identifica. O feed traz só os 6 projetos mais recentes, com todas as imagens.
// Roda também antes de cada build (prebuild), mas NUNCA derruba o build: se o ArtStation não responder, ou
// responder algo inesperado, o último arquivo salvo continua valendo.
import { readFile, writeFile } from "node:fs/promises";

const profile = "jonatas_araujo";
const feedUrl = process.env.ARTSTATION_FEED_URL ?? `https://www.artstation.com/${profile}.rss`;
const output = new URL("../src/artstation.generated.json", import.meta.url);
const userAgent = "jax-made-3d-portfolio-sync/1.0 (+https://jax-made-3d.vercel.app; sincronização do próprio perfil)";
const imageHost = /^https:\/\/cdn[a-z]\.artstation\.com\/p\/assets\//;

const decodeEntities = (text) =>
  text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&amp;/g, "&");

const unwrap = (raw) => {
  const cdata = raw.match(/<!\[CDATA\[([\s\S]*?)\]\]>/);
  return (cdata ? cdata[1] : decodeEntities(raw)).trim();
};

const tag = (block, name) => {
  const match = block.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`));
  return match ? unwrap(match[1]) : "";
};

const htmlToText = (html) =>
  decodeEntities(
    html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>\s*<p>/gi, "\n\n")
      .replace(/<[^>]+>/g, ""),
  ).trim();

function parseItem(block) {
  const url = tag(block, "link");
  const title = tag(block, "title").replace(/\s+by\s+Jonatas.*$/i, "").trim();
  const published = new Date(tag(block, "pubDate"));
  const content = tag(block, "content:encoded");
  const images = [...new Set([...content.matchAll(/<img[^>]+src="([^"]+)"/g)].map((m) => m[1]))].filter((src) => imageHost.test(src));
  const id = url.match(/\/artwork\/([A-Za-z0-9]+)/)?.[1];

  if (!id || !title || Number.isNaN(published.getTime()) || !images.length) return null;
  return {
    id,
    title,
    url: `https://www.artstation.com/artwork/${id}`,
    date: published.toISOString(),
    description: htmlToText(tag(block, "description")),
    images,
  };
}

const transient = (status) => status === 403 || status === 408 || status === 425 || status === 429 || status >= 500;

/**
 * Busca o feed. O ArtStation às vezes recusa por um instante (HTTP 403 passageiro, visto em servidores do GitHub):
 * até 3 tentativas, com pausa maior a cada uma, só para erros temporários. Na Vercel é 1 tentativa (não atrasa o build).
 */
async function fetchFeed() {
  const attempts = process.env.VERCEL ? 1 : 3;
  const pause = Number(process.env.ARTSTATION_RETRY_DELAY_MS ?? 30000);
  let failure;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const response = await fetch(feedUrl, { headers: { "User-Agent": userAgent, Accept: "application/rss+xml" }, signal: AbortSignal.timeout(20000) });
      if (response.ok) return await response.text();
      failure = new Error(`HTTP ${response.status}`);
      if (!transient(response.status)) break; // recusa definitiva (404 etc.): não insiste
    } catch (error) {
      failure = error;
    }
    if (attempt < attempts) {
      console.warn(`[artstation] tentativa ${attempt} falhou (${failure.message}); nova tentativa em ${Math.round((pause * attempt) / 1000)} s.`);
      await new Promise((resolve) => setTimeout(resolve, pause * attempt));
    }
  }
  throw failure;
}

async function main() {
  let xml;
  try {
    // ARTSTATION_FEED_FILE: usa um feed já baixado (o fluxo do GitHub baixa com curl, que o ArtStation aceita melhor que o fetch do Node)
    xml = process.env.ARTSTATION_FEED_FILE ? await readFile(process.env.ARTSTATION_FEED_FILE, "utf8") : await fetchFeed();
  } catch (error) {
    console.warn(`[artstation] não foi possível atualizar (${error.message}); mantendo o arquivo anterior.`);
    return;
  }

  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => parseItem(m[1])).filter(Boolean);
  if (!items.length) {
    console.warn("[artstation] o feed não trouxe projetos válidos; mantendo o arquivo anterior.");
    return;
  }

  let previous = null;
  try {
    previous = JSON.parse(await readFile(output, "utf8"));
  } catch {
    /* primeira execução */
  }
  const unchanged = previous && JSON.stringify(previous.items) === JSON.stringify(items);
  // Na Vercel a cópia de build é descartável: sempre carimba a data, e "Atualizado em" mostra a última busca bem-sucedida.
  if (unchanged && !process.env.VERCEL) {
    console.log(`[artstation] sem mudanças (${items.length} projetos).`);
    return;
  }

  const snapshot = { profile: `https://www.artstation.com/${profile}`, fetchedAt: new Date().toISOString(), items };
  await writeFile(output, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
  console.log(`[artstation] atualizado: ${items.length} projetos, ${items.reduce((n, i) => n + i.images.length, 0)} imagens.`);
}

main().catch((error) => console.warn(`[artstation] erro inesperado (${error.message}); mantendo o arquivo anterior.`));
