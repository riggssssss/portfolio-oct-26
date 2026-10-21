"use client";

import { useEffect, useState } from "react";
import { ExArrow } from "./Icons";

/** La web del proyecto, abajo a la derecha del case study: aparece en cuanto se ha
 *  bajado un poco (la ficha de arriba ya la nombra) y se va al volver arriba. */
const AFTER = 240; // px de scroll a partir de los que se muestra

export function ProjectLink({ href, label }: { href: string; label: string }) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setShown(scrollY > AFTER);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <a
      className="text-link project-link"
      data-shown={shown || undefined}
      href={href}
      target="_blank"
      rel="noreferrer"
      tabIndex={shown ? undefined : -1}
      aria-hidden={shown ? undefined : true}
    >
      {label} <ExArrow />
    </a>
  );
}
