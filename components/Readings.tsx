"use client";

import { useEffect, useRef } from "react";
import type { Section } from "@/lib/posts";
import type { UI } from "@/lib/i18n";

/** Lo que escribes, tal cual, en una barra como el campo de la app; al lado, lo que la app
 *  entiende de ello, como un razonamiento: un nodo por dato, de lo literal a lo que deduce,
 *  y la conclusión al final, con el nodo lleno. Al entrar cada fila en pantalla, los datos
 *  llegan uno tras otro; sin JS o sin movimiento, están todos desde el principio. */
export function Readings({ readings, t }: { readings: NonNullable<Section["readings"]>; t: UI }) {
  const ref = useRef<HTMLDivElement>(null);

  // Una burbuja de varias líneas se ajusta a la más larga, como un mensaje: CSS la deja tan
  // ancha como la columna aunque el texto salte antes.
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const fit = () =>
      root.querySelectorAll<HTMLElement>(".cs-said").forEach((el) => {
        el.style.width = "";
        const range = document.createRange();
        range.selectNodeContents(el);
        const lines = [...range.getClientRects()];
        if (lines.length < 2) return;
        const cs = getComputedStyle(el);
        const frame = ["paddingLeft", "paddingRight", "borderLeftWidth", "borderRightWidth"].reduce((n, k) => n + parseFloat(cs[k as "paddingLeft"]), 0);
        el.style.width = `${Math.ceil(Math.max(...lines.map((l) => l.width)) + frame)}px`;
      });
    const ro = new ResizeObserver(fit);
    ro.observe(root);
    return () => ro.disconnect();
  }, [readings]);

  useEffect(() => {
    const root = ref.current;
    if (!root || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    root.dataset.armed = "";
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("on");
          io.unobserve(e.target);
        }),
      { threshold: 0.4 },
    );
    // Cada fila nueva (otro texto, otro idioma) se vigila también.
    root.querySelectorAll(".cs-reading:not(.on)").forEach((row) => io.observe(row));
    return () => io.disconnect();
  }, [readings]);

  return (
    <div ref={ref} className="cs-readings">
      <p className="cs-readings-head" aria-hidden="true">
        <span>{t.youWrite}</span>
        <span>{t.itGets}</span>
      </p>
      <ul>
        {readings.map((r) => (
          <li key={r.said} className="cs-reading">
            <p className="cs-said">{r.said}</p>
            <ol className="cs-got" aria-label={t.itGets}>
              {r.got.map((g, i) => (
                <li key={g} style={{ "--i": i } as React.CSSProperties}>
                  {g}
                </li>
              ))}
            </ol>
          </li>
        ))}
      </ul>
    </div>
  );
}
