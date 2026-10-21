import { CurtainLink } from "@/components/CurtainLink";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPost, posts } from "@/lib/posts";
import { site } from "@/lib/site";
import { localize, ui } from "@/lib/i18n";
import { getLang } from "@/lib/lang";
import { Layout } from "@/components/Shell";
import { LangSwitch } from "@/components/LangSwitch";
import { ProjectLink } from "@/components/ProjectLink";
import { Media } from "@/components/Media";
import { Carousel } from "@/components/Carousel";
import { CaseSection } from "@/components/CaseSection";
import { Toc } from "@/components/Toc";
import { CopyEmail } from "@/components/Social";
import { ExArrow } from "@/components/Icons";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = getPost((await params).slug);
  if (!found) return {};
  const post = localize(found, await getLang());
  return { title: post.title, description: post.caption };
}

export default async function PostPage({ params }: Props) {
  const found = getPost((await params).slug);
  if (!found) notFound();
  const lang = await getLang();
  const t = ui[lang];
  const post = localize(found, lang);

  const i = posts.indexOf(found);
  const next = localize(posts[(i + 1) % posts.length], lang);

  const aside = (
    <>
      <CurtainLink href="/" className="text-link cs-back">
        <ExArrow dir="left" />
        {t.allPosts}
      </CurtainLink>
      {/* Sin columna derecha (bajo 1200px), EN / ES vive aquí, junto a Volver. */}
      <LangSwitch lang={lang} label={t.language} className="lang-narrow" />
      <Toc label={t.sections} items={post.sections.map((s) => ({ id: s.id, title: s.title }))} />
    </>
  );

  // Columna derecha: EN / ES en la esquina de arriba; la web del proyecto, abajo.
  const side = (
    <>
      <LangSwitch lang={lang} label={t.language} />
      {post.site && <ProjectLink href={post.site.href} label={post.site.label} />}
    </>
  );

  return (
    <>
      <Layout className="cs" aside={aside} side={side}>
        <article>
          <header className="cs-head">
            <h1 className="cs-title">{post.title}</h1>
            <div className="cs-chapter">
              <dl className="cs-spec">
                <div>
                  <dt>{t.role}</dt>
                  <dd>{post.meta.role}</dd>
                </div>
                {post.site && (
                  <div>
                    <dt>{t.website}</dt>
                    <dd>
                      <a className="cs-site" href={post.site.href} target="_blank" rel="noreferrer">
                        {post.site.label} <ExArrow />
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
              <p className="cs-lede">{post.caption}</p>
            </div>
          </header>

          <div className="cs-hero">
            {post.media.length > 1 ? (
              <Carousel items={post.media} label={post.title} of={t.of} />
            ) : (
              <Media media={post.media[0]} priority />
            )}
          </div>

          {post.sections.map((s) => (
            <CaseSection key={s.id} s={s} lang={lang} t={t} />
          ))}
        </article>

        {/* El cierre: "Hablemos" en gris y el correo en grande, que
            se copia al pulsarlo; debajo, la frase y el enlace para escribir. */}
        <section className="cs-section cs-contact" aria-labelledby="contact-title">
          <h2 id="contact-title" className="cs-contact-title">
            {t.letsTalk}
          </h2>
          <CopyEmail email={site.email} className="cs-contact-email" t={t} />
          <div className="cs-contact-foot">
            <p>{t.contactText}</p>
            <a className="text-link" href={`mailto:${site.email}`}>
              {t.sendEmail}
              <ExArrow />
            </a>
          </div>
        </section>

        {next.slug !== post.slug && (
          <CurtainLink href={`/posts/${next.slug}`} className="next-post" aria-label={`${t.nextPost}: ${next.title}`}>
            <span className="meta">{t.next}</span>
            <span className="next-title">
              <span className="next-label">{next.title}</span>
              <ExArrow dir="right" />
            </span>
          </CurtainLink>
        )}
      </Layout>
    </>
  );
}
