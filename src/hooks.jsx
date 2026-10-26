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

/** Page-level motion: scroll progress, hero parallax, header state and the cursor glow. */
export function useScrollEffects(rootRef) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const reduced = prefersReducedMotion();
    const topbar = root.querySelector(".topbar");
    let frame = 0;

    const raf = requestAnimationFrame(() => root.classList.add("is-loaded"));

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        root.style.setProperty("--scroll-progress", (scrollable > 0 ? scrollTop / scrollable : 0).toFixed(4));
        root.style.setProperty("--hero-scroll", `${Math.min(scrollTop * 0.12, 90)}px`);
        topbar?.classList.toggle("is-scrolled", scrollTop > 32);
      });
    };

    const onPointer = (event) => {
      if (reduced) return;
      const x = event.clientX / window.innerWidth;
      const y = event.clientY / window.innerHeight;
      root.style.setProperty("--pointer-x", `${event.clientX}px`);
      root.style.setProperty("--pointer-y", `${event.clientY}px`);
      root.style.setProperty("--hero-x", `${(x - 0.5) * -18}px`);
      root.style.setProperty("--hero-y", `${(y - 0.5) * -12}px`);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
    };
  }, [rootRef]);
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
