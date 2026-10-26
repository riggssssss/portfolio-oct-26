// TODO: contenido de ejemplo. Cada case study, fecha, métrica e imagen de este
// archivo es un placeholder y tiene que sustituirse por trabajo real.
// Las métricas van entre [corchetes] a propósito: no inventar resultados.

/** Figuras de Hairline: las diez primeras dibujadas para este portfolio con la skill
 *  hairline-create (en /public/hairline), las tres últimas del paquete npm. */
export type HairlineName =
  | "copies" | "photoshop" | "puzzle" | "pipeline" | "scan" | "seat" | "drawers"
  | "ask" | "pile" | "day"
  | "slow" | "plot" | "terrain";

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
  /** Una segunda imagen, debajo de la principal. */
  after?: Media;
  /** Miniaturas con pie bajo la imagen principal (o en su lugar). */
  gallery?: Media[];
  /** `figure`: una figura de Hairline de /public/hairline que lo ilustra. Si
   *  algún punto la tiene, los puntos se muestran como fila de figuras. */
  points?: { title: string; text: string; figure?: HairlineName }[];
  /** Lecturas: una línea tal como se escribe (`said`) y lo que la app entiende de ella (`got`),
   *  de lo literal a lo que deduce; la última, la conclusión. */
  readings?: { said: string; got: string[] }[];
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
  meta: { role: string; team: string; duration: string; platform: string; status?: string };
  /** Producto publicado: se muestra en la ficha del case study. */
  site?: { label: string; href: string };
  media: Media[];
  sections: Section[];
};

export const posts: Post[] = [
  {
    // Contenido real: el PRODUCT.md y el historial de ~/note it (Expo + React Native, iOS y
    // Android), más lo que contó Adrián (2026-10-25). Diseño y desarrollo, sin URL pública aún.
    // Duración por confirmar. Sin resultados: no hay usuarios ni cifras todavía.
    slug: "note-it",
    date: "2026-10-25",
    title: "You write it, Note it sorts it",
    caption:
      "For heads that are always full. I designed and built Note it, an iOS and Android app with a single field: you write, say or photograph anything, and it sorts it and shows you only what matters today.",
    pinned: true,
    example: false,
    meta: { role: "Product Design & Development", team: "Personal project", duration: "[X] months", platform: "iOS & Android", status: "In development" },
    media: [
      {
        kind: "phone",
        tone: "light",
        src: "/img/noteit/cover.jpg",
        alt: "Note it's Home: the week, today's three things with their categories, and Tasks and Notes waiting below",
      },
    ],
    sections: [
      {
        id: "problem",
        title: "Problem",
        heading: "So much to do, and no idea where to start",
        body: [
          "Tasks, notes, errands, plans... there's always so much to do that we don't know where to start. Writing it all down is easy. The hard part comes after.",
        ],
        points: [
          { title: "Nothing says what comes first", text: "Forty things in one pile, the urgent next to the someday. Nothing tells you which one matters now.", figure: "pile" },
          { title: "You have to sort it all yourself", text: "Everything that crosses your mind needs a place, and finding it is one more thing to do.", figure: "ask" },
          { title: "Your day is in pieces", text: "One app for each thing, and none that brings it all together without making it complicated.", figure: "day" },
        ],
      },
      {
        id: "capture",
        title: "One field",
        heading: "A single field, and it takes anything",
        body: [
          "You don't have to decide where to save it, or remember where you left it. Type it however it comes out, dictate it, or take a photo of a list on paper, and Note it puts it where it belongs.",
        ],
        // Las animaciones de la app, grabadas de su build web fotograma a fotograma (30 fps) y
        // compuestas sobre el fondo de la portada; en español, su propia grabación (lib/posts.es.ts).
        media: {
          kind: "phone",
          tone: "light",
          alt: "You type it, send it, and it lands where it belongs on its own: today, tomorrow or the day you said",
          video: { src: "/img/noteit/write-en.mp4", poster: "/img/noteit/write-en.jpg" },
        },
      },
      {
        // Cómo lee la IA por dentro, con ejemplos reales del código de ~/note it (study.ts,
        // people.ts): lo que escribes, al lado de lo que entiende.
        id: "thinking",
        title: "How it thinks",
        heading: "It thinks the way your head does",
        body: [
          "When you know there's an exam on Friday, you don't just keep the date: you know you should study today. Note it does the same. Its AI reads what you write, works out what it's about and draws out what it means: dates, routines, people, the things you keep coming back to.",
        ],
        readings: [
          { said: "Logic exam on Friday", got: ["Study · Logic", "An exam, on Friday", "Today: study logic"] },
          { said: "I can't study on Thursdays", got: ["Not a task: a limit", "Study stops landing on Thursdays"] },
          { said: "Need to book the restaurant for my partner's birthday, don't forget", got: ["Your partner is Rebeca", "Rebeca's birthday is 27 December: you wrote it weeks ago", "A table is booked ahead: it sets it for 20 December, a week early"] },
        ],
      },
      {
        id: "today",
        title: "Less at once",
        heading: "What looks like a lot, in three things a day",
        body: [
          "Prepare the client meeting, study for the civil service exams, and everything else. Thinking about it all at once is overwhelming, and in my case there was so much that I'd end up doing nothing.",
          "So the app doesn't show you everything at once: out of all you have, it brings forward what matters most today, by date and urgency. The rest waits its turn. Finish one and the next comes in. A little every day, but every day.",
        ],
        media: {
          kind: "phone",
          tone: "light",
          alt: "Left, new things come in from the field as the day goes on; right, Today with three: finish one and the next comes in",
          video: { src: "/img/noteit/today-en.mp4", poster: "/img/noteit/today-en.jpg" },
        },
      },
    ],
  },
  {
    // Contenido real (contado por Adrián). Rol y +150 mockups confirmados; duración y fecha entre [corchetes] por confirmar.
    slug: "mockp",
    date: "2026-09-12",
    title: "You bring the design, Mockp makes it real",
    caption:
      "A mockup is only useful if it looks like yours. I designed and built Mockp, a free gallery with an editor that places your design in seconds, with all the realism it deserves.",
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
