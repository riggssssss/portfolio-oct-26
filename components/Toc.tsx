"use client";

import { useEffect, useState } from "react";

/** Índice del case study en la columna del perfil. La sección que se está
 *  leyendo pasa a tinta; el resto queda en gris claro, como cualquier enlace secundario. */
export function Toc({ items, label }: { items: { id: string; title: string }[]; label: string }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const els = items.map((it) => document.getElementById(it.id)).filter((el) => el !== null);
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = innerHeight * 0.4;
      let current: string | null = null;
      for (const el of els) if (el.getBoundingClientRect().top <= line) current = el.id;
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
    };
  }, [items]);

  return (
    <nav className="toc" aria-label={label}>
      <ul>
        {items.map((it) => (
          <li key={it.id}>
            <a href={`#${it.id}`} aria-current={active === it.id ? "location" : undefined}>
              {it.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
