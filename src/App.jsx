import { useEffect, useState } from "react";

const artstation = "https://www.artstation.com/jonatas_araujo";
const email = "jonatas3dmodel@gmail.com";
const contactEndpoint = `https://formsubmit.co/ajax/${email}`;

const projects = [
  {
    index: "01",
    title: "Revee Company",
    subtitle: "Freelancer · Real-time environment",
    image: "/work/stadium-night.webp",
    className: "project project--wide",
    alt: "Ambiente 3D noturno de um estádio iluminado",
    description:
      "Ambiente em tempo real desenvolvido para uma experiência imersiva, com foco em escala, atmosfera noturna e leitura arquitetônica.",
  },
  {
    index: "02",
    title: "ResortVR Sorocaba",
    subtitle: "Freelancer · Architectural visualization",
    image: "/work/full-resort.webp",
    className: "project project--tall",
    alt: "Vista aérea renderizada de um resort tropical",
    description:
      "Visualização arquitetônica de um resort completo para experiência em realidade virtual, unindo composição, paisagismo e navegação espacial.",
  },
  {
    index: "03",
    title: "Block 406",
    subtitle: "Game jam · Level design",
    image: "/work/block-406.webp",
    className: "project",
    alt: "Lobby de apartamento criado em Unreal Engine",
    description:
      "Level design criado para game jam, trabalhando progressão, fluxo do jogador, objetivos e construção de atmosfera em Unreal Engine.",
  },
  {
    index: "04",
    title: "Echoes of the Void",
    subtitle: "ZTalent · Blocking & level design",
    image: "/work/echoes-bar.webp",
    className: "project",
    alt: "Blocking de bar em cinza para estudo de level design",
    description:
      "Estudo de blocking e distribuição espacial para um ambiente narrativo, priorizando ritmo, pontos de interesse e caminhos intuitivos.",
  },
  {
    index: "05",
    title: "Virex, the Hollow Seer",
    subtitle: "ZBrush · Organic sculpting",
    image: "/work/virex.webp",
    className: "project",
    alt: "Escultura digital de criatura chamada Virex",
    description:
      "Criatura autoral esculpida em ZBrush, explorando anatomia fantástica, silhueta e uma identidade visual inquietante.",
  },
  {
    index: "06",
    title: "Wolf Skull: Desert Relic",
    subtitle: "ZBrush · Unreal Engine",
    image: "/work/wolf-skull.webp",
    className: "project project--wide",
    alt: "Crânio de lobo modelado em primeiro plano em um ambiente desértico",
    description:
      "Escultura anatômica apresentada em um cenário autoral no Unreal Engine, combinando modelagem orgânica, materiais e direção de atmosfera.",
  },
  {
    index: "07",
    title: "Xenoform: Specimen 01",
    subtitle: "ZBrush · Creature design",
    image: "/work/xenoform.webp",
    className: "project",
    alt: "Busto de criatura alienígena com pele azul acinzentada e estruturas alaranjadas",
    description:
      "Estudo de criatura extraterrestre com foco em anatomia, expressão e contraste de materiais para construir uma presença visual reconhecível.",
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
  const [activeIndex, setActiveIndex] = useState(null);
  const [sendStatus, setSendStatus] = useState("idle");
  const activeProject = activeIndex === null ? null : projects[activeIndex];

  useEffect(() => {
    if (activeIndex === null) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowLeft") {
        setActiveIndex((current) => (current - 1 + projects.length) % projects.length);
      }
      if (event.key === "ArrowRight") {
        setActiveIndex((current) => (current + 1) % projects.length);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex]);

  const changeProject = (direction) => {
    setActiveIndex((current) => (current + direction + projects.length) % projects.length);
  };

  const handleContactSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    formData.append("_subject", "Novo contato pelo portfólio JAX MADE 3D");
    formData.append("_template", "table");
    formData.append("_captcha", "false");
    formData.append("_url", window.location.href);

    setSendStatus("sending");

    try {
      const response = await fetch(contactEndpoint, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error("Não foi possível enviar a mensagem.");

      form.reset();
      setSendStatus("success");
    } catch {
      setSendStatus("error");
    }
  };

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="JAX MADE 3D, início">
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
            Unreal Engine, construídas com intenção, atmosfera e detalhe.
          </p>
          <div className="hero__actions">
            <a className="button button--primary" href="#trabalhos">
              Explorar projetos <span aria-hidden="true">↓</span>
            </a>
            <a className="button button--glass" href="#contato">
              Iniciar contato <span aria-hidden="true">↓</span>
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
          <p>
            Uma galeria curada entre trabalhos profissionais, ambientes em tempo real,
            level design e escultura digital. Clique em uma imagem para ampliar.
          </p>
        </div>

        <div className="project-grid">
          {projects.map((project, index) => (
            <button
              type="button"
              className={project.className}
              key={project.title}
              onClick={() => setActiveIndex(index)}
              aria-label={`${project.title}, ampliar imagem na galeria`}
            >
              <img src={project.image} alt={project.alt} loading="lazy" />
              <span className="project__shade" />
              <span className="project__number">{project.index}</span>
              <span className="project__copy">
                <small>{project.subtitle}</small>
                <strong>{project.title}</strong>
              </span>
              <span className="project__open" aria-hidden="true">＋</span>
            </button>
          ))}
        </div>

        <a className="text-link" href="#contato">
          Gostou do trabalho? Vamos conversar <Arrow />
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
            sensibilidade visual e lógica de produção, da primeira massa cinza ao render final.
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

          <form className="contact-form" onSubmit={handleContactSubmit}>
            <div className="contact-form__row">
              <label>
                <span>Nome</span>
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  placeholder="Como posso chamar você?"
                  required
                />
              </label>
              <label>
                <span>E-mail</span>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="seuemail@exemplo.com"
                  required
                />
              </label>
            </div>
            <label>
              <span>Mensagem</span>
              <textarea
                name="message"
                rows="5"
                placeholder="Conte um pouco sobre a ideia, projeto ou oportunidade."
                required
              />
            </label>
            <input
              className="contact-form__honey"
              type="text"
              name="_honey"
              tabIndex="-1"
              autoComplete="off"
              aria-hidden="true"
            />
            <div className="contact-form__footer">
              <button
                className="button button--primary"
                type="submit"
                disabled={sendStatus === "sending"}
              >
                {sendStatus === "sending" ? "Enviando..." : "Enviar mensagem"} <Arrow />
              </button>
              <p className={`contact-form__status contact-form__status--${sendStatus}`} role="status">
                {sendStatus === "success" && "Mensagem enviada. Obrigado pelo contato!"}
                {sendStatus === "error" && "O envio falhou. Tente novamente em alguns instantes."}
              </p>
            </div>
          </form>

          <div className="contact__resources">
            <span>Currículos e perfil profissional</span>
            <div className="contact__actions">
              <a
                className="button button--outline"
                href="/cv/Curriculo-Jonatas-Araujo-PT-BR.pdf"
                target="_blank"
                rel="noreferrer"
              >
                Currículo PT-BR <Arrow />
              </a>
              <a
                className="button button--outline"
                href="/cv/Jonatas-Araujo-English-CV.pdf"
                target="_blank"
                rel="noreferrer"
              >
                English CV <Arrow />
              </a>
              <a className="button button--outline" href={artstation} target="_blank" rel="noreferrer">
                ArtStation <Arrow />
              </a>
            </div>
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
          <a href="#contato">Contato</a>
          <a href="#top">Voltar ao topo ↑</a>
        </div>
      </footer>

      {activeProject && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lightbox-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setActiveIndex(null);
          }}
        >
          <button
            className="lightbox__close"
            type="button"
            onClick={() => setActiveIndex(null)}
            aria-label="Fechar galeria"
          >
            Fechar <span aria-hidden="true">×</span>
          </button>
          <button
            className="lightbox__nav lightbox__nav--prev"
            type="button"
            onClick={() => changeProject(-1)}
            aria-label="Projeto anterior"
          >
            ←
          </button>
          <figure className="lightbox__figure">
            <img src={activeProject.image} alt={activeProject.alt} />
            <figcaption>
              <span>
                {String(activeIndex + 1).padStart(2, "0")} /{" "}
                {String(projects.length).padStart(2, "0")}
              </span>
              <div>
                <small>{activeProject.subtitle}</small>
                <h2 id="lightbox-title">{activeProject.title}</h2>
                <p>{activeProject.description}</p>
              </div>
            </figcaption>
          </figure>
          <button
            className="lightbox__nav lightbox__nav--next"
            type="button"
            onClick={() => changeProject(1)}
            aria-label="Próximo projeto"
          >
            →
          </button>
        </div>
      )}
    </main>
  );
}
