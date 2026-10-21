import { cookies } from "next/headers";
import { LANG_COOKIE, type Lang } from "./i18n";

/** El idioma elegido por el visitante (solo en el servidor). */
export async function getLang(): Promise<Lang> {
  return (await cookies()).get(LANG_COOKIE)?.value === "es" ? "es" : "en";
}
