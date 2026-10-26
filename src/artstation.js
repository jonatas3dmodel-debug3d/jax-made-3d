// Projetos recentes do ArtStation (feed RSS oficial), gravados por `npm run sync:artstation`.
// O site nunca chama o ArtStation no navegador do visitante: lê só este arquivo, gerado no build.
import snapshot from "./artstation.generated.json";

export const profileUrl = snapshot.profile ?? "https://www.artstation.com/jonatas_araujo";
export const syncedAt = snapshot.fetchedAt ?? null;
export const items = Array.isArray(snapshot.items) ? snapshot.items : [];

/** O CDN do ArtStation serve a mesma imagem em vários tamanhos trocando o trecho `/large/` da URL. */
export const sizeOf = (src, size) => src.replace("/large/", `/${size}/`);
