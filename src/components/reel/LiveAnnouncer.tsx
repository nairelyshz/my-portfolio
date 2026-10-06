"use client";

import { useEffect, useRef } from "react";
import type { Content, PanelId } from "@/content";
import { fmt } from "@/lib/format";
import { useReel } from "./ReelContext";

/** Anuncia el cambio de panel a lectores de pantalla — SPEC §8. No anuncia al montar. */
export function LiveAnnouncer({ nav, panels }: { nav: Content["nav"]; panels: readonly PanelId[] }) {
  const { active, count } = useReel();
  const region = useRef<HTMLParagraphElement>(null);
  /** Panel de partida hasta el primer cambio; luego null. */
  const initial = useRef<number | null>(active);

  useEffect(() => {
    const el = region.current;
    if (!el) return;
    if (initial.current !== null) {
      // Primer render: no se anuncia la posición de partida.
      if (initial.current === active) return;
      initial.current = null;
    }
    const id = panels[active];
    el.textContent = id
      ? fmt(nav.announce, { n: active + 1, total: count, panel: nav.panels[id] })
      : "";
  }, [active, count, nav, panels]);

  return <p ref={region} className="sr-only" aria-live="polite" />;
}
