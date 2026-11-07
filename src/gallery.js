// Monta a galeria no idioma escolhido: projetos curados (com galeria própria ou o projeto completo do ArtStation) e
// "novidades" (projetos do ArtStation que ainda não estão na galeria curada).
import { artstationPt, copy } from "./copy.js";
import { projects } from "./data.js";
import { items, sizeOf } from "./artstation.js";
import manifest from "./work-manifest.json";

const normalize = (title) =>
  title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[^a-z0-9]+/g, "");

const url = (base, width) => `/work/${base}-${width}.webp`;

function localImage(base, alt) {
  const info = manifest[base];
  return {
    src: url(base, info.w),
    thumb: url(base, info.widths[0]),
    srcSet: info.widths.map((width) => `${url(base, width)} ${width}w`).join(", "),
    width: info.w,
    height: info.h,
    alt,
  };
}

/** Vídeo hospedado no próprio site (public/work/<chave>.mp4): o poster e a miniatura vêm de uma imagem do manifesto. */
function localVideo(entry, alt) {
  const poster = localImage(entry.poster, alt);
  return { ...poster, video: `/work/${entry.video}.mp4`, poster: poster.src, loop: Boolean(entry.loop) };
}

const remoteImages = (title, sources, t) =>
  sources.map((src, index) => ({ src, thumb: sizeOf(src, "small"), alt: t.artstation.image(title, index + 1, sources.length) }));

/** O texto do ArtStation vem em inglês; em português usa a tradução quando existe. */
const artstationText = (item, lang) => (lang === "pt" ? artstationPt[item.id] ?? item.description : item.description);

export function buildGallery(lang) {
  const t = copy[lang];
  const byId = new Map(items.map((item) => [item.id, item]));
  const byTitle = new Map(items.map((item) => [normalize(item.title), item]));
  const used = new Set();

  const curated = projects.map((project) => {
    const text = t.projects[project.key];
    const images = project.images.map((entry, index) => {
      const alt = text.alts[index] ?? text.alts[0];
      return typeof entry === "string" ? localImage(entry, alt) : localVideo(entry, alt);
    });
    const base = {
      key: project.key,
      title: project.title,
      group: project.group,
      categories: project.categories,
      layout: project.layout,
      externalUrl: project.externalUrl,
      store: project.store,
      subtitle: text.subtitle,
      description: text.description,
      role: text.role,
      tags: text.tags,
      cover: images[0],
      images,
    };
    const match = byId.get(project.artstationId) ?? byTitle.get(normalize(project.title));
    if (!match) return base;
    used.add(match.id);
    return { ...base, images: remoteImages(project.title, match.images, t), notes: artstationText(match, lang), artstationUrl: match.url };
  });

  const recent = items
    .filter((item) => !used.has(item.id))
    .map((item) => ({
      key: item.id,
      title: item.title,
      subtitle: `ArtStation · ${t.artstation.month(item.date)}`,
      description: artstationText(item, lang),
      tags: [],
      cover: { src: sizeOf(item.images[0], "medium"), alt: t.artstation.cover(item.title) },
      images: remoteImages(item.title, item.images, t),
      artstationUrl: item.url,
    }));

  return { curated, recent };
}
