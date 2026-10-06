import type { JobKey, PanelId, ProjectKey, StatKey } from "./types";

/**
 * Datos que no dependen del idioma — PLAN §1.2, SPEC §4 y §13.
 * Los insumos pendientes (P1–P3) se completan aquí, sin tocar componentes.
 */

export interface ImageAsset {
  src: string;
  width: number;
  height: number;
}

export type Tone = "pink" | "lime" | "amber" | "soft";

export interface ProjectConfig {
  key: ProjectKey;
  n: `0${1 | 2 | 3 | 4 | 5}`;
  /** Fondo del visual (PRJ-4) */
  bg: string;
  /** PRJ-6: si existe, reemplaza al mockup CSS (P3) */
  image?: ImageAsset;
  /**
   * Cómo se presenta la captura: `cover` llena el cuadrado (collages);
   * `phone` la muestra dentro de un teléfono (capturas verticales de app),
   * con `screenBg` como fondo de la pantalla bajo la imagen.
   */
  imageFrame?: "cover" | "phone";
  screenBg?: string;
  /** P2: se añade a los tags; ausente = sin tag */
  stack?: string[];
}

export interface JobConfig {
  key: JobKey;
  name: string;
  /** Columna "años" del panel 04 */
  years: string;
  /** ISO yyyy-mm para JSON-LD */
  start: string;
  end?: string;
}

export interface SiteConfig {
  /** Base absoluta para OG y sitemap */
  url: string;
  name: string;
  email: string;
  github: string;
  linkedin: string;
  /** Solo dígitos con código de país; '' = botón oculto (P1) */
  whatsapp: string;
  photo: ImageAsset;
  panels: readonly PanelId[];
  stats: Record<StatKey, string>;
  marquee: {
    rowA: Array<{ label: string; tone?: Tone }>;
    rowB: Array<{ label: string; tone?: Tone }>;
  };
  aiTools: string[];
  projects: ProjectConfig[];
  jobs: JobConfig[];
}

export const site: SiteConfig = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://nairelys.vercel.app",
  name: "Nairelys Hernández",
  email: "njhs694@gmail.com",
  github: "https://github.com/nairelyshz",
  linkedin: "https://linkedin.com/in/nairelys-hernandez",
  whatsapp: "584242704561",
  photo: { src: "/images/foto-nairelys.webp", width: 750, height: 800 },
  panels: ["inicio", "sobre-mi", "stack", "experiencia", "proyectos", "contacto"],
  stats: { years: "8", teams: "7", products: "5", platforms: "3" },
  marquee: {
    rowA: [
      { label: "React" },
      { label: "Vue", tone: "pink" },
      { label: "Angular" },
      { label: "Ionic", tone: "lime" },
      { label: "Next.js" },
      { label: "TypeScript", tone: "amber" },
    ],
    rowB: [
      { label: "Node", tone: "amber" },
      { label: "Nest.js", tone: "soft" },
      { label: "Scala", tone: "pink" },
      { label: "React Native", tone: "soft" },
      { label: "MongoDB", tone: "lime" },
      { label: "Express", tone: "soft" },
      { label: "Java", tone: "amber" },
    ],
  },
  aiTools: ["Claude Code", "Cursor", "Gemini"],
  projects: [
    {
      key: "cuento",
      n: "01",
      // Tonos del logo y del botón "Comenzar" de la app
      bg: "linear-gradient(160deg, #FBE3D3, #D6A493)",
      // Recorte de la pantalla de inicio sin el pie (logos de patrocinadores)
      image: { src: "/images/projects/cuento.webp", width: 610, height: 1080 },
      imageFrame: "phone",
      screenBg: "#F3F1F2",
    },
    {
      key: "vetsi",
      n: "02",
      bg: "#0E0B12",
      image: { src: "/images/vetsi-collage.webp", width: 720, height: 720 },
    },
    { key: "wobber", n: "03", bg: "linear-gradient(160deg, #2A2A2A, #0F0F0F)" },
    { key: "glik", n: "04", bg: "linear-gradient(160deg, #1B2550, #0B1020)" },
    { key: "libre", n: "05", bg: "linear-gradient(160deg, #CFDBFF, #7F9BFF)" },
  ],
  jobs: [
    { key: "apps2go", name: "Apps2go", years: "2023 —", start: "2023-10" },
    { key: "libre", name: "Libre", years: "2023", start: "2023-03", end: "2023-07" },
    { key: "bp", name: "BP Developments", years: "2020 — 23", start: "2020-11", end: "2023-04" },
    { key: "cronapis", name: "Cronapis Corp", years: "2020 — 21", start: "2020-08", end: "2021-02" },
    { key: "ipn", name: "IPN Digital", years: "2020", start: "2020-02", end: "2020-06" },
    { key: "dbaccess", name: "DBAccess", years: "2019 — 20", start: "2019-09", end: "2020-02" },
    {
      key: "ingenio",
      name: "Grupo Ingenio Tecnológico",
      years: "2018 — 19",
      start: "2018-03",
      end: "2019-08",
    },
  ],
};

/** Tags visibles de un proyecto: los del idioma + el stack, sin placeholders (PRJ-2, P2). */
export function getTags(copyTags: readonly string[], project: ProjectConfig): string[] {
  return [...copyTags, ...(project.stack ?? [])].filter((t) => t.trim() !== "");
}

/** URL de WhatsApp, o null si no está configurado (SPEC §3.7). */
export function whatsappUrl(number: string = site.whatsapp): string | null {
  const digits = number.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : null;
}
