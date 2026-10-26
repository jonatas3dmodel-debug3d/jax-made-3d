import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  artstation,
  disciplines,
  education,
  email,
  experience,
  filters,
  freelance,
  projects,
  stats,
  toolkit,
} from "./data.js";
import { mergeArtstation, profileUrl, sizeOf, syncedAt } from "./artstation.js";
import { CountUp, prefersReducedMotion, useReveal, useScrollEffects, useScrollSpy } from "./hooks.jsx";

const contactEndpoint = `https://formsubmit.co/ajax/${email}`;

const navLinks = [
  ["trabalhos", "Trabalhos"],
  ["sobre", "Sobre"],
  ["experiencia", "Experiência"],
  ["contato", "Contato"],
];

const { curated, recent } = mergeArtstation(projects);

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

/* -------------------------------------------------------------------------------------------- */
function Header({ active }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    const onKey = (event) => event.key === "Escape" && close();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return (
    <header className={`topbar${open ? " is-open" : ""}`}>
      <span className="topbar__progress" aria-hidden="true" />
      <a className="brand" href="#top" aria-label="JAX MADE 3D, início" onClick={close}>
        <img src="/jax-made-logo.webp" alt="" width="42" height="42" />
        <span>
          JAX MADE <b>3D</b>
        </span>
      </a>

      <nav id="menu" className="topbar__nav" aria-label="Navegação principal">
        {navLinks.map(([id, label]) => (
          <a key={id} href={`#${id}`} aria-current={active === id ? "true" : undefined} onClick={close}>
            {label}
          </a>
        ))}
        <a href={artstation} target="_blank" rel="noreferrer" onClick={close}>
          ArtStation <Arrow />
        </a>
        <a className="button button--primary topbar__nav-cta" href="#contato" onClick={close}>
          Vamos conversar <Arrow />
        </a>
      </nav>

      <div className="topbar__actions">
        <a className="button button--primary button--small topbar__cta" href="#contato">
          Vamos conversar
        </a>
        <button
          className="topbar__burger"
          type="button"
          aria-expanded={open}
          aria-controls="menu"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((value) => !value)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------------------------------- */
function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <img
        className="hero__image"
        src="/work/environment-night.webp"
        alt="Ambiente 3D noturno criado por Jonatas Araújo"
        width="1325"
        height="894"
        fetchPriority="high"
        decoding="async"
      />
      <div className="hero__veil" />
      <div className="hero__grid" aria-hidden="true" />
      <div className="hero__scan" aria-hidden="true" />
      <div className="hero__signal" aria-hidden="true">
        <span>ENV / 3D</span>
        <i />
        <span>REALTIME</span>
      </div>

      <div className="hero__content">
        <div className="eyebrow">
          <i /> Jonatas Araújo · Artista 3D · São Paulo
        </div>
        <h1 id="hero-title">
          Mundos que existem
          <span>antes de ganhar vida.</span>
        </h1>
        <p>
          Ambientes, level design e cinematics em Unreal Engine e Unity, construídos com intenção, atmosfera e detalhe,
          do blockout à otimização.
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

      <div className="hero__bar">
        <ul className="hero__stats" aria-label="Resumo">
          {stats.map((stat) => (
            <li key={stat.label}>
              <strong>
                <CountUp value={stat.value} suffix={stat.suffix} />
              </strong>
              <span>{stat.label}</span>
            </li>
          ))}
        </ul>
        <p className="availability">
          <i /> Disponível para projetos
        </p>
      </div>

      <div className="hero__mark" aria-hidden="true">
        JAX / 3D
      </div>
      <a className="hero__scroll" href="#trabalhos" aria-label="Ir para os projetos">
        <span>Scroll to explore</span>
        <i aria-hidden="true" />
      </a>
    </section>
  );
}

