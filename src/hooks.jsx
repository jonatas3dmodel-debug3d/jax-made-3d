import { useEffect, useRef, useState } from "react";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Fades `.reveal` elements in once they reach the viewport. Pass `deps` that change when new `.reveal` nodes mount. */
export function useReveal(rootRef, deps = []) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const items = root.querySelectorAll(".reveal:not(.is-visible)");

    if (!("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.13, rootMargin: "0px 0px -7% 0px" },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * Page-level motion: scroll progress, hero parallax, header state and the cursor glow.
 *
 * Performance rules (measured: writing CSS variables on the page root made the browser restyle the whole page on every
 * scroll and mouse move, ~half of all main-thread time):
 * - values go straight to the element that uses them (inline transform / variables scoped to the hero);
 * - everything is coalesced to one update per frame;
 * - the hero parallax stops when the hero is off screen; layout is measured once, not read on every scroll.
 */
export function useScrollEffects(rootRef) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const reduced = prefersReducedMotion();
    const topbar = root.querySelector(".topbar");
    const progress = root.querySelector(".topbar__progress");
    const hero = root.querySelector(".hero");
    const aura = root.querySelector(".cursor-aura");

    let scrollable = 0;
    let heroVisible = true;
    let scrollFrame = 0;
    let pointerFrame = 0;
    let pointer = null;

    const measure = () => {
      scrollable = document.documentElement.scrollHeight - window.innerHeight;
    };
    measure();
    const sizeObserver = "ResizeObserver" in window ? new ResizeObserver(measure) : null;
    sizeObserver?.observe(document.body);

    const heroObserver = hero && "IntersectionObserver" in window
      ? new IntersectionObserver(([entry]) => { heroVisible = entry.isIntersecting; })
      : null;
    if (hero) heroObserver?.observe(hero);

    const raf = requestAnimationFrame(() => root.classList.add("is-loaded"));

    const onScroll = () => {
      if (scrollFrame) return;
      scrollFrame = requestAnimationFrame(() => {
        scrollFrame = 0;
        const y = window.scrollY;
        if (progress) progress.style.transform = `scaleX(${scrollable > 0 ? Math.min(1, y / scrollable).toFixed(4) : 0})`;
        if (heroVisible && hero) hero.style.setProperty("--hero-scroll", `${Math.min(y * 0.12, 90)}px`);
        topbar?.classList.toggle("is-scrolled", y > 32);
      });
    };

    const onPointer = (event) => {
      if (reduced) return;
      pointer = event;
      if (pointerFrame) return;
      pointerFrame = requestAnimationFrame(() => {
        pointerFrame = 0;
        const { clientX, clientY } = pointer;
        if (aura) aura.style.transform = `translate3d(${clientX}px, ${clientY}px, 0) translate(-50%, -50%)`;
        if (heroVisible && hero) {
          hero.style.setProperty("--hero-x", `${(clientX / window.innerWidth - 0.5) * -18}px`);
          hero.style.setProperty("--hero-y", `${(clientY / window.innerHeight - 0.5) * -12}px`);
        }
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(scrollFrame);
      cancelAnimationFrame(pointerFrame);
      sizeObserver?.disconnect();
      heroObserver?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
    };
  }, [rootRef]);
}

/** Pauses the endless animations of a section while it is off screen (they kept repainting for nothing). */
export function usePauseOffscreen(rootRef, selector) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !("IntersectionObserver" in window)) return undefined;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.toggleAttribute("data-paused", !entry.isIntersecting));
    });
    root.querySelectorAll(selector).forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [rootRef, selector]);
}

/** Returns the id of the section currently crossing the middle of the viewport. */
export function useScrollSpy(ids) {
  const [active, setActive] = useState(null);
  const key = ids.join("|");

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return undefined;
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
        if (window.scrollY < 200) setActive(null);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return active;
}

/** Counts from 0 to `value` the first time it is visible. Shows the final value at once with reduced motion. */
export function CountUp({ value, suffix = "" }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(() => (prefersReducedMotion() ? value : 0));

  useEffect(() => {
    const node = ref.current;
    if (!node || shown === value) return undefined;
    if (!("IntersectionObserver" in window)) {
      setShown(value);
      return undefined;
    }

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const duration = 1100;
        const tick = (now) => {
          const t = Math.min((now - start) / duration, 1);
          setShown(Math.round(value * (1 - Math.pow(1 - t, 3))));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <span ref={ref}>
      <span className="sr-only">
        {value}
        {suffix}
      </span>
      <span aria-hidden="true">
        {shown}
        {suffix}
      </span>
    </span>
  );
}
