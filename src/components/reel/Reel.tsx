"use client";

import { useMemo, type CSSProperties, type ReactNode } from "react";
import type { Content, Locale, PanelId } from "@/content";
import { useStickyScroll } from "@/hooks/useStickyScroll";
import { LiveAnnouncer } from "./LiveAnnouncer";
import { ReelContext } from "./ReelContext";
import { ReelFooter } from "./ReelFooter";
import { ReelHeader } from "./ReelHeader";
import styles from "./Reel.module.css";

interface ReelProps {
  locale: Locale;
  panels: readonly PanelId[];
  header: Content["header"];
  nav: Content["nav"];
  /** Los paneles (Server Components), en el orden de `panels` */
  children: ReactNode;
}

/** Carrete sticky — SPEC §2, PLAN §2.1. */
export function Reel({ locale, panels, header, nav, children }: ReelProps) {
  const count = panels.length;
  const { refs, active, goTo } = useStickyScroll(count);
  const { outer, sticky, viewport, track } = refs;
  const value = useMemo(() => ({ active, count, goTo }), [active, count, goTo]);

  return (
    <ReelContext value={value}>
      <div
        ref={outer}
        className={styles.outer}
        style={{ "--panels": count } as CSSProperties}
        data-reel-outer=""
      >
        <div ref={sticky} className={styles.sticky} data-reel-sticky="">
          <ReelHeader locale={locale} header={header} />
          <main ref={viewport} className={styles.viewport}>
            <div ref={track} className={styles.track} data-reel-track="">
              {children}
            </div>
          </main>
          <ReelFooter nav={nav} panels={panels} />
          <LiveAnnouncer nav={nav} panels={panels} />
        </div>
      </div>
    </ReelContext>
  );
}
