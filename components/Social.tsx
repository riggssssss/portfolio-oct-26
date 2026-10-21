"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, Share } from "./Icons";

export function ShareButton({ slug, title }: { slug: string; title: string }) {
  const [done, setDone] = useState(false);
  const onClick = async () => {
    const url = `${window.location.origin}/posts/${slug}`;
    try {
      if (navigator.share && matchMedia("(pointer: coarse)").matches) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setDone(true);
      setTimeout(() => setDone(false), 1800);
    } catch {
      /* cancelado por el usuario o sin permiso de portapapeles */
    }
  };
  return (
    <button className="icon-action" onClick={onClick} aria-label={done ? "Link copied" : "Share"} title="Share">
      {done ? <Check strokeWidth={1.25} /> : <Share strokeWidth={1.25} />}
      <span className="copied" data-on={done || undefined} aria-live="polite">
        {done ? "Link copied" : ""}
      </span>
    </button>
  );
}

/** El correo, tal cual. Encima de él el cursor se convierte en una pastilla que dice
 *  "Copy"; al pulsar se hunde, se ensancha y "Copied" entra desde abajo. La pastilla vive en <body> (un ancestro con transform la
 *  descolocaría). En táctil no hay cursor: se toca y se copia. */
type CopyText = { copy: string; copied: string; copyAria: string; copiedLive: string };
const COPY_EN: CopyText = { copy: "Copy", copied: "Copied", copyAria: "Copy email address", copiedLive: "Email address copied" };

export function CopyEmail({ email, className, t = COPY_EN }: { email: string; className?: string; t?: CopyText }) {
  const tag = useRef<HTMLSpanElement>(null);
  const pill = useRef<HTMLSpanElement>(null);
  const at = useRef("0px 0px");
  const timer = useRef(0);
  const [over, setOver] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => () => clearTimeout(timer.current), []);

  // El ancho de cada estado, medido una vez, para que la pastilla crezca en vez de saltar.
  useLayoutEffect(() => {
    const el = pill.current;
    if (!over || !el) return;
    const [copy, copied] = el.querySelectorAll<HTMLElement>(".tag-label");
    el.style.setProperty("--w-copy", `${copy.offsetWidth}px`);
    el.style.setProperty("--w-done", `${copied.offsetWidth}px`);
  }, [over]);

  const follow = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    at.current = `${e.clientX}px ${e.clientY}px`;
    if (tag.current) tag.current.style.translate = at.current;
    setOver(true);
  };

  return (
    <button
      className={className ? `copy-email ${className}` : "copy-email"}
      data-done={done || undefined}
      aria-label={`${t.copyAria}, ${email}`}
      onPointerEnter={follow}
      onPointerMove={follow}
      onPointerLeave={() => setOver(false)}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(email);
        } catch {
          window.location.href = `mailto:${email}`;
          return;
        }
        pill.current?.animate([{ scale: 1 }, { scale: 0.86 }, { scale: 1.04 }, { scale: 1 }], {
          duration: 420,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        });
        setDone(true);
        clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setDone(false), 1800);
      }}
    >
      {email}
      {over &&
        createPortal(
          <span
            ref={tag}
            className="cursor-tag"
            data-done={done || undefined}
            style={{ translate: at.current }}
            aria-hidden="true"
          >
            <span ref={pill} className="tag-pill">
              <span className="tag-label">{t.copy}</span>
              <span className="tag-label">{t.copied}</span>
            </span>
          </span>,
          document.body,
        )}
      <span className="sr-only" aria-live="polite">
        {done ? t.copiedLive : ""}
      </span>
    </button>
  );
}
