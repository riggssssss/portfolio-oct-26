import type { HairlineName, Media as MediaT, Section } from "@/lib/posts";
import type { Lang, UI } from "@/lib/i18n";
import { Hairline } from "./Hairline";
import { Media } from "./Media";
import { Race } from "./Race";
import { Steps } from "./Steps";

/** Lo que cada figura muestra, para quien no la ve. */
const FIGURE_LABEL_EN: Record<HairlineName, string> = {
  copies: "A tray of identical cards, all the same mockup: whichever you pull, it is the one everybody has.",
  photoshop: "An editor's window: the cursor carries the design onto the phone while the layers panel fills, one row at a time, by hand.",
  pipeline:
    "An editor window runs the whole job: a bar finds the phone's chroma screen in a photo, the design seats into it with its glare and shadow, and a 4K file comes out.",
  puzzle: "Two ordinary jigsaw pieces: push one into the other and the knob lands on the edge, never in the hole. They don't fit.",
  scan: "A bar scans a phone on a desk: its screen, the chroma area, lights up as the bar passes; the desk around it never does.",
  seat: "Your design hovers over a phone's screen and comes down into it; seated, it takes the glass's light and shadow.",
  drawers: "A cabinet of drawers full of finished mockups: the one under the pointer slides out, ready to use.",
  slow: "Crates riding a belt through a gate: mockups coming off the line, ready in seconds.",
  plot: "A bar chart whose bars all stand at zero: what a mockup costs.",
  terrain: "A field of pillars rising around the pointer: a gallery of more than 150 mockups.",
};
const FIGURE_LABEL_ES: Record<HairlineName, string> = {
  copies: "Una bandeja de tarjetas idénticas, todas el mismo mockup: cojas la que cojas, es la que tiene todo el mundo.",
  photoshop: "La ventana de un editor: el cursor lleva el diseño hasta el móvil mientras el panel de capas se llena, una a una, a mano.",
  pipeline:
    "Una ventana de editor hace todo el trabajo: una barra encuentra en la foto la pantalla croma del móvil, el diseño encaja en ella con su reflejo y su sombra, y sale un archivo 4K.",
  puzzle: "Dos piezas de puzle normales: al empujar una contra la otra, la pestaña choca con el borde y nunca entra en el hueco. No encajan.",
  scan: "Una barra escanea un móvil sobre una mesa: su pantalla, la zona croma, se ilumina al pasar; la mesa de alrededor, nunca.",
  seat: "Tu diseño flota sobre la pantalla de un móvil y baja hasta encajar; ya colocado, toma la luz y la sombra del cristal.",
  drawers: "Una cajonera llena de mockups terminados: el cajón bajo el puntero se abre, listo para usar.",
  slow: "Cajas sobre una cinta que cruzan una puerta: mockups saliendo de la línea, listos en segundos.",
  plot: "Un gráfico de barras con todas a cero: lo que cuesta un mockup.",
  terrain: "Un campo de columnas que se alzan alrededor del puntero: una galería de más de 150 mockups.",
};

/** Imagen del case study con su pie: el pie es el alt, en el tono de la ficha.
 *  Con `figure`, una figura de Hairline a todo lo ancho en lugar de la imagen. */
function Figure({ m, label }: { m: MediaT; label?: string }) {
  return (
    <figure className="cs-figure">
      {m.figure ? <Hairline name={m.figure} label={label ?? m.alt} /> : <Media media={m} />}
      <figcaption>{m.alt}</figcaption>
    </figure>
  );
}

/** Una sección = un capítulo a lo ancho del escenario: el titular y, debajo, el
 *  texto y lo que lo prueba (puntos, cifras); después las
 *  imágenes, que ocupan las dos columnas o se salen de la pantalla. Si los
 *  puntos traen figura, pasan a ser una fila de figuras a todo lo ancho. */
export function CaseSection({ s, lang, t }: { s: Section; lang: Lang; t: UI }) {
  const FIGURE_LABEL = lang === "es" ? FIGURE_LABEL_ES : FIGURE_LABEL_EN;
  const figured = s.points?.some((pt) => pt.figure);
  const figuredStats = s.stats?.some((st) => st.figure);
  return (
    <section id={s.id} className="cs-section" aria-labelledby={`h-${s.id}`}>
      <div className="cs-chapter">
        <h2 id={`h-${s.id}`} className="cs-h2">
          {s.heading ?? s.title}
        </h2>
        <div className="cs-chapter-body">
          {s.body.map((p, k) => (
            <p key={k} className="cs-p">
              {p}
            </p>
          ))}
          {s.points && !figured && (
            <ul className="cs-list">
              {s.points.map((pt) => (
                <li key={pt.title}>
                  <p className="cs-list-title">{pt.title}</p>
                  <p className="cs-list-text">{pt.text}</p>
                </li>
              ))}
            </ul>
          )}
          {s.stats && !figuredStats && (
            <dl className="cs-list cs-stats">
              {s.stats.map((st) => (
                <div key={st.label}>
                  <dt>{st.label}</dt>
                  <dd className="num">{st.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
      {figured && (
        <ul className="cs-points">
          {s.points!.map((pt) => (
            <li key={pt.title}>
              {pt.figure && <Hairline name={pt.figure} label={FIGURE_LABEL[pt.figure]} />}
              <p className="cs-list-title">{pt.title}</p>
              <p className="cs-list-text">{pt.text}</p>
            </li>
          ))}
        </ul>
      )}
      {figuredStats && (
        <ul className="cs-points">
          {s.stats!.map((st) => (
            <li key={st.label}>
              {st.figure && <Hairline name={st.figure} label={FIGURE_LABEL[st.figure]} />}
              <p className="cs-stat-value num">{st.value}</p>
              <p className="cs-list-text">{st.label}</p>
            </li>
          ))}
        </ul>
      )}
      {s.race && <Race race={s.race} lang={lang} replay={t.replay} />}
      {s.steps && s.media ? (
        <Steps media={s.media} steps={s.steps} />
      ) : (
        s.media && <Figure m={s.media} label={s.media.figure && FIGURE_LABEL[s.media.figure]} />
      )}
      {s.gallery?.every((m) => m.figure) && (
        <ul className="cs-points">
          {s.gallery.map((m) => (
            <li key={m.alt}>
              <Hairline name={m.figure!} label={FIGURE_LABEL[m.figure!]} />
              <p className="cs-list-title">{m.alt}</p>
            </li>
          ))}
        </ul>
      )}
      {s.gallery && !s.gallery.every((m) => m.figure) && (
        <div className="cs-rail" tabIndex={0} role="region" aria-label={`${s.title}: ${t.images}`}>
          {s.gallery.map((m, k) => (
            <Figure key={k} m={m} />
          ))}
        </div>
      )}
    </section>
  );
}
