"use client";

import { LOCALE_LABEL, LOCALE_PATH, LOCALES, site, type Content, type Locale } from "@/content";
import { useReel } from "./ReelContext";
import styles from "./ReelHeader.module.css";

/** Barra superior — SPEC §2 (diagrama), NAV-6, I18N-2. */
export function ReelHeader({ locale, header }: { locale: Locale; header: Content["header"] }) {
  const { goTo } = useReel();

  return (
    <header className={styles.header}>
      <button type="button" className={styles.brand} onClick={() => goTo(0)}>
        <span className={`${styles.dot} pulse`} aria-hidden="true" />
        <span className={styles.name}>{site.name}</span>
      </button>

      <div className={styles.links}>
        <a href={`mailto:${site.email}`} className={`${styles.link} ${styles.email}`}>
          {site.email}
        </a>
        <span className={`${styles.sep} ${styles.email}`} aria-hidden="true">
          ·
        </span>
        <a href={site.github} className={`${styles.link} ${styles.social}`} target="_blank" rel="noopener">
          GitHub
        </a>
        <span className={`${styles.sep} ${styles.social}`} aria-hidden="true">
          ·
        </span>
        <a href={site.linkedin} className={`${styles.link} ${styles.social}`} target="_blank" rel="noopener">
          LinkedIn
        </a>

        <nav aria-label={header.langLabel} className={styles.lang}>
          {LOCALES.map((l) => (
            <a
              key={l}
              href={LOCALE_PATH[l]}
              hrefLang={l}
              lang={l}
              aria-current={l === locale ? "true" : undefined}
              className={styles.langLink}
            >
              {LOCALE_LABEL[l]}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
