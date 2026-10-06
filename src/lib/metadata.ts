import type { Metadata } from "next";
import { getContent, LOCALE_PATH, site, type Locale } from "@/content";

/**
 * Metadatos por idioma — SPEC §9, I18N-4.
 * Fase 1: title, description, idioma y alternates. OG, icons y JSON-LD llegan en la Fase 5.
 */
export function buildMetadata(locale: Locale): Metadata {
  const { meta } = getContent(locale);
  return {
    metadataBase: new URL(site.url),
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: LOCALE_PATH[locale],
      languages: {
        es: LOCALE_PATH.es,
        en: LOCALE_PATH.en,
        "x-default": LOCALE_PATH.es,
      },
    },
  };
}
