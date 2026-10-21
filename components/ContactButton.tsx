"use client";

import { useEffect, useRef, useState } from "react";

/** El botón de Contacto de la barra: copia el correo y dice "Copiado" un momento.
 *  Sin permiso de portapapeles, abre el correo como antes. */
export function ContactButton({ email, label, copied }: { email: string; label: string; copied: string }) {
  const [done, setDone] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <a
      className="btn primary"
      href={`mailto:${email}`}
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
        timer.current = window.setTimeout(() => setDone(false), 1800);
      }}
    >
      {done ? copied : label}
      <span className="sr-only" aria-live="polite">
        {done ? email : ""}
      </span>
    </a>
  );
}
