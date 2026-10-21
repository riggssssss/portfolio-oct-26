"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { ui, type Lang } from "@/lib/i18n";
import { es } from "@/lib/posts.es";

/** Cambio de idioma como fundido cruzado, solo sobre los textos que se traducen:
 *  al pulsar, cada uno deja una copia exacta de sí mismo encima (un "fantasma");
 *  cuando llega la traducción, el fantasma se desvanece y se desenfoca mientras el
 *  texto nuevo se enfoca debajo, en el mismo sitio. Durante un instante las dos
 *  versiones se funden; nunca hay hueco ni desplazamiento. Lo que es igual en los
 *  dos idiomas (el nombre, las herramientas, el correo) no se mueve. Con movimiento
 *  reducido, el cambio es directo. */

const SKIP = "script, style, noscript, .sr-only, .lang, [data-lang-ghosts]";
const DURATION = 720; // ms del fundido
const EASE = "cubic-bezier(0.45, 0, 0.2, 1)";
const BLUR = "blur(5px)";
/** Propiedades que la copia necesita para quedar exactamente encima del original. */
const COPY = [
  "font-family",
  "font-size",
  "font-weight",
  "font-style",
  "line-height",
  "letter-spacing",
  "color",
  "text-align",
  "text-transform",
  "white-space",
  "text-wrap",
  "padding-top",
  "padding-right",
  "padding-bottom",
  "padding-left",
] as const;

/** Los textos que cambian al pasar a cada idioma (contenido y marco), según el
 *  sentido del cambio. Los que se escriben igual en los dos ("Web", "iOS") no
 *  cuentan: no tienen por qué moverse. */
const PAIRS = [
  ...Object.entries(es),
  ...(Object.keys(ui.en) as (keyof typeof ui.en)[]).map((k) => [ui.en[k], ui.es[k]] as const),
].filter(([a, b]) => a !== b);
const CHANGES: Record<Lang, Set<string>> = {
  es: new Set(PAIRS.map(([en]) => en)),
  en: new Set(PAIRS.map(([, es]) => es)),
};

/** El elemento que contiene un texto, si se ve y no es de las partes que se saltan. */
const holder = (n: Node): HTMLElement | null => {
  const el = n.nodeType === Node.TEXT_NODE ? n.parentElement : n;
  if (!(el instanceof HTMLElement) || !el.isConnected || el.closest(SKIP) || !el.textContent?.trim()) return null;
  const r = el.getBoundingClientRect();
  return r.width > 0 && r.bottom > 0 && r.top < innerHeight ? el : null;
};

/** Se queda con los de fuera: si un elemento y su contenedor están, cuenta el contenedor. */
const outermost = (els: Iterable<HTMLElement>) => {
  const list = [...new Set(els)];
  return list.filter((el) => !list.some((o) => o !== el && o.contains(el)));
};

/** Copia exacta de un elemento, fija en la pantalla justo encima de él, invisible hasta el fundido. */
function ghostOf(el: HTMLElement, layer: HTMLElement) {
  const r = el.getBoundingClientRect();
  const cs = getComputedStyle(el);
  const g = el.cloneNode(true) as HTMLElement;
  g.removeAttribute("id");
  g.querySelectorAll("[id]").forEach((n) => n.removeAttribute("id"));
  for (const p of COPY) g.style.setProperty(p, cs.getPropertyValue(p));
  Object.assign(g.style, {
    position: "fixed",
    left: `${r.left}px`,
    top: `${r.top}px`,
    width: `${r.width}px`,
    height: `${r.height}px`,
    margin: "0",
    display: "block",
    boxSizing: "border-box",
    opacity: "0",
  });
  layer.append(g);
  return g;
}

export function LangTransition({ lang }: { lang: Lang }) {
  const prev = useRef(lang);
  const watch = useRef<MutationObserver | null>(null);
  const records = useRef<MutationRecord[]>([]);
  const ghosts = useRef(new Map<HTMLElement, HTMLElement>());
  const layer = useRef<HTMLDivElement | null>(null);
  const cleanup = useRef(0);

  const clearGhosts = () => {
    clearTimeout(cleanup.current);
    layer.current?.remove();
    layer.current = null;
    ghosts.current.clear();
  };

  // Al pulsar EN / ES: un fantasma encima de cada texto que se va a traducir, y a
  // mirar qué textos reescribe la traducción. La traducción se pide enseguida.
  useEffect(() => {
    const onOut = (e: Event) => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const detail = (e as CustomEvent<{ wait: number; to: Lang }>).detail;
      const changes = CHANGES[detail?.to ?? "es"];
      clearGhosts();

      const leaving: HTMLElement[] = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const text = walker.currentNode.nodeValue?.trim();
        if (!text || !changes.has(text)) continue;
        const el = holder(walker.currentNode);
        if (el) leaving.push(el);
      }
      const targets = outermost(leaving);
      if (targets.length) {
        const l = document.createElement("div");
        l.dataset.langGhosts = "";
        l.setAttribute("aria-hidden", "true");
        Object.assign(l.style, { position: "fixed", inset: "0", zIndex: "60", pointerEvents: "none" });
        document.body.append(l);
        layer.current = l;
        for (const el of targets) ghosts.current.set(el, ghostOf(el, l));
        cleanup.current = window.setTimeout(clearGhosts, 4000); // por si la traducción no llega
      }
      if (detail) detail.wait = 0;

      watch.current?.disconnect();
      records.current = [];
      watch.current = new MutationObserver((list) => records.current.push(...list));
      watch.current.observe(document.body, { subtree: true, characterData: true, characterDataOldValue: true, childList: true });
    };
    addEventListener("lang:out", onOut);
    return () => removeEventListener("lang:out", onOut);
  }, []);

  // Llegó el idioma nuevo. Antes de pintar: los fantasmas (el texto viejo) se ven
  // y empiezan a irse; el texto nuevo, debajo, empieza a llegar. Se cruzan.
  useLayoutEffect(() => {
    if (prev.current === lang) return;
    prev.current = lang;
    const obs = watch.current;
    watch.current = null;
    const all = obs ? [...records.current, ...obs.takeRecords()] : [];
    records.current = [];
    obs?.disconnect();

    const arriving = new Set<HTMLElement>();
    ghosts.current.forEach((_, el) => {
      if (holder(el)) arriving.add(el);
    });
    for (const r of all) {
      if (r.type === "characterData") {
        if (r.oldValue === r.target.nodeValue) continue;
        const el = holder(r.target);
        if (el) arriving.add(el);
      }
      r.addedNodes.forEach((n) => {
        const el = holder(n);
        if (el) arriving.add(el);
      });
    }

    const animations: Animation[] = [];
    ghosts.current.forEach((g) => {
      g.style.opacity = "1";
      animations.push(
        g.animate([{ opacity: 1, filter: "blur(0)" }, { opacity: 0, filter: BLUR }], {
          duration: DURATION,
          easing: EASE,
          fill: "forwards",
        }),
      );
    });
    for (const el of outermost(arriving)) {
      animations.push(
        el.animate([{ opacity: 0, filter: BLUR }, { opacity: 1, filter: "blur(0)" }], {
          duration: DURATION,
          easing: EASE,
          fill: "backwards",
        }),
      );
    }
    clearTimeout(cleanup.current);
    cleanup.current = window.setTimeout(clearGhosts, DURATION + 50);
    return () => animations.forEach((a) => a.cancel());
  }, [lang]);

  useEffect(() => () => clearGhosts(), []);

  return null;
}
