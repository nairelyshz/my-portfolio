import type { ReactNode } from "react";
import type { PanelId } from "@/content";
import styles from "./Panel.module.css";

/**
 * Contenedor de un panel del carrete. `data-panel` lo usa A11Y-FOCUS para saber a qué
 * panel pertenece el elemento enfocado. Fondos alternos `--bg` / `--bg-alt` (SPEC §2).
 */
export function Panel({
  id,
  index,
  className,
  children,
}: {
  id: PanelId;
  index: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      data-panel={index}
      aria-labelledby={`${id}-title`}
      className={[styles.panel, index % 2 === 1 ? styles.alt : "", className ?? ""].join(" ")}
    >
      {children}
    </section>
  );
}

/** id del titular de un panel, para aria-labelledby */
export const panelTitleId = (id: PanelId) => `${id}-title`;
