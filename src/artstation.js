// Projetos recentes do ArtStation (feed RSS oficial), gravados por `npm run sync:artstation`.
// O site nunca chama o ArtStation no navegador do visitante: lê só este arquivo, gerado no build.
import snapshot from "./artstation.generated.json";

export const profileUrl = snapshot.profile ?? "https://www.artstation.com/jonatas_araujo";
export const syncedAt = snapshot.fetchedAt ?? null;
const items = Array.isArray(snapshot.items) ? snapshot.items : [];

const normalize = (title) =>
  title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[^a-z0-9]+/g, "");

/** O CDN do ArtStation serve a mesma imagem em vários tamanhos trocando o trecho `/large/` da URL. */
export const sizeOf = (src, size) => src.replace("/large/", `/${size}/`);

const monthLabel = (iso) => new Date(iso).toLocaleDateString("pt-BR", { month: "short", year: "numeric" }).replace(".", "");

const gallery = (title, images) => images.map((src, index) => ({ src, alt: `${title}, imagem ${index + 1} de ${images.length}` }));

/**
 * Cruza a galeria curada com o ArtStation:
 * - projeto curado com o mesmo título ganha todas as imagens do projeto e o link para ele;
 * - projeto do ArtStation que ainda não está na galeria vai para `recent`.
 * A associação é pelo `artstationId` do projeto (quando o título difere entre o site e o ArtStation) ou por título
 * idêntico (sem acentos, caixa ou pontuação); nada é adivinhado.
 */
export function mergeArtstation(projects) {
  const byTitle = new Map(items.map((item) => [normalize(item.title), item]));
  const matched = new Set();

  const curated = projects.map((project) => {
    const item = items.find((entry) => entry.id === project.artstationId) ?? byTitle.get(normalize(project.title));
    if (!item) return project;
    matched.add(item.id);
    return { ...project, images: gallery(project.title, item.images), artstationUrl: item.url };
  });

  const recent = items
    .filter((item) => !matched.has(item.id))
    .map((item) => ({
      title: item.title,
      subtitle: `ArtStation · ${monthLabel(item.date)}`,
      image: sizeOf(item.images[0], "medium"),
      alt: `${item.title}, imagem de capa`,
      description: item.description,
      tags: [],
      images: gallery(item.title, item.images),
      artstationUrl: item.url,
    }));

  return { curated, recent };
}
