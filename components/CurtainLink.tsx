"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ComponentProps } from "react";

/** Telón: las dos páginas existen a la vez y un borde limpio las divide.
 *  Abrir un case study lo sube desde abajo; volver al feed es lo mismo al revés:
 *  el case study se retira hacia abajo y su imagen grande baja con él. */

let settle: (() => void) | null = null;
let revealTimer: ReturnType<typeof setTimeout> | undefined;

export function CurtainLink({ href, prefetch = true, ...rest }: ComponentProps<typeof Link> & { href: string }) {
  const router = useRouter();
  return (
    <Link
      href={href}
      // Precarga completa: la página es dinámica (lee la cookie de idioma) y, sin sus
      // datos ya en caché, el telón se queda congelado esperando al servidor.
      prefetch={prefetch}
      {...rest}
      onNavigate={(e) => {
        if (!document.startViewTransition || settle || href === location.pathname) return;
        e.preventDefault();
        const root = document.documentElement;
        const dir = href === "/" ? "down" : "up";
        root.dataset.curtain = dir;
        // El parallax de la página nueva va en su propio atributo: se quita después del telón.
        clearTimeout(revealTimer);
        root.dataset.reveal = dir;
        revealTimer = setTimeout(() => delete root.dataset.reveal, 1750); // ya acabado (0.9s) y con el telón fuera
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
              // Si la página tarda demasiado, no se anima la vieja (eso es el
              // parpadeo): se suelta el telón sin animación y la nueva entra al llegar.
              const timer = setTimeout(() => {
                vt.skipTransition();
                done();
              }, 1200);
              settle = done;
              router.push(href);
            }),
        );
        vt.ready.catch(() => {});
        vt.updateCallbackDone.catch(() => {});
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
