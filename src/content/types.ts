/**
 * Contratos de contenido — PLAN §1.2.
 * Todo lo que va en `Content` debe ser serializable: cruza de Server a Client Components.
 * Los textos con {placeholders} se resuelven con `fmt()` (src/lib/format.ts).
 */

export const LOCALES = ["es", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const PANEL_IDS = [
  "inicio",
  "sobre-mi",
  "stack",
  "experiencia",
  "proyectos",
  "contacto",
] as const;
export type PanelId = (typeof PANEL_IDS)[number];

export const PROJECT_KEYS = ["cuento", "vetsi", "wobber", "glik", "libre"] as const;
export type ProjectKey = (typeof PROJECT_KEYS)[number];

export const JOB_KEYS = [
  "apps2go",
  "libre",
  "bp",
  "cronapis",
  "ipn",
  "dbaccess",
  "ingenio",
] as const;
export type JobKey = (typeof JOB_KEYS)[number];

export type StatKey = "years" | "teams" | "products" | "platforms";

/** Titular con un tramo en Instrument Serif itálica. */
export interface Emph {
  before: string;
  em: string;
  after?: string;
}

export interface ProjectCopy {
  /** Nombre propio: idéntico en todos los idiomas (I18N-5). */
  name: string;
  desc: string;
  /** Tags conocidos; el stack de site.ts se añade después (PRJ-2, P2). */
  tags: string[];
  /** Alt de la captura cuando existe `image` (PRJ-6). */
  visualAlt: string;
}

export interface Content {
  meta: {
    title: string;
    description: string;
    ogAlt: string;
    ogTagline: string;
  };
  header: {
    /** aria-label del selector de idioma */
    langLabel: string;
  };
  nav: {
    /** aria-label de la barra inferior */
    label: string;
    panels: Record<PanelId, string>;
    prev: string;
    next: string;
    /** "Ir a {panel}" */
    goTo: string;
    /** "Panel {n} de {total}: {panel}" */
    announce: string;
    /** NAV-8, puntero fino */
    hintPointer: string;
    /** NAV-8, táctil */
    hintTouch: string;
  };
  hero: {
    eyebrow: string;
    firstName: string;
    lastName: string;
    lead: string;
    ctaPrimary: string;
    ctaSecondary: string;
    /** Texto del anillo giratorio */
    ring: string;
    badge: string;
    photoAlt: string;
  };
  about: {
    eyebrow: string;
    title: Emph;
    body: string;
    stats: Record<StatKey, string>;
    chips: [string, string, string];
  };
  stack: {
    eyebrow: string;
    title: Emph;
    aiLabel: string;
    methodLabel: string;
    methodLead: string;
    methodBody: string;
    /** aria-label de la lista sr-only de tecnologías */
    srListLabel: string;
  };
  experience: {
    eyebrow: string;
    title: Emph;
    details: Record<JobKey, string>;
  };
  projects: {
    /** "Proyectos · {n} / 05" */
    eyebrow: string;
    /** aria-label de la lista de proyectos */
    listLabel: string;
    /** Botón del recorrido automático (PRJ-7…10) */
    autoplayPause: string;
    autoplayPlay: string;
    items: Record<ProjectKey, ProjectCopy>;
  };
  contact: {
    eyebrow: string;
    title: Emph;
  };
}
