"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/** Scroll con inercia en toda la web. Desactivado con prefers-reduced-motion. */
export function SmoothScroll() {
  const lenis = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    lenis.current = new Lenis({
      lerp: 0.085, // cuánto "resbala": más bajo = más inercia
      smoothWheel: true,
      anchors: { offset: -80 },
      allowNestedScroll: true, // el carrusel horizontal conserva su scroll propio
      stopInertiaOnNavigate: true,
      autoRaf: true,
    });
    return () => {
      lenis.current?.destroy();
      lenis.current = null;
    };
  }, []);

  // Al cambiar de página, arriba del todo sin arrastrar la inercia anterior.
  useEffect(() => {
    lenis.current?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return null;
}
