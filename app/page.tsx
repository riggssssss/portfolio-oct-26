import { posts } from "@/lib/posts";
import { localize, ui } from "@/lib/i18n";
import { getLang } from "@/lib/lang";
import { Layout, Location, Profile, TopBar } from "@/components/Shell";
import { PostCard } from "@/components/PostCard";
import { LangSwitch } from "@/components/LangSwitch";

export default async function Home() {
  const lang = await getLang();
  const t = ui[lang];
  const ordered = localize(
    [...posts].sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned) || b.date.localeCompare(a.date)),
    lang,
  );
  return (
    <>
      <TopBar t={t} plain lead={<LangSwitch lang={lang} label={t.language} />} />
      <Layout aside={<Profile t={t} />} side={<Location t={t} />}>
        <h2 className="sr-only">{t.posts}</h2>
        <div className="feed">
          {ordered.map((p, i) => (
            <PostCard key={p.slug} post={p} first={i === 0} t={t} />
          ))}
        </div>
      </Layout>
    </>
  );
}