/* -------------------------------------------------------------------------------------------- */
function LightboxFigure({ project }) {
  const [current, setCurrent] = useState(0);
  const images = project.images ?? [{ src: project.image, alt: project.alt }];
  const shown = images[current] ?? images[0];
  const many = images.length > 1;

  return (
    <figure className="lightbox__figure">
      {many ? (
        <button
          type="button"
          className="lightbox__stage"
          onClick={() => setCurrent((value) => (value + 1) % images.length)}
          aria-label={`Imagem ${current + 1} de ${images.length}. Clique para ver a próxima`}
        >
          <img src={shown.src} alt={shown.alt} />
        </button>
      ) : (
        <img className="lightbox__single" src={shown.src} alt={shown.alt} />
      )}
      {many && (
        <ul className="lightbox__thumbs" aria-label="Imagens do projeto">
          {images.map((image, index) => (
            <li key={image.src}>
              <button
                type="button"
                aria-label={`Ver imagem ${index + 1} de ${images.length}`}
                aria-current={index === current ? "true" : undefined}
                onClick={() => setCurrent(index)}
              >
                <img src={sizeOf(image.src, "small")} alt="" loading="lazy" decoding="async" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <figcaption>
        <div>
          <small>{project.subtitle}</small>
          <h2 id="lightbox-title">{project.title}</h2>
          <p>{project.description}</p>
          {project.tags?.length > 0 && (
            <ul className="chips" aria-label="Ferramentas e disciplinas">
              {project.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          )}
          {project.artstationUrl && (
            <a className="text-link" href={project.artstationUrl} target="_blank" rel="noreferrer">
              Ver projeto completo no ArtStation <Arrow />
            </a>
          )}
        </div>
      </figcaption>
    </figure>
  );
}

function Lightbox({ items, index, onChange, onClose }) {
  const dialogRef = useRef(null);
  const project = items[index];

  useEffect(() => {
    const opener = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector(".lightbox__close")?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      if (opener instanceof HTMLElement) opener.focus();
    };
  }, []);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onChange(-1);
      if (event.key === "ArrowRight") onChange(1);
      if (event.key === "Tab") {
        const focusable = [...dialogRef.current.querySelectorAll("button, a[href]")];
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onChange, onClose]);

  return (
    <div
      className="lightbox"
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <button className="lightbox__close" type="button" onClick={onClose} aria-label="Fechar galeria">
        Fechar <span aria-hidden="true">×</span>
      </button>
      <button className="lightbox__nav lightbox__nav--prev" type="button" onClick={() => onChange(-1)} aria-label="Projeto anterior">
        ←
      </button>
      <LightboxFigure key={project.title} project={project} />
      <span className="lightbox__counter" aria-live="polite">
        {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
      </span>
      <button className="lightbox__nav lightbox__nav--next" type="button" onClick={() => onChange(1)} aria-label="Próximo projeto">
        →
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------------------------- */
function Work({ filter, setFilter, items, onOpen }) {
  const tilt = (event) => {
    if (prefersReducedMotion()) return;
    const card = event.target.closest?.(".project");
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    card.style.setProperty("--tilt-x", `${(0.5 - y) * 2.2}deg`);
    card.style.setProperty("--tilt-y", `${(x - 0.5) * 2.2}deg`);
    card.style.setProperty("--shine-x", `${x * 100}%`);
    card.style.setProperty("--shine-y", `${y * 100}%`);
  };
  const untilt = (event) => {
    const card = event.target.closest?.(".project");
    if (!card || card.contains(event.relatedTarget)) return;  // still inside the same card
    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
  };

  return (
    <section className="work section" id="trabalhos" aria-labelledby="work-title">
      <div className="section__head reveal">
        <div>
          <span className="section__index">/ 01</span>
          <h2 id="work-title">Trabalhos selecionados</h2>
        </div>
        <p>
          Uma galeria curada entre trabalhos profissionais, ambientes em tempo real, level design e escultura digital.
          Clique em uma imagem para ampliar.
        </p>
      </div>

      <div className="filters reveal" role="group" aria-label="Filtrar trabalhos">
        {filters.map(({ key, label }) => {
          const count = key === "all" ? projects.length : projects.filter((p) => p.categories.includes(key)).length;
          return (
            <button key={key} type="button" aria-pressed={filter === key} onClick={() => setFilter(key)}>
              {label} <small>{String(count).padStart(2, "0")}</small>
            </button>
          );
        })}
      </div>

      <p className="sr-only" role="status">
        {items.length} {items.length === 1 ? "trabalho exibido" : "trabalhos exibidos"}
      </p>
      <div
        className={`project-grid ${filter === "all" ? "is-editorial" : "is-uniform"}`}
        onPointerMove={tilt}
        onPointerOut={untilt}
      >
        {items.map((project, index) => (
          <button
            type="button"
            className={`project reveal${filter === "all" && project.layout ? ` project--${project.layout}` : ""}`}
            key={`${filter}-${project.title}`}
            onClick={() => onOpen("work", index)}
            aria-label={`${project.title}, ampliar imagem na galeria`}
            style={{ "--reveal-delay": `${(index % 2) * 110}ms`, "--ratio": project.ratio }}
          >
            <img src={project.image} alt={project.alt} loading="lazy" decoding="async" />
            <span className="project__shade" />
            <span className="project__shine" aria-hidden="true" />
            <span className="project__number">{String(curated.indexOf(project) + 1).padStart(2, "0")}</span>
            {project.images?.length > 1 && <span className="project__count">{project.images.length} imagens</span>}
            <span className="project__copy">
              <small>{project.subtitle}</small>
              <strong>{project.title}</strong>
            </span>
            <span className="project__open" aria-hidden="true">
              ＋
            </span>
          </button>
        ))}
      </div>

      <Recent items={recent} onOpen={(index) => onOpen("recent", index)} />

      <a className="text-link reveal" href="#contato">
        Gostou do trabalho? Vamos conversar <Arrow />
      </a>
    </section>
  );
}

function Recent({ items, onOpen }) {
  if (!items.length) return null;
  const updated = syncedAt ? new Date(syncedAt).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" }) : null;

  return (
    <div className="recent reveal">
      <div className="recent__head">
        <div>
          <h3>Novidades no ArtStation</h3>
          <p>
            Projetos recentes do meu perfil, com todas as imagens de cada um.
            {updated && <> Atualizado em {updated}.</>}
          </p>
        </div>
        <a className="text-link" href={profileUrl} target="_blank" rel="noreferrer">
          Ver perfil completo <Arrow />
        </a>
      </div>
      <div className="recent__grid">
        {items.map((project, index) => (
          <button
            type="button"
            className="recent-card"
            key={project.title}
            onClick={() => onOpen(index)}
            aria-label={`${project.title}, ver as ${project.images.length} imagens do projeto`}
          >
            <img src={project.image} alt={project.alt} loading="lazy" decoding="async" />
            <span className="recent-card__meta">
              <small>
                {project.subtitle.replace("ArtStation · ", "")} · {project.images.length} imagens
              </small>
              <strong>{project.title}</strong>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------------------------- */
function About() {
  return (
    <section className="about section" id="sobre" aria-labelledby="about-title">
      <div className="about__intro reveal">
        <span className="section__index">/ 02</span>
        <p className="about__kicker">O que eu faço</p>
        <h2 id="about-title">
          Entre a forma e a função,
          <em>eu construo presença.</em>
        </h2>
        <p className="about__body">
          Sou Jonatas Araújo, artista 3D focado em transformar ideias em espaços, personagens e cenas que convidam o olhar
          a permanecer. Meu processo une sensibilidade visual e lógica de produção, da primeira massa cinza ao render
          final.
        </p>
        <p className="about__body">
          Trabalho com environment art, level design e world building em Unity e Unreal Engine 5, em projetos nacionais e
          internacionais, do blockout e da criação de assets até a montagem de cenas e a otimização de performance.
        </p>
        <a className="text-link" href={artstation} target="_blank" rel="noreferrer">
          Conheça meu ArtStation <Arrow />
        </a>
      </div>

      <div className="disciplines">
        {disciplines.map(([number, title, text]) => (
          <article className="reveal" key={title} style={{ "--reveal-delay": `${Number(number) * 70}ms` }}>
            <span>{number}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>

      <div className="toolkit reveal">
        <h3>Ferramentas e competências</h3>
        <dl>
          {toolkit.map(({ group, items }) => (
            <div key={group}>
              <dt>{group}</dt>
              <dd>
                <ul className="chips chips--light">
                  {items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------------------------- */
function Experience() {
  return (
    <section className="experience section" id="experiencia" aria-labelledby="experience-title">
      <div className="experience__head reveal">
        <span className="section__index">/ 03</span>
        <h2 id="experience-title">Trajetória</h2>
        <p>
          Do estágio em game design a projetos para clientes e estúdios: sempre perto do pipeline, da primeira ideia ao
          asset pronto para o jogo.
        </p>
        <a className="text-link" href="/cv/Curriculo-Jonatas-Araujo-PT-BR.pdf" target="_blank" rel="noreferrer">
          Baixar currículo <Arrow />
        </a>
      </div>

      <div className="experience__body">
        <ol className="timeline">
          {experience.map((item) => (
            <li className="reveal" key={item.place}>
              <span className="timeline__when">{item.when}</span>
              <h3>{item.role}</h3>
              <p className="timeline__place">{item.place}</p>
              <ul>
                {item.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <div className="experience__block reveal">
          <h3>Projetos freelance</h3>
          <div className="cards">
            {freelance.map((item) => (
              <article key={item.name}>
                <small>{item.role}</small>
                <h4>{item.name}</h4>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="experience__block reveal">
          <h3>Formação</h3>
          <div className="cards cards--two">
            {education.map((item) => (
              <article key={item.title}>
                <small>{item.note}</small>
                <h4>{item.title}</h4>
                <p>{item.place}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------------------------- */
function Contact() {
  const [sendStatus, setSendStatus] = useState("idle");

  const handleSubmit = async (event) => {
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
    <section className="contact section" id="contato" aria-labelledby="contact-title">
      <div className="contact__visual reveal">
        <img src="/profile/jonatas-araujo.webp" alt="Retrato profissional de Jonatas Araújo" width="900" height="1200" loading="lazy" />
        <span aria-hidden="true">EST. 2025</span>
      </div>
      <div className="contact__copy reveal" style={{ "--reveal-delay": "120ms" }}>
        <span className="section__index">/ 04</span>
        <p>Tem uma ideia, um mundo ou uma cena para construir?</p>
        <h2 id="contact-title">Vamos criar algo que mereça ser explorado.</h2>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="contact-form__row">
            <label>
              <span>Nome</span>
              <input type="text" name="name" autoComplete="name" placeholder="Como posso chamar você?" required />
            </label>
            <label>
              <span>E-mail</span>
              <input type="email" name="email" autoComplete="email" placeholder="seuemail@exemplo.com" required />
            </label>
          </div>
          <label>
            <span>Mensagem</span>
            <textarea name="message" rows="5" placeholder="Conte um pouco sobre a ideia, projeto ou oportunidade." required />
          </label>
          <input className="contact-form__honey" type="text" name="_honey" tabIndex="-1" autoComplete="off" aria-hidden="true" />
          <div className="contact-form__footer">
            <button className="button button--primary" type="submit" disabled={sendStatus === "sending"}>
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
            <a className="button button--outline" href="/cv/Curriculo-Jonatas-Araujo-PT-BR.pdf" target="_blank" rel="noreferrer">
              Currículo PT-BR <Arrow />
            </a>
            <a className="button button--outline" href="/cv/Jonatas-Araujo-English-CV.pdf" target="_blank" rel="noreferrer">
              English CV <Arrow />
            </a>
            <a className="button button--outline" href={artstation} target="_blank" rel="noreferrer">
              ArtStation <Arrow />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------------------------- */
export default function Home() {
  const rootRef = useRef(null);
  const [filter, setFilter] = useState("all");
  const [box, setBox] = useState(null); // { list: "work" | "recent", index }
  const active = useScrollSpy(navLinks.map(([id]) => id));

  const items = useMemo(
    () => (filter === "all" ? curated : curated.filter((project) => project.categories.includes(filter))),
    [filter],
  );
  const boxItems = box?.list === "recent" ? recent : items;

  useScrollEffects(rootRef);
  useReveal(rootRef, [filter]);

  const openBox = useCallback((list, index) => setBox({ list, index }), []);
  const changeProject = useCallback(
    (direction) =>
      setBox((current) => {
        const length = (current.list === "recent" ? recent : items).length;
        return { ...current, index: (current.index + direction + length) % length };
      }),
    [items],
  );
  const closeLightbox = useCallback(() => setBox(null), []);

  return (
    <div className="site-shell" ref={rootRef}>
      <a className="skip-link" href="#conteudo">
        Ir para o conteúdo
      </a>
      <div className="cursor-aura" aria-hidden="true" />
      <Header active={active} />

      <main id="conteudo" tabIndex="-1">
        <Hero />
        <Work filter={filter} setFilter={setFilter} items={items} onOpen={openBox} />
        <About />
        <Experience />

        <section className="statement" aria-label="Manifesto">
          <div className="statement__track" aria-hidden="true">
            MODEL · DESIGN · LIGHT · TELL STORIES · MODEL · DESIGN · LIGHT · TELL STORIES ·
          </div>
        </section>

        <Contact />
      </main>

      <footer>
        <a className="brand" href="#top">
          <img src="/jax-made-logo.webp" alt="" width="42" height="42" />
          <span>
            JAX MADE <b>3D</b>
          </span>
        </a>
        <p>© {new Date().getFullYear()} Jonatas Araújo. Todos os direitos reservados.</p>
        <div>
          <a href={artstation} target="_blank" rel="noreferrer">
            ArtStation
          </a>
          <a href="#contato">Contato</a>
          <a href="#top">Voltar ao topo ↑</a>
        </div>
      </footer>

      {box && boxItems[box.index] && (
        <Lightbox items={boxItems} index={box.index} onChange={changeProject} onClose={closeLightbox} />
      )}
    </div>
  );
}
