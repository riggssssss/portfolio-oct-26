"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ComponentProps } from "react";

/** Telón: las dos páginas existen a la vez y un borde limpio las divide.
 *  Abrir un case study lo sube desde abajo; volver al feed es lo mismo al revés:
 *  el case study se retira hacia abajo y su imagen grande baja con él. */

let settle: (() => void) | null = null;
let revealTimer: ReturnType<typeof setTimeout> | undefined;

export function CurtainLink({ href, ...rest }: ComponentProps<typeof Link> & { href: string }) {
  const router = useRouter();
  return (
    <Link
      href={href}
      {...rest}
      onNavigate={(e) => {
        if (!document.startViewTransition || settle || href === location.pathname) return;
        e.preventDefault();
        const root = document.documentElement;
        const dir = href === "/" ? "down" : "up";
        root.dataset.curtain = dir;
        // El parallax de la página nueva dura más que el telón: va en su propio atributo.
        clearTimeout(revealTimer);
        root.dataset.reveal = dir;
        revealTimer = setTimeout(() => delete root.dataset.reveal, 1750); // dura lo que la imagen más lenta (1.6s)
        // La página que se va mueve su capa (la columna del feed o la imagen grande);
        // su recorte necesita saber dónde está para seguir el borde del telón al píxel.
        const layer = document.querySelector(dir === "up" ? ".layout:not(.cs) > .main" : ".cs-hero")?.getBoundingClientRect();
        root.style.setProperty("--vt-y", `${layer ? layer.top : 0}px`);
        root.style.setProperty("--vt-h", `${innerHeight}px`);
        const vt = document.startViewTransition(
          () =>
            new Promise<void>((resolve) => {
              const done = () => {
                clearTimeout(timer);
                settle = null;
                resolve();
              };
              const timer = setTimeout(done, 2500);
              settle = done;
              router.push(href);
            }),
        );
        vt.finished.finally(() => delete root.dataset.curtain);
      }}
    />
  );
}

/** Suelta el telón cuando la página nueva ya está en el DOM. Va en el layout raíz. */
export function Curtain() {
  const pathname = usePathname();
  useEffect(() => {
    settle?.();
  }, [pathname]);
  return null;
}
