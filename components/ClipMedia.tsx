"use client";

import { useEffect, useRef } from "react";
import type { Clip } from "@/lib/posts";

/** Una grabación sola en el hueco de una imagen, ya compuesta sobre su fondo.
 *  Corre solo mientras se ve; sin movimiento se queda en su portada. */
export function ClipMedia({ clip, alt }: { clip: Clip; alt: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? video.play().catch(() => {}) : video.pause()), { threshold: 0.25 });
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <div className="media">
      <video ref={ref} src={clip.src} poster={clip.poster} muted loop playsInline preload="metadata" aria-label={alt} />
    </div>
  );
}
