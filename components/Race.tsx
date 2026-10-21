"use client";

import { useEffect, useRef, useState } from "react";
import type { Race as RaceT } from "@/lib/posts";
import type { Lang } from "@/lib/i18n";
import css from "./Race.module.css";

/** Dos relojes que arrancan cuando el panel entra en pantalla y corren en tiempo
 *  real: el rápido llena su barra en `fast.seconds` y se marca con un check; el lento,
 *  sin cifra, apenas ha avanzado. Todo se para a los `fast.seconds`. Se pausan fuera
 *  de pantalla. Con
 *  movimiento reducido se muestra el momento en que el rápido termina. */
export function Race({ race, lang, replay }: { race: RaceT; lang: Lang; replay: string }) {
  const { fast, slow } = race;
  const root = useRef<HTMLDivElement>(null);
  const clock = useRef<HTMLParagraphElement>(null);
  const fastBar = useRef<HTMLSpanElement>(null);
  const slowBar = useRef<HTMLSpanElement>(null);
  const fastTime = useRef<HTMLSpanElement>(null);
  const elapsed = useRef(0);
  const [done, setDone] = useState(false);
  const [run, setRun] = useState(0); // cambia al repetir: reinicia el bucle

  const dec = lang === "es" ? "," : ".";
  const secs = (t: number) => `${t.toFixed(1).replace(".", dec)} s`;
  const stopwatch = (t: number) => {
    const m = Math.floor(t / 60);
    const s = t - m * 60;
    return `${m}:${s < 10 ? "0" : ""}${s.toFixed(1).replace(".", dec)}`;
  };

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const paint = (t: number) => {
      // El cronómetro es el del rápido: se para en su cifra mientras el lento sigue.
      clock.current!.textContent = stopwatch(Math.min(t, fast.seconds));
      fastBar.current!.style.transform = `scaleX(${Math.min(t / fast.seconds, 1)})`;
      slowBar.current!.style.transform = `scaleX(${Math.min(t / slow.seconds, 1)})`;
      if (t < fast.seconds) fastTime.current!.textContent = secs(t);
    };

    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elapsed.current = fast.seconds;
      paint(fast.seconds);
      setDone(true);
      return;
    }

    elapsed.current = 0;
    paint(0);
    let raf = 0;
    let last = 0;
    let finished = false;
    const tick = (now: number) => {
      // Un salto largo (pestaña oculta) no cuenta: el reloj solo corre a la vista.
      elapsed.current += Math.min(now - (last || now), 100) / 1000;
      last = now;
      // Todo termina a los `fast.seconds`: el cronómetro y las dos barras se quedan ahí.
      const t = Math.min(elapsed.current, fast.seconds);
      paint(t);
      if (t < fast.seconds) raf = requestAnimationFrame(tick);
      else if (!finished) {
        finished = true;
        setDone(true);
      }
    };
    const io = new IntersectionObserver(
      ([e]) => {
        cancelAnimationFrame(raf);
        last = 0;
        if (e.isIntersecting) raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run, fast.seconds, slow.seconds, lang]);

  return (
    <figure className={css.figure}>
      <div ref={root} className={done ? `${css.race} ${css.done}` : css.race}>
        <p className="sr-only">{`${fast.label}: ${fast.text}. ${slow.label}: ${slow.text}.`}</p>
        <div className={css.top} aria-hidden="true">
          <p ref={clock} className={`${css.clock} num`}>
            0:00{dec}0
          </p>
          <button
            type="button"
            className={css.replay}
            tabIndex={done ? 0 : -1}
            onClick={() => {
              setDone(false);
              setRun((r) => r + 1);
            }}
          >
            {replay}
          </button>
        </div>
        <ul className={css.lanes} aria-hidden="true">
          <li className={`${css.lane} ${css.fast}`}>
            <span className={css.name}>{fast.label}</span>
            <span className={`${css.status} num`}>
              <span ref={fastTime} className={css.running}>
                {secs(0)}
              </span>
              <span className={css.ready}>
                <svg className={css.check} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4.5 10.5l3.5 3.5 7.5-8" pathLength={1} />
                </svg>
                {fast.text}
              </span>
            </span>
            <span className={css.track}>
              <span ref={fastBar} className={css.bar} />
            </span>
          </li>
          <li className={`${css.lane} ${css.slow}`}>
            <span className={css.name}>{slow.label}</span>
            <span className={css.status}>{slow.text}</span>
            <span className={css.track}>
              <span ref={slowBar} className={css.bar} />
            </span>
          </li>
        </ul>
      </div>
      <figcaption className={css.caption}>{race.caption}</figcaption>
    </figure>
  );
}
