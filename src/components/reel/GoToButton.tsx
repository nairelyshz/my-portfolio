"use client";

import type { ReactNode } from "react";
import { useReel } from "./ReelContext";

/** Botón que lleva a un panel desde un Server Component (p. ej. "Ver proyectos", NAV-7). */
export function GoToButton({
  panel,
  className,
  children,
}: {
  panel: number;
  className?: string;
  children: ReactNode;
}) {
  const { goTo } = useReel();
  return (
    <button type="button" className={className} onClick={() => goTo(panel)}>
      {children}
    </button>
  );
}
