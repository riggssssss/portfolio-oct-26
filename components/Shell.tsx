import { CurtainLink } from "@/components/CurtainLink";
import type { ReactNode } from "react";
import { site } from "@/lib/site";
import type { UI } from "@/lib/i18n";
import { ExArrow } from "./Icons";
import { ContactButton } from "./ContactButton";

/** `plain`: sin migas; en el feed el perfil ya dice quién es (decisión del usuario).
 *  `lead`: lo que va en la esquina izquierda en su lugar (en el feed, EN / ES). */
export function TopBar({
  t,
  crumb,
  plain,
  lead,
}: {
  t: UI;
  crumb?: { label: string; href?: string };
  plain?: boolean;
  lead?: ReactNode;
}) {
  const cv = site.links.find((l) => l.label === "CV");
  return (
    <header className="topbar">
      <div className="topbar-inner">
        {lead}
        {!plain && (
          <nav className="crumbs" aria-label={t.breadcrumb}>
            <CurtainLink href="/" className="crumb-home">
              <img className="avatar xs" src="/img/avatar-5989.jpg" alt="" aria-hidden="true" />
              <span className="crumb-name">{site.name}</span>
            </CurtainLink>
            {crumb && (
              <>
                <span className="crumb-sep" aria-hidden="true">
                  /
                </span>
                <span className="crumb-current" aria-current="page">
                  {crumb.label}
                </span>
              </>
            )}
          </nav>
        )}
        <div className="topbar-actions">
          {cv && (
            <a className="text-link hide-sm" href={cv.href} target="_blank" rel="noreferrer">
              CV <ExArrow />
            </a>
          )}
          <ContactButton email={site.email} label={t.contact} copied={t.emailCopied} />
        </div>
      </div>
    </header>
  );
}

export function Profile({ t }: { t: UI }) {
  return (
    <div className="profile">
      <img className="avatar lg" src="/img/avatar-5989.jpg" alt="" aria-hidden="true" />
      <p className="profile-id">{site.name}</p>
      <h1 className="profile-bio">{t.bio}</h1>
      <ul className="pills" aria-label={t.tools}>
        {site.tools.map((t) => (
          <li key={t} className="pill">
            {t}
          </li>
        ))}
      </ul>
      <p className="profile-loc">{t.basedIn}</p>
      <ul className="profile-links" aria-label={t.links}>
        {site.links.map((l) => (
          <li key={l.label}>
            <a className="text-link" href={l.href} target="_blank" rel="noreferrer">
              {l.label} <ExArrow />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** De dónde es: abajo a la derecha del feed, a la altura de la última línea del perfil. */
export function Location({ t }: { t: UI }) {
  return <p className="location">{t.basedIn}</p>;
}

/** `side`: la columna derecha, a toda la altura y anclada abajo como el perfil. */
export function Layout({
  aside,
  side,
  children,
  className,
}: {
  aside?: ReactNode;
  side?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className ? `layout ${className}` : "layout"}>
      <aside className="aside">
        <div className="aside-sticky">{aside}</div>
      </aside>
      <main className="main" id="content">
        {children}
      </main>
      {side && (
        <aside className="side">
          <div className="aside-sticky">{side}</div>
        </aside>
      )}
    </div>
  );
}

