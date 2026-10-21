// TODO: contenido de ejemplo. Cada case study, fecha, métrica e imagen de este
// archivo es un placeholder y tiene que sustituirse por trabajo real.
// Las métricas van entre [corchetes] a propósito: no inventar resultados.

/** Figuras de Hairline: las seis primeras dibujadas para este portfolio con la skill
 *  hairline-create (en /public/hairline), las tres últimas del paquete npm. */
export type HairlineName = "copies" | "layers" | "matches" | "scan" | "seat" | "drawers" | "slow" | "plot" | "terrain";

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
};

/** `ratio`: ancho / alto del vídeo, si no es el de la galería (1440 / 932). */
export type Clip = { src: string; poster: string; ratio?: number };
/** Sin `phone`, la web va sola y centrada. */
export type Stage = { bg: string; web: Clip; phone?: Clip };

/** Gráfica de líneas simulada, antes / con el proyecto: cada línea es una serie de
 *  alturas (0 a 1) repartidas a lo ancho, con su cifra al final. Es ilustrativa: la
 *  escala no es real, cuenta la diferencia. */
export type Chart = { before: { value: string; line: number[] }; after: { value: string; line: number[] } };

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
  /** Como `points`: si alguna cifra trae `figure` o `chart`, las cifras se muestran como fila. */
  stats?: { value: string; label: string; figure?: HairlineName; chart?: Chart }[];
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
      "A mockup is only useful if it looks like yours. I designed and built Mockp, a free gallery with an editor that places your design in seconds, respecting light, shadow and layers.",
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
        heading: "A good mockup cost you money or time",
        body: [
          "Presenting a design should be the easiest step, but it ended up being the one that cost me the most. And always for the same three reasons.",
        ],
        points: [
          { title: "Paying to try", text: "You paid before knowing whether it would fit your visual identity, and often it was the same one everybody else used.", figure: "copies" },
          { title: "Hours in Photoshop", text: "Scene, shadow, device, screen and glare: every layer built by hand, for every mockup.", figure: "layers" },
          { title: "Single use", text: "Each mockup served one piece. For the next one, back to square one.", figure: "matches" },
        ],
      },
      {
        id: "idea",
        title: "The idea",
        heading: "A Pinterest-style gallery of free mockups",
        body: [
          "Mockp gathers free mockups for anyone, in a format everybody already knows how to use: browse and pick.",
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
        gallery: [
          { kind: "editor", tone: "light", alt: "1. Chroma area detected", figure: "scan" },
          { kind: "editor-done", tone: "light", alt: "2. Your design, with light and shadow", figure: "seat" },
          { kind: "masonry", tone: "mid", alt: "3. Ready to use whenever you want", figure: "drawers" },
        ],
      },
      {
        id: "results",
        title: "Results",
        heading: "A unique mockup, ready before Photoshop opens",
        body: ["And the mockup is ready to use whenever you want."],
        // Gráficas simuladas (petición del usuario). Las cifras de "antes" son estimaciones
        // por confirmar: ~1 h montando un mockup a mano, 15–40 € uno de pago, 1 a mano.
        stats: [
          // Tiempo acumulado mockup a mockup: a mano sube en diagonal; con Mockp, casi plano.
          {
            value: "10 s",
            label: "to get your mockup",
            chart: {
              before: { value: "~1 h", line: [0, 0.2, 0.4, 0.6, 0.8, 1] },
              after: { value: "10 s", line: [0, 0.01, 0.02, 0.03, 0.04, 0.05] },
            },
          },
          // Coste acumulado: cada mockup de pago suma; con Mockp se queda en cero.
          {
            value: "€0",
            label: "for anyone",
            chart: {
              before: { value: "€15–40", line: [0, 0.22, 0.38, 0.62, 0.8, 1] },
              after: { value: "€0", line: [0, 0, 0, 0, 0, 0] },
            },
          },
          // Mockups a mano con el tiempo: de uno en uno, o la galería entera desde el principio.
          {
            value: "+150",
            label: "mockups in the gallery",
            chart: {
              before: { value: "1", line: [0, 0.02, 0.04, 0.06, 0.08, 0.1] },
              after: { value: "+150", line: [0, 0.82, 0.88, 0.93, 0.97, 1] },
            },
          },
        ],
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
