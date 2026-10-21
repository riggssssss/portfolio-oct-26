"use client";

import { useEffect, useRef, useState } from "react";
import type { Media as MediaT } from "@/lib/posts";
import { Media } from "./Media";
import css from "./Steps.module.css";

/** La grabación y, debajo, sus capítulos como el índice lateral: solo títulos, en
 *  gris; el que se está viendo, en tinta. Cada uno empieza en `at` (segundos):
 *  pulsarlo lleva el vídeo a ese momento. */
export function Steps({ media, steps }: { media: MediaT; steps: { title: string; at: number }[] }) {
  const box = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0); // el primero empieza en 0: siempre hay uno activo

  useEffect(() => {
    const video = box.current?.querySelector("video");
    if (!video) return;
    // Corre solo mientras se ve; con movimiento reducido se queda en su portada.
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? video.play().catch(() => {}) : video.pause()), { threshold: 0.25 });
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) io.observe(video);
    const update = () => {
      let i = -1;
      steps.forEach((st, k) => video.currentTime >= st.at && (i = k));
      setActive(i);
    };
    video.addEventListener("timeupdate", update);
    video.addEventListener("seeked", update);
    return () => {
      io.disconnect();
      video.removeEventListener("timeupdate", update);
      video.removeEventListener("seeked", update);
    };
  }, [steps]);

  const go = (i: number) => {
    const video = box.current?.querySelector("video");
    if (!video) return;
    video.currentTime = steps[i].at;
    video.play().catch(() => {});
  };

  return (
    <div ref={box} className={css.steps}>
      {media.video ? (
        <video
          className={css.video}
          style={{ aspectRatio: media.video.ratio }}
          src={media.video.src}
          poster={media.video.poster}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={media.alt}
        />
      ) : (
        <Media media={media} />
      )}
      <ol className={css.list}>
        {steps.map((st, i) => (
          <li key={st.title}>
            <button type="button" className={css.step} aria-current={i === active ? "step" : undefined} onClick={() => go(i)}>
              {st.title}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
