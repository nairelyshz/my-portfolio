"use client";

import { createContext, useContext } from "react";

export interface ReelState {
  /** Índice del panel activo (0-based) */
  active: number;
  count: number;
  goTo: (i: number, opts?: { instant?: boolean }) => void;
}

export const ReelContext = createContext<ReelState | null>(null);

export function useReel(): ReelState {
  const ctx = useContext(ReelContext);
  if (!ctx) throw new Error("useReel debe usarse dentro de <Reel>");
  return ctx;
}
