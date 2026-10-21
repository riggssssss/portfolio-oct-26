"use client";

import { useEffect, useRef } from "react";

/** Mide la luminosidad de la esquina inferior derecha y la marca en el .media
 *  padre (data-bg), para que la flecha de hover contraste: blanca o negra. */
export function AutoBgImg({ src, alt, priority }: { src: string; alt: string; priority?: boolean }) {
  const ref = useRef<HTMLImageElement>(null);

  const measure = () => {
    const img = ref.current;
    const box = img?.closest<HTMLElement>(".media");
    if (!img || !box || box.dataset.bg) return;
    try {
      const size = 24;
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = size;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      ctx.drawImage(img, w * 0.75, h * 0.75, w * 0.25, h * 0.25, 0, 0, size, size);
      const d = ctx.getImageData(0, 0, size, size).data;
      let sum = 0;
      for (let i = 0; i < d.length; i += 4) sum += 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
      box.dataset.bg = sum / (size * size) < 140 ? "dark" : "light";
    } catch {
      /* imagen de otro origen sin CORS: se queda la flecha negra por defecto */
    }
  };

  useEffect(() => {
    if (ref.current?.complete) measure();
  }, []);

  // eslint-disable-next-line @next/next/no-img-element
  return <img ref={ref} src={src} alt={alt} loading={priority ? "eager" : "lazy"} onLoad={measure} />;
}
