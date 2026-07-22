const artstation = "https://www.artstation.com/jonatas_araujo";
const fullPortfolio =
  "https://drive.google.com/drive/u/2/folders/1wfWqkQzpte7UyyMqyEm5YtAniP7zBLc9";

const projects = [
  {
    index: "01",
    title: "Revee Company",
    subtitle: "Freelancer · Real-time environment",
    image: "/work/stadium-night.webp",
    href: "https://drive.google.com/drive/folders/1UrH0hs8Kbt_2Jamz_Wz45KTk5csC-61f",
    className: "project project--wide",
    alt: "Ambiente 3D noturno de um estádio iluminado",
  },
  {
    index: "02",
    title: "ResortVR Sorocaba",
    subtitle: "Freelancer · Architectural visualization",
    image: "/work/full-resort.webp",
    href: "https://drive.google.com/drive/folders/1NcRWwbqZ-sYxUqVjjEH4RNpvrW76PWwn",
    className: "project project--tall",
    alt: "Vista aérea renderizada de um resort tropical",
  },
  {
    index: "03",
    title: "Block 406",
    subtitle: "Game jam · Level design",
    image: "/work/block-406.webp",
    href: "https://drive.google.com/drive/folders/1y0IKZRA5CaqSAYbkLoYlGbn_UVF354aN",
    className: "project",
    alt: "Lobby de apartamento criado em Unreal Engine",
  },
  {
    index: "04",
    title: "Echoes of the Void",
    subtitle: "ZTalent · Blocking & level design",
    image: "/work/echoes-bar.webp",
    href: "https://drive.google.com/drive/folders/10K2txuxXrZYdu6BOtyMzF8kUCIn6CNge",
    className: "project",
    alt: "Blocking de bar em cinza para estudo de level design",
  },
  {
    index: "05",
    title: "Virex, the Hollow Seer",
    subtitle: "ZBrush · Organic sculpting",
    image: "/work/virex.webp",
    href: "https://drive.google.com/drive/folders/19jugZPGVIy1LgO5CiQVc-oAfFMxHKnjW",
    className: "project",
    alt: "Escultura digital de criatura chamada Virex",
  },
  {
    index: "06",
    title: "Bulbasaur",
    subtitle: "ZBrush · Character & environment",
    image: "/work/bulbasaur.webp",
    href: "https://drive.google.com/drive/folders/19jugZPGVIy1LgO5CiQVc-oAfFMxHKnjW",
    className: "project project--wide",
    alt: "Personagem Bulbasaur esculpido em ambiente natural",
  },
];

