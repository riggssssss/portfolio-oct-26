import { CurtainLink } from "@/components/CurtainLink";
import type { Post } from "@/lib/posts";
import type { UI } from "@/lib/i18n";
import { Media } from "./Media";
import { Carousel, OpenHint } from "./Carousel";
import { ExArrow } from "./Icons";

export function Meta({ meta }: { meta: Post["meta"] }) {
  return (
    <p className="exif">
      <span>{meta.role}</span>
      <span>{meta.platform}</span>
    </p>
  );
}

export function PostCard({ post, first, t }: { post: Post; first?: boolean; t: UI }) {
  const href = `/posts/${post.slug}`;
  return (
    <article className="post" aria-labelledby={`t-${post.slug}`}>
      <div className="post-head">
        <h2 className="post-title" id={`t-${post.slug}`}>
          <CurtainLink href={href}>{post.title}</CurtainLink>
        </h2>
        <span className="post-head-actions">
          <CurtainLink href={href} className="btn-case">
            {t.caseStudy} <ExArrow />
          </CurtainLink>
        </span>
      </div>
      {post.media.length > 1 ? (
        <Carousel items={post.media} label={post.title} href={href} of={t.of} />
      ) : (
        <CurtainLink href={href} className="media-link" tabIndex={-1} aria-hidden="true">
          <Media media={post.media[0]} priority={first} />
          <OpenHint />
        </CurtainLink>
      )}
      <div className="post-foot">
        <p className="post-caption">{post.caption}</p>
        <Meta meta={post.meta} />
      </div>
    </article>
  );
}
