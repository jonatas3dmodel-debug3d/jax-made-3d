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

async function main() {
  let xml;
  try {
    const response = await fetch(feedUrl, { headers: { "User-Agent": userAgent, Accept: "application/rss+xml" }, signal: AbortSignal.timeout(20000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    xml = await response.text();
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
  if (previous && JSON.stringify(previous.items) === JSON.stringify(items)) {
    console.log(`[artstation] sem mudanças (${items.length} projetos).`);
    return;
  }

  const snapshot = { profile: `https://www.artstation.com/${profile}`, fetchedAt: new Date().toISOString(), items };
  await writeFile(output, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
  console.log(`[artstation] atualizado: ${items.length} projetos, ${items.reduce((n, i) => n + i.images.length, 0)} imagens.`);
}

main().catch((error) => console.warn(`[artstation] erro inesperado (${error.message}); mantendo o arquivo anterior.`));