const disciplines = [
  ["01", "3D Modeling", "Hard surface, props e escultura orgânica com atenção à silhueta e aos materiais."],
  ["02", "Level Design", "Espaços que orientam o jogador, do primeiro blocking à composição final."],
  ["03", "Unreal Engine", "Ambientes em tempo real, iluminação, Blueprints e experiências interativas."],
  ["04", "Cinematics", "Narrativa visual, câmera, ritmo e sequências criadas dentro da Unreal Engine."],
];

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function Home() {
  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="JAX MADE 3D — início">
          <img src="/jax-made-logo.webp" alt="" />
          <span>JAX MADE <b>3D</b></span>
        </a>
        <nav aria-label="Navegação principal">
          <a href="#trabalhos">Trabalhos</a>
          <a href="#sobre">Sobre</a>
          <a href="#contato">Contato</a>
        </nav>
        <a className="topbar__cta" href={artstation} target="_blank" rel="noreferrer">
          ArtStation <Arrow />
        </a>
      </header>

      <section className="hero" id="top" aria-labelledby="hero-title">
        <img
          className="hero__image"
          src="/work/environment-night.webp"
          alt="Ambiente 3D noturno criado por Jonatas Araújo"
        />
        <div className="hero__veil" />
        <div className="hero__grid" aria-hidden="true" />

        <div className="hero__content">
          <div className="eyebrow"><i /> Jonatas Araújo · 3D Artist</div>
          <h1 id="hero-title">
            Mundos que existem
            <span>antes de ganhar vida.</span>
          </h1>
          <p>
            Modelagem 3D, level design e experiências cinematográficas em
            Unreal Engine — construídas com intenção, atmosfera e detalhe.
          </p>
          <div className="hero__actions">
            <a className="button button--primary" href="#trabalhos">
              Explorar projetos <span aria-hidden="true">↓</span>
            </a>
            <a className="button button--glass" href={fullPortfolio} target="_blank" rel="noreferrer">
              Portfólio completo <Arrow />
            </a>
          </div>
        </div>

        <div className="hero__meta" aria-label="Informações rápidas">
          <span>Based in Brazil</span>
          <span>Unreal · Blender · ZBrush</span>
          <span className="availability"><i /> Disponível para projetos</span>
        </div>

        <div className="hero__mark" aria-hidden="true">JAX / 3D</div>
      </section>

      <section className="work section" id="trabalhos" aria-labelledby="work-title">
        <div className="section__head">
          <div>
            <span className="section__index">/ 01</span>
            <h2 id="work-title">Selected work</h2>
          </div>
          <p>Uma seleção entre ambientes, experiências interativas, level design e escultura digital.</p>
        </div>

        <div className="project-grid">
          {projects.map((project) => (
            <a
              className={project.className}
              href={project.href}
              target="_blank"
              rel="noreferrer"
              key={project.title}
              aria-label={`${project.title} — abrir projeto no Google Drive`}
            >
              <img src={project.image} alt={project.alt} loading="lazy" />
              <span className="project__shade" />
              <span className="project__number">{project.index}</span>
              <span className="project__copy">
                <small>{project.subtitle}</small>
                <strong>{project.title}</strong>
              </span>
              <span className="project__open"><Arrow /></span>
            </a>
          ))}
        </div>

        <a className="text-link" href={fullPortfolio} target="_blank" rel="noreferrer">
          Ver arquivo completo no Google Drive <Arrow />
        </a>
      </section>

      <section className="about section" id="sobre" aria-labelledby="about-title">
        <div className="about__intro">
          <span className="section__index">/ 02</span>
          <p className="about__kicker">What I do</p>
          <h2 id="about-title">
            Entre a forma e a função,
            <em>eu construo presença.</em>
          </h2>
          <p className="about__body">
            Sou Jonatas Araújo, artista 3D focado em transformar ideias em espaços,
            personagens e cenas que convidam o olhar a permanecer. Meu processo une
            sensibilidade visual e lógica de produção — da primeira massa cinza ao render final.
          </p>
          <a className="text-link" href={artstation} target="_blank" rel="noreferrer">
            Conheça meu ArtStation <Arrow />
          </a>
        </div>

        <div className="disciplines">
          {disciplines.map(([number, title, text]) => (
            <article key={title}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="statement" aria-label="Manifesto">
        <div className="statement__track" aria-hidden="true">
          MODEL · DESIGN · LIGHT · TELL STORIES · MODEL · DESIGN · LIGHT · TELL STORIES ·
        </div>
      </section>

      <section className="contact section" id="contato" aria-labelledby="contact-title">
        <div className="contact__visual">
          <img src="/jax-made-logo.webp" alt="Logo JAX MADE 3D" loading="lazy" />
          <span aria-hidden="true">EST. 2025</span>
        </div>
        <div className="contact__copy">
          <span className="section__index">/ 03</span>
          <p>Tem uma ideia, um mundo ou uma cena para construir?</p>
          <h2 id="contact-title">Vamos criar algo que mereça ser explorado.</h2>
          <div className="contact__actions">
            <a className="button button--primary" href={artstation} target="_blank" rel="noreferrer">
              Falar pelo ArtStation <Arrow />
            </a>
            <a className="button button--outline" href="https://drive.google.com/file/d/1neLJN_sF-HKvtA2mRfYGJqbvEJO24zku/view" target="_blank" rel="noreferrer">
              Currículo PT <Arrow />
            </a>
            <a className="button button--outline" href="https://drive.google.com/file/d/19v2gzyFr-6K0qEIQzH9OxE7qk0B4lmta/view" target="_blank" rel="noreferrer">
              CV English <Arrow />
            </a>
          </div>
        </div>
      </section>

      <footer>
        <a className="brand" href="#top">
          <img src="/jax-made-logo.webp" alt="" />
          <span>JAX MADE <b>3D</b></span>
        </a>
        <p>© {new Date().getFullYear()} Jonatas Araújo. Todos os direitos reservados.</p>
        <div>
          <a href={artstation} target="_blank" rel="noreferrer">ArtStation</a>
          <a href={fullPortfolio} target="_blank" rel="noreferrer">Google Drive</a>
          <a href="#top">Voltar ao topo ↑</a>
        </div>
      </footer>
    </main>
  );
}
