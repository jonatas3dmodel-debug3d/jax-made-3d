import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { copy } from "./copy.js";

const STORAGE_KEY = "jax-lang";
const LangContext = createContext(null);

/** Ordem: ?lang=pt|en na URL, escolha salva, idioma preferido do navegador (português → pt; qualquer outro → en). */
function detectLanguage() {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get("lang");
    if (fromUrl === "pt" || fromUrl === "en") return fromUrl;
  } catch {
    /* sem URL legível */
  }
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "pt" || saved === "en") return saved;
  } catch {
    /* armazenamento bloqueado (navegação privada etc.) */
  }
  try {
    const preferred = (navigator.languages?.length ? navigator.languages[0] : navigator.language) ?? "";
    return preferred.toLowerCase().startsWith("pt") ? "pt" : "en";
  } catch {
    return "pt";
  }
}

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(detectLanguage);

  // Mantém o documento coerente com o idioma exibido: tradutores automáticos e leitores de tela dependem disso.
  useEffect(() => {
    const text = copy[lang];
    document.documentElement.lang = text.htmlLang;
    document.title = text.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", text.meta.description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", text.meta.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", text.meta.description);
  }, [lang]);

  const setLang = useCallback((next) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignora */
    }
  }, []);

  const value = useMemo(() => ({ lang, setLang, t: copy[lang] }), [lang, setLang]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const value = useContext(LangContext);
  if (!value) throw new Error("useLang precisa estar dentro de <LangProvider>");
  return value;
}
