import type { Metadata, Viewport } from "next";
import { Figtree } from "next/font/google";
import { site } from "@/lib/site";
import { ui } from "@/lib/i18n";
import { getLang } from "@/lib/lang";
import { Curtain } from "@/components/CurtainLink";
import "lenis/dist/lenis.css";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { LangTransition } from "@/components/LangTransition";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const t = ui[await getLang()];
  return {
    title: { default: `${site.name} · ${t.role_}`, template: `%s · ${site.name}` },
    description: t.bio,
  };
}

export const viewport: Viewport = { themeColor: "#FFFFFF" };

const contract = `<!--
THESIS: El portfolio es un perfil con feed: cada case study es una publicación con fecha, título, imagen, pie y ficha, que abre su propia página. Rechaza el hero + rejilla de tarjetas de proyecto.
OWN-WORLD: Suelo #FFFFFF, tinta #272724, grises sacados de la tinta. Figtree para todo (500 en títulos y nombres, 400 en texto). Sin tarjetas: media cruda sobre el suelo, chips de 1px, iconos dibujados a 1.5px. Un solo acento: el punto verde de disponible.
STORY: El recruiter ve quién es y que está disponible sin hacer scroll, abre la publicación fijada, lee el case study y escribe.
FIRST VIEWPORT: Barra fina con avatar, nombre y Contactar (pastilla de tinta). Perfil fijo a la izquierda (avatar, bio a 22px, chips). Feed a la derecha con la publicación fijada y su carrusel.
FORM: Feed social con perfil fijo (brief fijado por el usuario, por encima de la tirada). Raises: ficha EXIF regulada bajo cada post (de catálogo); una idea por pie (de Saul Bass). Seed 3019fd18.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
-->`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = await getLang();
  return (
    <html lang={lang} className={figtree.variable} data-scroll-behavior="smooth">
      <body id="top">
        <div hidden dangerouslySetInnerHTML={{ __html: contract }} />
        <a className="skip" href="#content">
          {ui[lang].skip}
        </a>
        <SmoothScroll />
        {children}
        <Curtain />
        <LangTransition lang={lang} />
      </body>
    </html>
  );
}
