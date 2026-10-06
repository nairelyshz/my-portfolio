import type { Emph as EmphCopy } from "@/content";

export type Accent = "pink" | "amber" | "lime";

/** Titular con un tramo en Instrument Serif itálica y color de acento — SPEC §3. */
export function Emph({ copy, accent }: { copy: EmphCopy; accent: Accent }) {
  return (
    <>
      {copy.before}
      <span className="serif" style={{ color: `var(--${accent})` }}>
        {copy.em}
      </span>
      {copy.after}
    </>
  );
}

/** Eyebrow en mayúsculas espaciadas con color de acento. */
export function Eyebrow({ accent, children }: { accent: Accent; children: React.ReactNode }) {
  return (
    <p className="eyebrow" style={{ color: `var(--${accent})` }}>
      {children}
    </p>
  );
}
