import type { Tone } from "@/content";
import styles from "./Marquee.module.css";

/**
 * Marquesina infinita en CSS puro — SPEC §3.4.
 * La lista se pinta dos veces y la animación desplaza -50%; cada copia lleva su propio
 * padding final para que el bucle no salte. Toda la fila es decorativa (aria-hidden):
 * el panel incluye una lista sr-only equivalente (SPEC §8).
 */
export function Marquee({
  items,
  reverse = false,
  variant,
}: {
  items: Array<{ label: string; tone?: Tone }>;
  reverse?: boolean;
  variant: "sans" | "serif";
}) {
  const group = (
    <span className={styles.group}>
      {items.map((it) => (
        <span key={it.label} style={it.tone ? { color: toneColor[it.tone] } : undefined}>
          {it.label}
        </span>
      ))}
    </span>
  );

  return (
    <div className={styles.row} aria-hidden="true">
      <div className={`marq ${reverse ? "rev" : ""} ${styles[variant]}`}>
        {group}
        {group}
      </div>
    </div>
  );
}

const toneColor: Record<Tone, string> = {
  pink: "var(--pink)",
  lime: "var(--lime)",
  amber: "var(--amber)",
  soft: "rgb(245 239 231 / 0.8)",
};
