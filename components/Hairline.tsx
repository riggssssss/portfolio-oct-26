"use client";

import { useEffect, useRef } from "react";

/* Figuras de Hairline (github.com/lucasmarkes/hairline, MIT). Dos orígenes:
 * - las nuestras, dibujadas con la skill hairline-create: el motor y cada figura
 *   viven en /public/hairline y se montan igual que en su banco de pruebas;
 * - las del paquete npm, que se montan con su propia función. */

type Read = { textContent: string };
type Handle = { set: (v: number) => void; destroy: () => void };
type Figure = {
  name: string;
  means: string;
  range: [number, number, number];
  tour: ([number, number] | null)[] | null;
  mount: (ctx: { stage: HTMLElement; svg: SVGSVGElement; read: Read }, value: number) => Handle;
};
type Kernel = {
  inject: (root: Document) => void;
  mk: (tag: string, attrs: Record<string, string>, parent: Element) => SVGSVGElement;
  tour: (stage: HTMLElement, stops: Figure["tour"]) => { stop: () => void };
  LAP: Figure["tour"];
};
declare global {
  interface Window {
    HL?: Kernel;
    hairline?: (f: Figure) => void;
  }
}

const script = (src: string, module: boolean) =>
  new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    if (module) s.type = "module";
    s.onload = () => resolve();
    s.onerror = reject;
    document.head.append(s);
  });

let kernel: Promise<void> | null = null;
const figures = new Map<string, Promise<Figure>>();
const waiting = new Map<string, (f: Figure) => void>();

/** El motor una vez para toda la página; cada figura, una vez, se registra sola al cargar. */
function load(name: string) {
  let f = figures.get(name);
  if (!f) {
    kernel ??= window.HL ? Promise.resolve() : script("/hairline/kernel.js", false);
    window.hairline ??= (fig) => {
      waiting.get(fig.name)?.(fig);
      waiting.delete(fig.name);
    };
    f = kernel.then(
      () =>
        new Promise<Figure>((resolve) => {
          waiting.set(name, resolve);
          script(`/hairline/${name}.js`, true);
        }),
    );
    figures.set(name, f);
  }
  return f;
}

/** Figuras del propio paquete (@lucasmarkes/hairline), que trae su motor y su `play`. */
const PACKAGE = new Set(["plot", "slow", "terrain"]);

export function Hairline({ name, label }: { name: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let off = false;
    let cleanup = () => {};
    if (PACKAGE.has(name)) {
      import("@lucasmarkes/hairline").then((pkg) => {
        const stage = ref.current;
        const make = pkg[name as "plot" | "slow" | "terrain"];
        if (off || !stage) return;
        // `play`: recorre la figura sola mientras está a la vista, como las nuestras.
        const fig = make(stage, { label, play: true });
        cleanup = () => fig.destroy();
      });
      return () => {
        off = true;
        cleanup();
      };
    }
    load(name).then((fig) => {
      const stage = ref.current, HL = window.HL;
      if (off || !stage || !HL) return;
      HL.inject(document);
      const svg = HL.mk("svg", { viewBox: "0 0 400 320", "aria-hidden": "true" }, stage);
      const handle = fig.mount({ stage, svg, read: { textContent: "" } }, fig.range[1]);
      // Mientras está a la vista, una mano invisible recorre la figura; la de verdad tiene prioridad.
      let tour: { stop: () => void } | null = null;
      const io = new IntersectionObserver(([e]) => {
        if (e.isIntersecting && !tour) tour = HL.tour(stage, fig.tour ?? HL.LAP);
        else if (!e.isIntersecting && tour) {
          tour.stop();
          tour = null;
        }
      });
      io.observe(stage);
      cleanup = () => {
        io.disconnect();
        tour?.stop();
        handle.destroy();
        svg.remove();
      };
    });
    return () => {
      off = true;
      cleanup();
    };
  }, [name]);

  return <div ref={ref} className="hairline" data-hairline={name} role="img" aria-label={label} />;
}
