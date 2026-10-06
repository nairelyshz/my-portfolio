"use client";

import type { Content, PanelId } from "@/content";
import { fmt, pad2 } from "@/lib/format";
import { useReel } from "./ReelContext";
import styles from "./ReelFooter.module.css";

/** Barra inferior: ←, puntos, contador y → — NAV-2…5. */
export function ReelFooter({ nav, panels }: { nav: Content["nav"]; panels: readonly PanelId[] }) {
  const { active, count, goTo } = useReel();
  const currentId = panels[active];
  const currentName = currentId ? nav.panels[currentId] : "";

  return (
    <footer className={styles.footer}>
      <nav aria-label={nav.label} className={styles.nav}>
        <button
          type="button"
          className={styles.prev}
          aria-label={nav.prev}
          disabled={active === 0}
          onClick={() => goTo(active - 1)}
        >
          <span aria-hidden="true">←</span>
        </button>

        <div className={styles.dots}>
          {panels.map((id, i) => (
            <button
              key={id}
              type="button"
              className={styles.dot}
              aria-label={fmt(nav.goTo, { panel: nav.panels[id] })}
              aria-current={i === active ? "step" : undefined}
              onClick={() => goTo(i)}
            >
              <span className={styles.bar} />
            </button>
          ))}
        </div>

        <p className={styles.counter} data-reel-counter="">
          {pad2(active + 1)} / {pad2(count)}
          <span className={styles.counterName}>
            {" · "}
            <span className={styles.current}>{currentName}</span>
          </span>
        </p>

        <button
          type="button"
          className={styles.next}
          aria-label={nav.next}
          onClick={() => goTo(active === count - 1 ? 0 : active + 1)}
        >
          <span aria-hidden="true">→</span>
        </button>
      </nav>
    </footer>
  );
}
