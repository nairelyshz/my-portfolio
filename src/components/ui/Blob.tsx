import type { CSSProperties } from "react";

/** Mancha difusa decorativa — SPEC §3.2 (floaty / drift). */
export function Blob({
  motion,
  size,
  color,
  blur = 40,
  ring = false,
  style,
}: {
  motion: "floaty" | "drift";
  size: number;
  /** Color de relleno (ignorado si ring) */
  color?: string;
  blur?: number;
  /** Solo contorno, sin relleno ni desenfoque */
  ring?: boolean;
  /** Posición: top/right/bottom/left */
  style: CSSProperties;
}) {
  return (
    <div
      aria-hidden="true"
      className={motion}
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: "50%",
        pointerEvents: "none",
        ...(ring
          ? { border: "1px solid rgb(245 239 231 / 0.12)" }
          : { background: color, filter: `blur(${blur}px)` }),
        ...style,
      }}
    />
  );
}
