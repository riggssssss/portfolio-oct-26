// TODO: contenido de ejemplo. Cada case study, fecha, métrica e imagen de este
// archivo es un placeholder y tiene que sustituirse por trabajo real.
// Las métricas van entre [corchetes] a propósito: no inventar resultados.

/** Figuras de Hairline: las seis primeras dibujadas para este portfolio con la skill
 *  hairline-create (en /public/hairline), las tres últimas del paquete npm. */
export type HairlineName = "copies" | "photoshop" | "puzzle" | "pipeline" | "scan" | "seat" | "drawers" | "slow" | "plot" | "terrain";

export type MediaKind = "phone" | "desktop" | "components" | "flow" | "masonry" | "editor" | "editor-done";
export type Tone = "light" | "mid" | "dark";

export type Media = {
  kind: MediaKind;
  tone: Tone;
  alt: string;
  /** Ruta a una imagen real en /public. Si existe, sustituye al placeholder. */
  src?: string;
  /** Opcional: fuerza el color de la flecha de hover. Si falta, se mide la imagen. */
  bg?: "light" | "dark";
  /** Una figura de Hairline en vez de imagen. En una `gallery`, la convierte en fila de figuras. */
  figure?: HairlineName;
  /** Escena de producto: foto de fondo con la web y el móvil grabados encima. Sustituye a `src`. */
  stage?: Stage;
  /** Una grabación sola, sin escena ni fondo: la ventana tal cual. */
  video?: Clip;
};

/** `ratio`: ancho / alto del vídeo, si no es el de la galería (1440 / 932). */
export type Clip = { src: string; poster: string; ratio?: number };
/** Sin `phone`, la web va sola y centrada. */
export type Stage = { bg: string; web: Clip; phone?: Clip };

/** Carrera en tiempo real: dos relojes que arrancan al ver la sección. `fast` llena
 *  su barra en `seconds` y dice `text`; `slow` no tiene cifra (`text` lo describe) y
 *  su barra se llena en `seconds`, una escala interna que no se muestra. */
export type Race = {
  fast: { label: string; seconds: number; text: string };
  slow: { label: string; seconds: number; text: string };
  caption: string;
};

export type Section = {
  id: string;
  title: string;
  /** Titular de la sección: una frase que cuenta algo, no una etiqueta.
   *  `title` es la etiqueta corta del índice lateral. */
  heading?: string;
  body: string[];
  media?: Media;
  /** Miniaturas con pie bajo la imagen principal (o en su lugar). */
  gallery?: Media[];
  /** `figure`: una figura de Hairline de /public/hairline que lo ilustra. Si
   *  algún punto la tiene, los puntos se muestran como fila de figuras. */
  points?: { title: string; text: string; figure?: HairlineName }[];
  /** Como `points`: si alguna cifra trae `figure`, las cifras se muestran como fila. */
  stats?: { value: string; label: string; figure?: HairlineName }[];
  /** Capítulos de la grabación de `media` (ver `Steps`): `at`, el segundo en que empieza cada uno. */
  steps?: { title: string; at: number }[];
  /** Una carrera en tiempo real bajo el texto (ver `Race`). */
  race?: Race;
};

export type Post = {
  slug: string;
  date: string; // ISO
  title: string;
  caption: string;
  pinned?: boolean;
  example: boolean;
  meta: { role: string; team: string; duration: string; platform: string };
  /** Producto publicado: se muestra en la ficha del case study. */
  site?: { label: string; href: string };
  media: Media[];
  sections: Section[];
};

