import { CurtainLink } from "@/components/CurtainLink";
import type { Media as MediaT } from "@/lib/posts";
import { Media } from "./Media";
import { ArrowUpRight } from "./Icons";

export function Carousel({ items, label, href, of = "of" }: { items: MediaT[]; label: string; href?: string; of?: string }) {
  return (
    <div className="carousel" role="region" aria-roledescription="carousel" aria-label={label}>
      <div className="carousel-track" tabIndex={0}>
        {items.map((m, i) => (
          <div className="carousel-slide" key={i} aria-label={`${i + 1} ${of} ${items.length}`}>
            {href ? (
              <CurtainLink href={href} className="media-link" tabIndex={-1} aria-hidden="true">
                <Media media={m} priority={i === 0} />
                <OpenHint />
              </CurtainLink>
            ) : (
              <Media media={m} priority={i === 0} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function OpenHint() {
  return (
    <span className="open-hint" aria-hidden="true">
      <ArrowUpRight size={44} strokeWidth={1.25} />
    </span>
  );
}
