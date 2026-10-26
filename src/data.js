// Conteúdo do portfólio. Tudo aqui vem dos projetos já publicados no site e dos currículos (public/cv).
// Para atualizar textos ou adicionar projetos, edite este arquivo; a interface se adapta.

export const artstation = "https://www.artstation.com/jonatas_araujo";
export const email = "jonatas3dmodel@gmail.com";

export const filters = [
  { key: "all", label: "Todos" },
  { key: "ambientes", label: "Ambientes" },
  { key: "criaturas", label: "Criaturas" },
];

export const projects = [
  {
    title: "Revee Company",
    subtitle: "Freelancer · Real-time environment",
    image: "/work/stadium-night.webp",
    ratio: "1435 / 863",
    categories: ["ambientes"],
    tags: ["Unreal Engine", "Environment art"],
    alt: "Ambiente 3D noturno de um estádio iluminado",
    description:
      "Ambiente em tempo real desenvolvido para uma experiência imersiva, com foco em escala, atmosfera noturna e leitura arquitetônica.",
    layout: "wide",
  },
  {
    title: "ResortVR Sorocaba",
    subtitle: "Freelancer · Architectural visualization",
    image: "/work/full-resort.webp",
    ratio: "2400 / 1690",
    categories: ["ambientes"],
    tags: ["Realidade virtual", "Visualização arquitetônica"],
    alt: "Vista aérea renderizada de um resort tropical",
    description:
      "Visualização arquitetônica de um resort completo para experiência em realidade virtual, unindo composição, paisagismo e navegação espacial.",
  },
  {
    title: "Block 406",
    subtitle: "Game jam · Level design",
    image: "/work/block-406.webp",
    ratio: "1357 / 887",
    categories: ["ambientes"],
    tags: ["Unreal Engine", "Level design", "Game jam"],
    alt: "Lobby de apartamento criado em Unreal Engine",
    description:
      "Level design criado para game jam, trabalhando progressão, fluxo do jogador, objetivos e construção de atmosfera em Unreal Engine.",
  },
  {
    title: "Varkos — Tyrannosaurus Rex",
    subtitle: "ZBrush · Creature modeling",
    image: "/work/varkos-trex.webp",
    ratio: "1920 / 1536",
    categories: ["criaturas"],
    tags: ["ZBrush", "Anatomia", "Texturização"],
    alt: "Modelo 3D realista do Tyrannosaurus Rex Varkos",
    description:
      "Estudo realista de um T. rex com foco em anatomia, detalhes de pele, texturização e apresentação final.",
  },
  {
    title: "Virex, the Hollow Seer",
    subtitle: "ZBrush · Organic sculpting",
    image: "/work/virex.webp",
    ratio: "1480 / 833",
    categories: ["criaturas"],
    tags: ["ZBrush", "Escultura orgânica"],
    alt: "Escultura digital de criatura chamada Virex",
    description:
      "Criatura autoral esculpida em ZBrush, explorando anatomia fantástica, silhueta e uma identidade visual inquietante.",
  },
  {
    title: "Wolf Skull: Desert Relic",
    subtitle: "ZBrush · Unreal Engine",
    image: "/work/wolf-skull.webp",
    ratio: "2400 / 1290",
    categories: ["criaturas", "ambientes"],
    tags: ["ZBrush", "Unreal Engine", "Materiais"],
    alt: "Crânio de lobo modelado em primeiro plano em um ambiente desértico",
    description:
      "Escultura anatômica apresentada em um cenário autoral no Unreal Engine, combinando modelagem orgânica, materiais e direção de atmosfera.",
  },
  {
    title: "Xenoform: Specimen 01",
    subtitle: "ZBrush · Creature design",
    image: "/work/xenoform.webp",
    ratio: "2000 / 1600",
    categories: ["criaturas"],
    tags: ["ZBrush", "Creature design"],
    alt: "Busto de criatura alienígena com pele azul acinzentada e estruturas alaranjadas",
    description:
      "Estudo de criatura extraterrestre com foco em anatomia, expressão e contraste de materiais para construir uma presença visual reconhecível.",
  },
];

export const disciplines = [
  ["01", "3D Modeling", "Hard surface, props e escultura orgânica com atenção à silhueta e aos materiais."],
  ["02", "Level Design", "Espaços que orientam o jogador, do primeiro blocking à composição final."],
  ["03", "Unreal Engine", "Ambientes em tempo real, iluminação, Blueprints e experiências interativas."],
  ["04", "Cinematics", "Narrativa visual, câmera, ritmo e sequências criadas dentro da Unreal Engine."],
];

// Ferramentas e competências, exatamente como constam no currículo.
export const toolkit = [
  { group: "Engines", items: ["Unreal Engine 5", "Unity"] },
  { group: "Modelagem 3D", items: ["Autodesk Maya", "Blender", "ZBrush"] },
  { group: "Texturização", items: ["Substance 3D Painter"] },
  {
    group: "Game art",
    items: ["Environment art", "Level design", "World building", "Blockout", "Narrativa ambiental", "Composição visual"],
  },
  { group: "Produção", items: ["LODs", "Otimização de performance", "Pipeline de assets", "Diversion"] },
];

// Experiência profissional (currículo PT-BR).
export const experience = [
  {
    when: "Mai – Jun 2026",
    place: "Salas Games · Remoto",
    role: "Level Designer | Artista 3D",
    points: [
      "Ambientes e níveis em Unity, de blockout à composição visual.",
      "Modelagem de assets, LODs e otimização de performance.",
      "Trabalho com equipes de Arte, Design e Programação.",
    ],
  },
  {
    when: "2 anos",
    place: "Zion Escola de Entretenimento · Santo Amaro, SP",
    role: "Estágio em Game Design",
    points: [
      "Projetos de game design, documentação e prototipagem.",
      "Modelagem 3D, ambientes, level design e design de mecânicas.",
      "Produção em Unreal Engine.",
    ],
  },
];

export const freelance = [
  {
    name: "Revee",
    role: "Environment Artist",
    text: "Ambientes na Unreal Engine, com ambientação do Estádio do Canindé e do Teatro Municipal de São Paulo.",
  },
  {
    name: "CINEP",
    role: "Artista 3D",
    text: "Resort em realidade virtual: UVs, texturização, organização de malha e preparação dos modelos para VR.",
  },
  {
    name: "Projetos de jogos Roblox",
    role: "Artista 3D",
    text: "Criaturas estilizadas e props para experiências de dois dos principais criadores de conteúdo de Roblox do Brasil.",
  },
];

export const education = [
  { title: "Tecnólogo em Game Design", place: "Zion Escola de Entretenimento", note: "Curso concluído" },
  { title: "Inglês avançado (B2)", place: "CNA Inglês Definitivo · leitura técnica e colaboração com equipes internacionais", note: "Certificação" },
];

export const stats = [
  { value: projects.length, label: "projetos em destaque" },
  { value: 3, label: "projetos freelance" },
  { value: 2, suffix: " anos", label: "em game design na Zion" },
  { value: 2, label: "engines: Unreal 5 e Unity" },
];