export const posts: Post[] = [
  {
    // Contenido real (contado por Adrián). Rol y +150 mockups confirmados; duración y fecha entre [corchetes] por confirmar.
    slug: "mockp",
    date: "2026-09-12",
    title: "A professional mockup in a matter of seconds",
    caption:
      "A mockup is only useful if it looks like yours. I designed and built Mockp, a free gallery with an editor that places your design in seconds, with all the realism it deserves.",
    pinned: true,
    example: false,
    meta: { role: "Product Design & Development", team: "Personal project", duration: "[X] months", platform: "Web" },
    site: { label: "mockp.com", href: "https://mockp.com" },
    media: [
      {
        kind: "editor",
        tone: "mid",
        src: "/img/mockp/editor.jpg",
        alt: "Mockp editor: a laptop on a wooden chair, next to the brightness, reflection and screen settings",
      },
    ],
    sections: [
      {
        id: "problem",
        title: "Problem",
        heading: "Finding the right mockup was harder than it looked",
        body: [
          "Presenting a design should be the easiest step, but it ended up being the one that cost me the most. And always for the same three reasons.",
        ],
        points: [
          { title: "Already seen", text: "The most popular mockups show up more and more often, which makes it hard for anything to feel unique.", figure: "copies" },
          { title: "Trial and error", text: "Setting each one up in Photoshop took several minutes, and the result often fell flat. Something faster was needed.", figure: "photoshop" },
          { title: "It didn't feel like me", text: "On their own, the free ones looked great, but when you put them together… Pinterest, though, knows what I like.", figure: "puzzle" },
        ],
      },
      {
        id: "idea",
        title: "The idea",
        heading: "A mockup gallery you browse like Pinterest",
        body: [
          "Mockp brings free mockups together in a Pinterest-style gallery. Seeing them side by side shows which ones suit your style, and you can try as many as you like until one feels right.",
        ],
        media: {
          kind: "masonry",
          tone: "light",
          alt: "The Pinterest-style gallery, on the web and on a phone",
          stage: {
            bg: "/img/mockp/gallery-bg-v6.jpg",
            web: { src: "/img/mockp/gallery-web-v2.mp4", poster: "/img/mockp/gallery-web.jpg" },
            phone: { src: "/img/mockp/gallery-mobile-v2.mp4", poster: "/img/mockp/gallery-mobile-v2.jpg" },
          },
        },
      },
      {
        id: "editor",
        title: "Editor",
        heading: "A built-in editor, made for this one job",
        body: [
          "Upload your design and the editor places it respecting masks, highlights and shadows. It feels real, as if you'd done it in your own Photoshop, but in a matter of seconds.",
        ],
        media: {
          kind: "editor-done",
          tone: "light",
          alt: "The Mockp editor: a design placed on a laptop, then the scene recoloured",
          stage: {
            bg: "/img/mockp/editor-bg-v5.jpg",
            web: { src: "/img/mockp/editor-web.mp4", poster: "/img/mockp/editor-web.jpg", ratio: 1440 / 1078 },
          },
        },
      },
      {
        id: "chroma",
        title: "How it works",
        heading: "All it takes: the area has to be chroma green",
        body: [
          "Every mockup marks the area to replace in chroma green. The editor detects it on its own: nothing to select, nothing to mask.",
        ],
        // La grabación del editor sola, sin fondo (petición del usuario).
        media: {
          kind: "editor",
          tone: "light",
          alt: "The Mockp editor: a template is imported and its chroma screen detected, then light and shadow are adjusted",
          video: { src: "/img/mockp/chroma-web.mp4", poster: "/img/mockp/chroma-web.jpg", ratio: 1440 / 896 },
        },
        // Capítulos del vídeo recortado (38 s): el primero desde el segundo 0 (siempre hay uno activo), los ajustes a los 17, Publish a los 29,5.
        steps: [
          { title: "Import the template and detect its chroma area", at: 0 },
          { title: "Adjust the screen's light and reflection", at: 17 },
          { title: "Save the mockup", at: 29.5 },
        ],
      },
      {
        id: "results",
        title: "Results",
        heading: "Presenting a design is the easy step again",
        body: [
          "Over 150 free mockups, and any of them is ready in ten seconds, without opening Photoshop or drawing a single mask.",
        ],
        // Tiempo real, sin cifras inventadas: Mockp tarda 10 s; Photoshop, "varios minutos"
        // (palabras de Adrián). Los 240 s de Photoshop solo fijan lo lento que avanza su barra.
        race: {
          fast: { label: "Mockp", seconds: 10, text: "Ready in 10 s" },
          slow: { label: "Photoshop", seconds: 240, text: "Several minutes" },
          caption: "Both clocks run in real time from the moment you reach this section.",
        },
      },
    ],
  },
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" })
    .format(new Date(iso + "T12:00:00"))
    .replace(".", "");
}
