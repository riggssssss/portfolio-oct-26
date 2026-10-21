import Link from "next/link";
import { ui } from "@/lib/i18n";
import { getLang } from "@/lib/lang";
import { Layout, TopBar } from "@/components/Shell";

export default async function NotFound() {
  const t = ui[await getLang()];
  return (
    <>
      <TopBar t={t} />
      <Layout>
        <h1 className="cs-title">{t.notFoundTitle}</h1>
        <p className="cs-lede">
          {t.notFoundText}{" "}
          <Link className="link" href="/">
            {t.notFoundBack}
          </Link>
        </p>
      </Layout>
    </>
  );
}
