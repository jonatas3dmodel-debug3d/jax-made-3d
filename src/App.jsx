import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { profileUrl, syncedAt } from "./artstation.js";
import { languages } from "./copy.js";
import { artstation, email, filterKeys, stats, whatsapp } from "./data.js";
import { buildGallery } from "./gallery.js";
import { CountUp, prefersReducedMotion, usePauseOffscreen, useReveal, useScrollEffects, useScrollSpy } from "./hooks.jsx";
import { LangProvider, useLang } from "./i18n.jsx";

const contactEndpoint = `https://formsubmit.co/ajax/${email}`;
const sectionIds = ["trabalhos", "sobre", "experiencia", "contato"];
const navKeys = { trabalhos: "work", sobre: "about", experiencia: "experience", contato: "contact" };
const cvPt = "/cv/Curriculo-Jonatas-Araujo-PT-BR.pdf";
const cvEn = "/cv/Jonatas-Araujo-English-CV.pdf";

const cvFor = (t) => (t.htmlLang === "en" ? cvEn : cvPt);
const whatsappLink = (text) => `https://wa.me/${whatsapp.number}?text=${encodeURIComponent(text)}`;

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function WhatsAppIcon() {
  return (
    <svg className="icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path d="M12 2.4a9.6 9.6 0 0 0-8.3 14.4L2.4 21.6l4.9-1.3A9.6 9.6 0 1 0 12 2.4Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M8.7 7.7c.2-.4.5-.4.8-.4l.5.5.8 1.8-.6.9c.7 1.4 1.9 2.5 3.4 3.1l.9-.9 1.8.9c.1.3.1.6 0 .9-.2.6-1 1.2-1.8 1.1-3.2-.5-6.1-3.3-6.6-6.5 0-.5.1-1 .3-1.4Z" fill="currentColor" />
    </svg>
  );
}

