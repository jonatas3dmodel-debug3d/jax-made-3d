// Contador de visitantes. Cada navegador é contado uma única vez (a marca fica no localStorage) e nenhum dado pessoal é enviado:
// só o pedido de "+1" ao serviço público Abacus (https://jasoncameron.dev/abacus), que guarda apenas o número.
// Se o serviço não responder, o contador simplesmente não aparece: a página nunca depende dele.
// Para trocar de serviço (ou de contador próprio), basta mexer neste arquivo: o resto do site só chama loadVisitors().
const service = "https://abacus.jasoncameron.dev";
const counter = "jax-made-3d-vercel-app/visitors";
const COUNTED = "jax-counted";
const TIMEOUT_MS = 6000;

const isDevelopment = () => ["localhost", "127.0.0.1", "[::1]"].includes(window.location.hostname);
const isRobot = () => navigator.webdriver === true || /bot|crawl|spider|headless|lighthouse|preview/i.test(navigator.userAgent);

/** Dono do site: abra o site uma vez com ?contador=off para o seu navegador deixar de contar (?contador=on desfaz). */
function ownerOptOut() {
  try {
    const flag = new URLSearchParams(window.location.search).get("contador");
    if (flag === "off") window.localStorage.setItem("jax-nocount", "1");
    if (flag === "on") window.localStorage.removeItem("jax-nocount");
    return window.localStorage.getItem("jax-nocount") === "1";
  } catch {
    return false;
  }
}

/** Só conta quem consegue guardar a marca "já contado"; sem isso (armazenamento bloqueado) cada abertura viraria +1. */
function canRemember() {
  try {
    window.localStorage.setItem("jax-probe", "1");
    const works = window.localStorage.getItem("jax-probe") === "1";
    window.localStorage.removeItem("jax-probe");
    return works;
  } catch {
    return false;
  }
}

function markCounted() {
  try {
    window.localStorage.setItem(COUNTED, String(Date.now()));
  } catch {
    /* já foi contado; no máximo conta de novo numa próxima visita */
  }
}

function alreadyCounted() {
  try {
    return window.localStorage.getItem(COUNTED) !== null;
  } catch {
    return true;
  }
}

async function call(action) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(`${service}/${action}/${counter}`, { signal: controller.signal });
    if (!response.ok) return null;
    const { value } = await response.json();
    return Number.isSafeInteger(value) && value >= 0 ? value : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

let pending;

/** Resolve com o total de visitantes, ou null se não foi possível saber. Uma única chamada por carregamento da página. */
export function loadVisitors() {
  if (!pending) {
    const countsThisVisit = !isDevelopment() && !isRobot() && !ownerOptOut() && !alreadyCounted() && canRemember();
    pending = (async () => {
      if (countsThisVisit) {
        const total = await call("hit");
        if (total !== null) markCounted();
        return total;
      }
      return call("get");
    })();
  }
  return pending;
}
