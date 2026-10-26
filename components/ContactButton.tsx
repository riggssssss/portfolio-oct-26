"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Check, Mail } from "./Icons";

/** El botón de Contacto de la barra: copia el correo y cambia a "Email copiado"
 *  con una transición suave: la pastilla se ensancha y la palabra nueva sube
 *  desde abajo saliendo de un desenfoque, como la pastilla de "Copy". Sin permiso
 *  de portapapeles, abre el correo. En móvil es solo el sobre, que pasa a un check. */
export function ContactButton({ email, label, copied }: { email: string; label: string; copied: string }) {
  const [done, setDone] = useState(false);
  const box = useRef<HTMLSpanElement>(null);
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);

  // El ancho de cada etiqueta, para que la pastilla crezca en vez de saltar.
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const [a, b] = el.querySelectorAll<HTMLElement>(".contact-label");
    el.style.setProperty("--w-idle", `${a.offsetWidth}px`);
    el.style.setProperty("--w-done", `${b.offsetWidth}px`);
  }, [label, copied]);

  return (
    <a
      className="btn primary contact-btn"
      href={`mailto:${email}`}
      aria-label={label}
      data-done={done || undefined}
      onClick={async (e) => {
        e.preventDefault();
        try {
          await navigator.clipboard.writeText(email);
        } catch {
          window.location.href = `mailto:${email}`;
          return;
        }
        setDone(true);
        clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setDone(false), 2000);
      }}
    >
      <span ref={box} className="contact-labels">
        <span className="contact-label">{label}</span>
        <span className="contact-label" aria-hidden={!done}>
          {copied}
        </span>
      </span>
      <span className="contact-icon" aria-hidden="true">
        <Mail />
        <Check />
      </span>
      <span className="sr-only" aria-live="polite">
        {done ? copied : ""}
      </span>
    </a>
  );
}
