"use client";

import { useEffect, useRef } from "react";
import type { Stage } from "@/lib/posts";

/** Escena de producto: una foto de fondo y, encima, la web en su ventana y el
 *  móvil en primer plano, los dos grabados de verdad. Sin móvil, la web va sola
 *  y centrada. Los vídeos solo corren
 *  mientras la escena se ve; sin movimiento se quedan en su primer fotograma. */
export function StageMedia({ stage, alt }: { stage: Stage; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = ref.current;
    if (!box || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const videos = box.querySelectorAll("video");
    const io = new IntersectionObserver(
      ([e]) => videos.forEach((v) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause())),
      { threshold: 0.25 },
    );
    io.observe(box);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={stage.phone ? "media stage" : "media stage solo"} role="img" aria-label={alt}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="stage-bg" src={stage.bg} alt="" loading="lazy" />
      <div className="stage-web" style={stage.web.ratio ? { aspectRatio: stage.web.ratio } : undefined}>
        <video src={stage.web.src} poster={stage.web.poster} muted loop playsInline preload="metadata" aria-hidden="true" />
      </div>
      {stage.phone && (
        <div className="stage-phone">
          <video src={stage.phone.src} poster={stage.phone.poster} muted loop playsInline preload="metadata" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}
