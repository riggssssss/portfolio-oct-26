"use client";

import { useRouter } from "next/navigation";
import { LANG_COOKIE, type Lang } from "@/lib/i18n";

/** EN / ES en la columna izquierda, con la voz del índice: gris claro y el idioma
 *  activo en tinta. La elección se guarda en una cookie y la página se vuelve a
 *  pintar en el servidor, ya traducida. */
export function LangSwitch({ lang, label, className }: { lang: Lang; label: string; className?: string }) {
  const router = useRouter();
  const choose = (next: Lang) => {
    if (next === lang) return;
    document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    // LangTransition hace salir los textos que se traducen y dice cuánto tarda; la
    // traducción se pide al terminar, para que entre sobre el hueco ya limpio.
    const out = new CustomEvent("lang:out", { detail: { wait: 0, to: next } });
    dispatchEvent(out);
    setTimeout(() => router.refresh(), out.detail.wait);
  };
  return (
    <div className={className ? `lang ${className}` : "lang"} role="group" aria-label={label}>
      <button type="button" lang="en" aria-pressed={lang === "en"} onClick={() => choose("en")}>
        EN
      </button>
      <span aria-hidden="true">/</span>
      <button type="button" lang="es" aria-pressed={lang === "es"} onClick={() => choose("es")}>
        ES
      </button>
    </div>
  );
}