/* -------------------------------------------------------------------------------------------- */
function LangSwitch() {
  const { lang, setLang, t } = useLang();
  return (
    <div className="lang" role="group" aria-label={t.lang.label} translate="no">
      {languages.map((code) => (
        <button key={code} type="button" lang={code} aria-pressed={lang === code} aria-label={t.lang[code]} onClick={() => setLang(code)}>
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

function Header({ active }) {
  const { t } = useLang();
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
      <a className="brand" href="#top" aria-label={t.nav.brand} onClick={close}>
        <img src="/jax-made-logo.webp" alt="" width="42" height="42" />
        <span translate="no">
          JAX MADE <b>3D</b>
        </span>
      </a>

      <nav id="menu" className="topbar__nav" aria-label={t.nav.label}>
        {sectionIds.map((id) => (
          <a key={id} href={`#${id}`} aria-current={active === id ? "true" : undefined} onClick={close}>
            {t.nav[navKeys[id]]}
          </a>
        ))}
        <a href={artstation} target="_blank" rel="noreferrer" onClick={close}>
          {t.nav.artstation} <Arrow />
        </a>
        <a className="button button--primary topbar__nav-cta" href="#contato" onClick={close}>
          {t.nav.cta} <Arrow />
        </a>
      </nav>

      <div className="topbar__actions">
        <LangSwitch />
        <a className="button button--primary button--small topbar__cta" href="#contato">
          {t.nav.cta}
        </a>
        <button
          className="topbar__burger"
          type="button"
          aria-expanded={open}
          aria-controls="menu"
          aria-label={open ? t.nav.close : t.nav.open}
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
  const { t } = useLang();
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero__media">
        <img className="hero__image" src="/work/environment-night.webp" alt={t.hero.imageAlt} width="1325" height="894" fetchPriority="high" decoding="async" />
      </div>
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
          <i /> {t.hero.eyebrow}
        </div>
        <h1 id="hero-title">
          {t.hero.line1}
          <span>{t.hero.line2}</span>
        </h1>
        <p>{t.hero.text}</p>
        <div className="hero__actions">
          <a className="button button--primary" href="#trabalhos">
            {t.hero.explore} <span aria-hidden="true">↓</span>
          </a>
          <a className="button button--glass" href="#contato">
            {t.hero.contact} <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>

      <div className="hero__bar">
        <ul className="hero__stats" aria-label={t.hero.summary}>
          {stats.map((stat, index) => (
            <li key={index}>
              <strong translate="no">
                <CountUp value={stat.value} suffix={stat.years ? t.hero.years : ""} />
              </strong>
              <span>{t.hero.stats[index]}</span>
            </li>
          ))}
        </ul>
        <p className="availability">
          <i /> {t.hero.available}
        </p>
      </div>

      <div className="hero__mark" aria-hidden="true">
        JAX / 3D
      </div>
      <a className="hero__scroll" href="#trabalhos" aria-label={t.hero.scrollLabel}>
        <span>{t.hero.scroll}</span>
        <i aria-hidden="true" />
      </a>
    </section>
  );
}

/* -------------------------------------------------------------------------------------------- */
function LightboxFigure({ project }) {
  const { t } = useLang();
  const [current, setCurrent] = useState(0);
  const images = project.images;
  const shown = images[current] ?? images[0];
  const many = images.length > 1;

  return (
    <figure className="lightbox__figure">
      {many ? (
        <button type="button" className="lightbox__stage" onClick={() => setCurrent((value) => (value + 1) % images.length)} aria-label={t.lightbox.stage(current + 1, images.length)}>
          <img src={shown.src} srcSet={shown.srcSet} sizes="(max-width: 1240px) 100vw, 1240px" alt={shown.alt} />
        </button>
      ) : (
        <img className="lightbox__single" src={shown.src} srcSet={shown.srcSet} sizes="(max-width: 1240px) 100vw, 1240px" alt={shown.alt} />
      )}
      {many && (
        <ul className="lightbox__thumbs" aria-label={t.lightbox.thumbs}>
          {images.map((image, index) => (
            <li key={image.src}>
              <button type="button" aria-label={t.lightbox.thumb(index + 1, images.length)} aria-current={index === current ? "true" : undefined} onClick={() => setCurrent(index)}>
                <img src={image.thumb} alt="" loading="lazy" decoding="async" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <figcaption>
        <div>
          <small>{project.subtitle}</small>
          <h2 id="lightbox-title" translate="no">
            {project.title}
          </h2>
          <p>{project.description}</p>
          {project.tags?.length > 0 && (
            <ul className="chips" aria-label={t.lightbox.tags}>
              {project.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          )}
          {project.notes && (
            <div className="lightbox__notes">
              <span>{t.lightbox.notes}</span>
              <p>{project.notes}</p>
            </div>
          )}
          {project.artstationUrl && (
            <a className="text-link" href={project.artstationUrl} target="_blank" rel="noreferrer">
              {t.lightbox.artstation} <Arrow />
            </a>
          )}
        </div>
      </figcaption>
    </figure>
  );
}

function Lightbox({ items, index, onChange, onClose }) {
  const { t } = useLang();
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
      <button className="lightbox__close" type="button" onClick={onClose} aria-label={t.lightbox.closeLabel}>
        {t.lightbox.close} <span aria-hidden="true">×</span>
      </button>
      <button className="lightbox__nav lightbox__nav--prev" type="button" onClick={() => onChange(-1)} aria-label={t.lightbox.prev}>
        ←
      </button>
      <LightboxFigure key={project.key} project={project} />
      <span className="lightbox__counter" aria-live="polite">
        {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
      </span>
      <button className="lightbox__nav lightbox__nav--next" type="button" onClick={() => onChange(1)} aria-label={t.lightbox.next}>
        →
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------------------------- */
function Work({ filter, setFilter, curated, items, recent, onOpen }) {
  const { t } = useLang();

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
    if (!card || card.contains(event.relatedTarget)) return;
    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
  };

  return (
    <section className="work section" id="trabalhos" aria-labelledby="work-title">
      <div className="section__head reveal">
        <div>
          <span className="section__index">/ 01</span>
          <h2 id="work-title">{t.work.title}</h2>
        </div>
        <p>{t.work.text}</p>
      </div>

      <div className="filters reveal" role="group" aria-label={t.work.filterLabel}>
        {filterKeys.map((key) => {
          const count = key === "all" ? curated.length : curated.filter((p) => p.categories.includes(key)).length;
          return (
            <button key={key} type="button" aria-pressed={filter === key} onClick={() => setFilter(key)}>
              {t.work.filters[key]} <small>{String(count).padStart(2, "0")}</small>
            </button>
          );
        })}
      </div>

      <p className="sr-only" role="status">
        {t.work.shown(items.length)}
      </p>
      <div className={`project-grid ${filter === "all" ? "is-editorial" : "is-uniform"}`} onPointerMove={tilt} onPointerOut={untilt}>
        {items.map((project, index) => {
          const wide = filter === "all" && project.layout === "wide";
          return (
            <button
              type="button"
              className={`project reveal${wide ? " project--wide" : ""}`}
              key={`${filter}-${project.key}`}
              onClick={() => onOpen("work", index)}
              aria-label={t.work.open(project.title)}
              style={{ "--reveal-delay": `${(index % 2) * 110}ms` }}
            >
              <img
                src={project.cover.src}
                srcSet={project.cover.srcSet}
                sizes={wide ? "(max-width: 1280px) 100vw, 1230px" : "(max-width: 900px) 100vw, 615px"}
                width={project.cover.width}
                height={project.cover.height}
                alt={project.cover.alt}
                loading="lazy"
                decoding="async"
              />
              <span className="project__shade" />
              <span className="project__shine" aria-hidden="true" />
              <span className="project__number">{String(curated.indexOf(project) + 1).padStart(2, "0")}</span>
              {project.images.length > 1 && <span className="project__count">{t.work.images(project.images.length)}</span>}
              <span className="project__copy">
                <small>{project.subtitle}</small>
                <strong translate="no">{project.title}</strong>
              </span>
              <span className="project__open" aria-hidden="true">
                ＋
              </span>
            </button>
          );
        })}
      </div>

      <Recent items={recent} onOpen={(index) => onOpen("recent", index)} />

      <a className="text-link reveal" href="#contato">
        {t.work.cta} <Arrow />
      </a>
    </section>
  );
}

function Recent({ items, onOpen }) {
  const { lang, t } = useLang();
  if (!items.length) return null;
  const updated = syncedAt
    ? new Date(syncedAt).toLocaleDateString(lang === "pt" ? "pt-BR" : "en-US", { day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <div className="recent reveal">
      <div className="recent__head">
        <div>
          <h3>{t.recent.title}</h3>
          <p>
            {t.recent.text} {updated && t.recent.updated(updated)}
          </p>
        </div>
        <a className="text-link" href={profileUrl} target="_blank" rel="noreferrer">
          {t.recent.profile} <Arrow />
        </a>
      </div>
      <div className="recent__grid">
        {items.map((project, index) => (
          <button type="button" className="recent-card" key={project.key} onClick={() => onOpen(index)} aria-label={t.recent.card(project.title, project.images.length)}>
            <img src={project.cover.src} alt={project.cover.alt} loading="lazy" decoding="async" />
            <span className="recent-card__meta">
              <small>
                {project.subtitle.replace("ArtStation · ", "")} · {t.work.images(project.images.length)}
              </small>
              <strong translate="no">{project.title}</strong>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------------------------- */
function About() {
  const { t } = useLang();
  return (
    <section className="about section" id="sobre" aria-labelledby="about-title">
      <div className="about__intro reveal">
        <span className="section__index">/ 02</span>
        <p className="about__kicker">{t.about.kicker}</p>
        <h2 id="about-title">
          {t.about.h2a}
          <em>{t.about.h2b}</em>
        </h2>
        <p className="about__body">{t.about.body1}</p>
        <p className="about__body">{t.about.body2}</p>
        <a className="text-link" href={artstation} target="_blank" rel="noreferrer">
          {t.about.link} <Arrow />
        </a>
      </div>

      <div className="disciplines">
        {t.about.disciplines.map(([number, title, text]) => (
          <article className="reveal" key={number} style={{ "--reveal-delay": `${Number(number) * 70}ms` }}>
            <span>{number}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>

      <div className="toolkit reveal">
        <h3>{t.about.toolkitTitle}</h3>
        <dl>
          {t.about.toolkit.map(({ group, items }) => (
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
  const { t } = useLang();
  const e = t.experience;
  return (
    <section className="experience section" id="experiencia" aria-labelledby="experience-title">
      <div className="experience__head reveal">
        <span className="section__index">/ 03</span>
        <h2 id="experience-title">{e.title}</h2>
        <p>{e.text}</p>
        <a className="text-link" href={cvFor(t)} target="_blank" rel="noreferrer">
          {e.resume} <Arrow />
        </a>
      </div>

      <div className="experience__body">
        <ol className="timeline">
          {e.items.map((item) => (
            <li className="reveal" key={item.place}>
              <span className="timeline__when">{item.when}</span>
              <h3>{item.role}</h3>
              <p className="timeline__place" translate="no">
                {item.place}
              </p>
              <ul>
                {item.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <div className="experience__block reveal">
          <h3>{e.freelanceTitle}</h3>
          <div className="cards">
            {e.freelance.map((item) => (
              <article key={item.name}>
                <small>{item.role}</small>
                <h4 translate="no">{item.name}</h4>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="experience__block reveal">
          <h3>{e.educationTitle}</h3>
          <div className="cards cards--two">
            {e.education.map((item) => (
              <article key={item.title}>
                <small>{item.note}</small>
                <h4>{item.title}</h4>
                <p translate="no">{item.place}</p>
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
  const { t } = useLang();
  const c = t.contact;
  const [sendStatus, setSendStatus] = useState("idle");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    formData.append("_subject", c.subject);
    formData.append("_template", "table");
    formData.append("_captcha", "false");
    formData.append("_url", window.location.href);

    setSendStatus("sending");

    try {
      const response = await fetch(contactEndpoint, { method: "POST", body: formData, headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error("send failed");
      form.reset();
      setSendStatus("success");
    } catch {
      setSendStatus("error");
    }
  };

  return (
    <section className="contact section" id="contato" aria-labelledby="contact-title">
      <div className="contact__visual reveal">
        <img src="/profile/jonatas-araujo.webp" alt={c.portrait} width="900" height="1200" loading="lazy" />
        <span aria-hidden="true">EST. 2025</span>
      </div>
      <div className="contact__copy reveal" style={{ "--reveal-delay": "120ms" }}>
        <span className="section__index">/ 04</span>
        <p>{c.pre}</p>
        <h2 id="contact-title">{c.h2}</h2>

        <div className="contact__quick">
          <span className="contact__quick-label">{c.quickLabel}</span>
          <div className="contact__quick-row">
            <a className="button button--whatsapp" href={whatsappLink(c.whatsappText)} target="_blank" rel="noreferrer">
              <WhatsAppIcon /> {c.whatsapp} <Arrow />
            </a>
            <span className="contact__number" translate="no">
              {whatsapp.display}
            </span>
          </div>
          <span className="contact__or">{c.or}</span>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="contact-form__row">
            <label>
              <span>{c.name}</span>
              <input type="text" name="name" autoComplete="name" placeholder={c.namePh} required />
            </label>
            <label>
              <span>{c.email}</span>
              <input type="email" name="email" autoComplete="email" placeholder={c.emailPh} required />
            </label>
          </div>
          <label>
            <span>{c.message}</span>
            <textarea name="message" rows="5" placeholder={c.messagePh} required />
          </label>
          <input className="contact-form__honey" type="text" name="_honey" tabIndex="-1" autoComplete="off" aria-hidden="true" />
          <div className="contact-form__footer">
            <button className="button button--primary" type="submit" disabled={sendStatus === "sending"}>
              {sendStatus === "sending" ? c.sending : c.send} <Arrow />
            </button>
            <p className={`contact-form__status contact-form__status--${sendStatus}`} role="status">
              {sendStatus === "success" && c.ok}
              {sendStatus === "error" && c.fail}
            </p>
          </div>
        </form>

        <div className="contact__resources">
          <span>{c.resources}</span>
          <div className="contact__actions">
            <a className="button button--outline" href={cvPt} target="_blank" rel="noreferrer">
              {c.cvPt} <Arrow />
            </a>
            <a className="button button--outline" href={cvEn} target="_blank" rel="noreferrer">
              {c.cvEn} <Arrow />
            </a>
            <a className="button button--outline" href={artstation} target="_blank" rel="noreferrer">
              {c.artstation} <Arrow />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------------------------- */
function Footer() {
  const { t } = useLang();
  return (
    <footer>
      <a className="brand" href="#top">
        <img src="/jax-made-logo.webp" alt="" width="42" height="42" />
        <span translate="no">
          JAX MADE <b>3D</b>
        </span>
      </a>
      <p>{t.footer.rights(new Date().getFullYear())}</p>
      <div>
        <a href={whatsappLink(t.contact.whatsappText)} target="_blank" rel="noreferrer">
          {t.footer.whatsapp}
        </a>
        <a href={artstation} target="_blank" rel="noreferrer">
          ArtStation
        </a>
        <a href="#contato">{t.footer.contact}</a>
        <a href="#top">{t.footer.top}</a>
      </div>
    </footer>
  );
}

/* -------------------------------------------------------------------------------------------- */
function Home() {
  const { lang, t } = useLang();
  const rootRef = useRef(null);
  const [filter, setFilter] = useState("all");
  const [box, setBox] = useState(null); // { list: "work" | "recent", index }
  const active = useScrollSpy(sectionIds, lang);

  const gallery = useMemo(() => buildGallery(lang), [lang]);
  const items = useMemo(
    () => (filter === "all" ? gallery.curated : gallery.curated.filter((project) => project.categories.includes(filter))),
    [gallery, filter],
  );
  const boxItems = box?.list === "recent" ? gallery.recent : items;

  useScrollEffects(rootRef, lang);
  usePauseOffscreen(rootRef, ".hero, .statement, .contact", lang);
  useReveal(rootRef, [filter, lang]);

  const openBox = useCallback((list, index) => setBox({ list, index }), []);
  const changeProject = useCallback(
    (direction) =>
      setBox((current) => {
        const length = (current.list === "recent" ? gallery.recent : items).length;
        return { ...current, index: (current.index + direction + length) % length };
      }),
    [gallery, items],
  );
  const closeLightbox = useCallback(() => setBox(null), []);

  return (
    <div className="site-shell" ref={rootRef}>
      <a className="skip-link" href="#conteudo">
        {t.skip}
      </a>
      <div className="cursor-aura" aria-hidden="true" />

      {/* keyed by language: React remounts the page instead of patching text nodes (safe with browser auto-translate) */}
      <div className="site-content" key={lang}>
        <Header active={active} />

        <main id="conteudo" tabIndex="-1">
          <Hero />
          <Work filter={filter} setFilter={setFilter} curated={gallery.curated} items={items} recent={gallery.recent} onOpen={openBox} />
          <About />
          <Experience />

          <section className="statement" aria-label="Manifesto">
            <div className="statement__track" aria-hidden="true">
              MODEL · DESIGN · LIGHT · TELL STORIES · MODEL · DESIGN · LIGHT · TELL STORIES ·
            </div>
          </section>

          <Contact />
        </main>

        <Footer />
      </div>

      {box && boxItems[box.index] && <Lightbox items={boxItems} index={box.index} onChange={changeProject} onClose={closeLightbox} />}
    </div>
  );
}

export default function App() {
  return (
    <LangProvider>
      <Home />
    </LangProvider>
  );
}
