import { en } from "./en";
import { es } from "./es";
import type { Content, Locale } from "./types";

export * from "./types";
export { getTags, site, whatsappUrl } from "./site";
export type { ImageAsset, JobConfig, ProjectConfig, SiteConfig, Tone } from "./site";

const dictionaries: Record<Locale, Content> = { es, en };

export function getContent(locale: Locale): Content {
  return dictionaries[locale];
}

/** Ruta pública de cada idioma — I18N-1 (con trailingSlash). */
export const LOCALE_PATH: Record<Locale, string> = { es: "/", en: "/en/" };

/** Etiqueta del selector ES · EN — I18N-2. */
export const LOCALE_LABEL: Record<Locale, string> = { es: "ES", en: "EN" };
