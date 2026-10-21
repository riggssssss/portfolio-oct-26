import { es } from "./posts.es";

/** Idioma de la web: inglés por defecto, español al elegirlo en el selector EN / ES.
 *  La elección vive en la cookie `lang`, así que la página llega ya traducida. */
export type Lang = "en" | "es";
export const LANG_COOKIE = "lang";

/** Los textos del marco (botones, etiquetas, ayudas para lectores de pantalla). */
export const ui = {
  en: {
    skip: "Skip to content",
    posts: "Posts",
    caseStudy: "Case study",
    allPosts: "All posts",
    sections: "Sections",
    role: "Role",
    website: "Website",
    letsTalk: "Let’s talk",
    contactText: "Send me an email or copy the address.",
    sendEmail: "Send an email",
    next: "Next",
    nextPost: "Next post",
    contact: "Contact",
    view: "View",
    copy: "Copy",
    copied: "Copied",
    copyAria: "Copy email address",
    copiedLive: "Email address copied",
    basedIn: "Based in Valencia, Spain",
    tools: "Tools",
    links: "Links",
    breadcrumb: "Breadcrumb",
    role_: "Product designer & frontend developer",
    bio: "Product designer and frontend developer. I design and build digital products people understand at first glance and use without thinking.",
    replay: "Replay",
    of: "of",
    language: "Language",
    images: "images",
    notFoundTitle: "This post doesn’t exist.",
    notFoundText: "It may have been removed, or the link is wrong.",
    notFoundBack: "Back to the feed",
  },
  es: {
    skip: "Saltar al contenido",
    posts: "Publicaciones",
    caseStudy: "Caso de estudio",
    allPosts: "Volver",
    sections: "Secciones",
    role: "Rol",
    website: "Web",
    letsTalk: "Hablemos",
    contactText: "Escríbeme un email o copia la dirección.",
    sendEmail: "Enviar un email",
    next: "Siguiente",
    nextPost: "Siguiente publicación",
    contact: "Contacto",
    view: "Ver",
    copy: "Copiar",
    copied: "Copiado",
    copyAria: "Copiar la dirección de email",
    copiedLive: "Dirección copiada",
    basedIn: "Desde Valencia, España",
    tools: "Herramientas",
    links: "Enlaces",
    breadcrumb: "Ruta",
    role_: "Diseñador de producto y desarrollador frontend",
    bio: "Diseñador de producto y desarrollador frontend. Diseño y construyo productos digitales que se entienden a primera vista y se usan sin pensar.",
    replay: "Repetir",
    of: "de",
    language: "Idioma",
    images: "imágenes",
    notFoundTitle: "Esta publicación no existe.",
    notFoundText: "Puede que se haya eliminado o que el enlace esté mal.",
    notFoundBack: "Volver al feed",
  },
} satisfies Record<Lang, Record<string, string>>;

export type UI = (typeof ui)["en"];

/** Los campos de un post que son texto para leer; el resto (rutas, ids, tipos) no se toca. */
const TEXT = new Set(["title", "caption", "heading", "body", "text", "alt", "label", "value", "role", "team", "duration", "platform"]);

/** El post en el idioma pedido: cada texto se busca en la tabla inglés → español
 *  (lib/posts.es.ts); lo que no está, se queda como está. */
export function localize<T>(x: T, lang: Lang): T {
  if (lang === "en") return x;
  const walk = (v: unknown, key?: string): unknown => {
    if (typeof v === "string") return key && TEXT.has(key) ? (es[v] ?? v) : v;
    if (Array.isArray(v)) return v.map((item) => walk(item, key));
    if (v && typeof v === "object")
      return Object.fromEntries(Object.entries(v).map(([k, val]) => [k, walk(val, k)]));
    return v;
  };
  return walk(x) as T;
}
