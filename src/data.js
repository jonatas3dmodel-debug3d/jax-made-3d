// Estrutura do conteúdo (o que não depende de idioma). Os textos ficam em src/copy.js.
// Para adicionar um projeto: gere as imagens (WebP em 640/1280/1920 px) em public/work/<pasta>/, registre-as em
// src/work-manifest.json, inclua o item aqui e os textos (subtitle, description, tags, alts) em pt e en no copy.js.

export const artstation = "https://www.artstation.com/jonatas_araujo";
export const email = "jonatas3dmodel@gmail.com";
export const whatsapp = { number: "5511984516003", display: "+55 11 98451-6003" };

export const filterKeys = ["all", "ambientes", "criaturas", "jogos"];

// `images` são chaves do manifesto (public/work/<chave>-<largura>.webp); a primeira é a capa.
// `artstationId` liga o projeto ao do ArtStation (os títulos nem sempre coincidem): a galeria passa a mostrar o projeto completo.
export const projects = [
  {
    key: "revee",
    title: "Revee Company",
    categories: ["ambientes"],
    layout: "wide",
    images: [
      "revee/01-stadium-at-night",
      "revee/02-environment-at-night",
      "revee/03-aerial-view",
      "revee/04-facade-and-gardens",
      "revee/05-gardens",
      "revee/06-concourse",
      "revee/07-players-tunnel",
      "revee/08-theater",
    ],
  },
  {
    key: "resort",
    title: "ResortVR Sorocaba",
    categories: ["ambientes"],
    images: ["resort/01-full-resort", "resort/02-zipline", "resort/03-hotel", "resort/04-police-station", "resort/05-plaza", "resort/06-zipline-model"],
  },
  {
    key: "cristal",
    title: "A Lenda do Cristal",
    categories: ["jogos"],
    externalUrl: "https://play.google.com/store/apps/details?id=com.bighouse.alendadocristal", // página do jogo na Google Play
    store: "play",
    images: ["cristal/01-cover", "cristal/02-horde", "cristal/03-level-up", "cristal/04-bats", "cristal/05-forest"],
  },
  {
    key: "block406",
    title: "Block 406",
    categories: ["ambientes", "jogos"],
    externalUrl: "https://hunterzinho.itch.io/bloco-406", // versão alfa (protótipo de game jam) no itch.io
    store: "itch",
    // as seis primeiras são capturas do jogo; as três últimas são o blockout inicial (o "antes")
    images: [
      "block406/game/01-lobby",
      "block406/game/02-kitchen",
      "block406/game/03-living-room",
      "block406/game/04-bedroom",
      "block406/game/05-blood-corridor",
      "block406/game/06-kitchen-storage",
      "block406/01-apartment-lobby",
      "block406/02-blocking-bedroom-2",
      "block406/03-blocking-bedroom",
    ],
  },
  {
    key: "god",
    title: "The God of Small Things",
    categories: ["jogos"],
    externalUrl: "https://hunterzinho.itch.io/the-god-of-small-things", // página do jogo no itch.io
    store: "itch",
    images: [
      "god/02-settlement-day",
      "god/01-cover",
      "god/03-build-menu",
      "god/04-miracles",
      "god/05-the-pact",
      "god/06-every-choice",
      "god/07-settlement-night",
    ],
  },
  {
    key: "autumnbound",
    title: "Autumnbound",
    categories: ["jogos"],
    externalUrl: "https://hunterzinho.itch.io/autumnbound", // página do jogo no itch.io (thatgamejam #02)
    store: "itch",
    images: ["autumnbound/00-cover", "autumnbound/01-title", "autumnbound/02-windmill-autumn", "autumnbound/03-forgotten-lake", "autumnbound/04-winter-waterfall"],
  },
  { key: "varkos", title: "Varkos — Tyrannosaurus Rex", artstationId: "P4el1L", categories: ["criaturas"], images: ["covers/varkos-trex"] },
  { key: "virex", title: "Virex, the Hollow Seer", artstationId: "qJx8bz", categories: ["criaturas"], images: ["covers/virex"] },
  { key: "wolf", title: "Wolf Skull: Desert Relic", artstationId: "qJGWBL", categories: ["criaturas", "ambientes"], images: ["covers/wolf-skull"] },
  { key: "xenoform", title: "Xenoform: Specimen 01", artstationId: "P6lwZL", categories: ["criaturas"], images: ["covers/xenoform"] },
];

// Números do topo (os rótulos estão em copy.hero.stats, na mesma ordem).
export const stats = [{ value: projects.length }, { value: 3 }, { value: 2, years: true }, { value: 3 }];
