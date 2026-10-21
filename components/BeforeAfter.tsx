"use client";

import { useEffect, useRef, useState } from "react";
import type { Chart } from "@/lib/posts";
import css from "./BeforeAfter.module.css";

/** Gráfica de líneas simulada, antes / con el proyecto, en el mismo panel que las
 *  figuras: la línea de antes en gris, la del proyecto en tinta, cada una con su
 *  punto final, su cifra y el nombre de la serie. Se dibujan de izquierda a derecha
 *  la primera vez que el panel entra en pantalla. Sus estilos viajan con el
 *  componente (CSS module), no dependen de la hoja global. */
export function BeforeAfter({ chart, labels, alt }: { chart: Chart; labels: { before: string; after: string }; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Coordenadas en un lienzo de 100 × 100 que se estira al plot (el trazo no se deforma).
  const path = (line: number[]) =>
    line.map((y, i) => `${i ? "L" : "M"}${(i / (line.length - 1)) * 100} ${100 - y * 100}`).join(" ");
  const series = [
    { key: "before" as const, name: labels.before, ...chart.before },
    { key: "after" as const, name: labels.after, ...chart.after },
  ];

  return (
    <div ref={ref} className={shown ? `${css.chart} ${css.shown}` : css.chart} role="img" aria-label={alt}>
      <div className={css.plot} aria-hidden="true">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
          {series.map((s) => (
            <path
              key={s.key}
              className={`${css.line} ${css[s.key]}`}
              d={path(s.line)}
              fill="none"
              stroke={s.key === "after" ? "#272724" : "#b2b2ac"}
              strokeWidth={1.5}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
        {series.map((s) => {
          const y = { "--y": s.line[s.line.length - 1] } as React.CSSProperties;
          return [
            <span key={`${s.key}-dot`} className={`${css.dot} ${css[s.key]}`} style={y} />,
            <span key={`${s.key}-end`} className={`${css.end} ${css[s.key]}`} style={y}>
              <span className={css.value}>{s.value}</span>
              <span className={css.name}>{s.name}</span>
            </span>,
          ];
        })}
      </div>
    </div>
  );
}
