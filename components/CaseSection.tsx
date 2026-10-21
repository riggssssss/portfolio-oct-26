import type { HairlineName, Media as MediaT, Section } from "@/lib/posts";
import type { Lang, UI } from "@/lib/i18n";
import { Hairline } from "./Hairline";
import { Media } from "./Media";
import { BeforeAfter } from "./BeforeAfter";

/** Lo que cada figura muestra, para quien no la ve. */
const FIGURE_LABEL_EN: Record<HairlineName, string> = {
  copies: "A tray of identical cards, all the same mockup: whichever you pull, it is the one everybody has.",
  layers: "A mockup taken apart into the five layers it took to build by hand: scene, shadow, device, screen and glare.",
  matches: "A matchbox: the match under the pointer comes out of the tray, stands up and lights.",
  scan: "A bar scans a phone on a desk: its screen, the chroma area, lights up as the bar passes; the desk around it never does.",
  seat: "Your design hovers over a phone's screen and comes down into it; seated, it takes the glass's light and shadow.",
  drawers: "A cabinet of drawers full of finished mockups: the one under the pointer slides out, ready to use.",
  slow: "Crates riding a belt through a gate: mockups coming off the line, ready in seconds.",
  plot: "A bar chart whose bars all stand at zero: what a mockup costs.",
  terrain: "A field of pillars rising around the pointer: a gallery of more than 150 mockups.",
};
const FIGURE_LABEL_ES: Record<HairlineName, string> = {
  copies: "Una bandeja de tarjetas idénticas, todas el mismo mockup: cojas la que cojas, es la que tiene todo el mundo.",
  layers: "Un mockup desmontado en las cinco capas que costó hacerlo a mano: escena, sombra, dispositivo, pantalla y reflejo.",
  matches: "Una caja de cerillas: la cerilla bajo el puntero sale de la caja, se levanta y se enciende.",
  scan: "Una barra escanea un móvil sobre una mesa: su pantalla, la zona croma, se ilumina al pasar; la mesa de alrededor, nunca.",
  seat: "Tu diseño flota sobre la pantalla de un móvil y baja hasta encajar; ya colocado, toma la luz y la sombra del cristal.",
  drawers: "Una cajonera llena de mockups terminados: el cajón bajo el puntero se abre, listo para usar.",
  slow: "Cajas sobre una cinta que cruzan una puerta: mockups saliendo de la línea, listos en segundos.",
  plot: "Un gráfico de barras con todas a cero: lo que cuesta un mockup.",
  terrain: "Un campo de columnas que se alzan alrededor del puntero: una galería de más de 150 mockups.",
};

/** Imagen del case study con su pie: el pie es el alt, en el tono de la ficha. */
function Figure({ m }: { m: MediaT }) {
  return (
    <figure className="cs-figure">
      <Media media={m} />
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
  const figuredStats = s.stats?.some((st) => st.figure || st.chart);
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
              {st.chart ? (
                <BeforeAfter
                  chart={st.chart}
                  labels={{ before: t.before, after: t.after }}
                  alt={`${t.before}: ${st.chart.before.value}. ${t.after}: ${st.chart.after.value}.`}
                />
              ) : (
                st.figure && <Hairline name={st.figure} label={FIGURE_LABEL[st.figure]} />
              )}
              <p className="cs-stat-value num">{st.value}</p>
              <p className="cs-list-text">{st.label}</p>
            </li>
          ))}
        </ul>
      )}
      {s.media && <Figure m={s.media} />}
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
