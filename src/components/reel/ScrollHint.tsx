import styles from "./ScrollHint.module.css";

/**
 * Pista "haz scroll" del panel 01 — NAV-8.
 * El texto depende del tipo de puntero (CSS) y se oculta con [data-scrolled] (lo pone useStickyScroll).
 */
export function ScrollHint({ pointer, touch }: { pointer: string; touch: string }) {
  return (
    <p className={styles.hint} aria-hidden="true" data-scroll-hint="">
      <span className={styles.pointer}>{pointer}</span>
      <span className={styles.touch}>{touch}</span>
    </p>
  );
}
