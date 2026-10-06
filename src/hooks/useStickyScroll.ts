"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * Carrete horizontal movido por el scroll vertical nativo — SPEC §2.1, PLAN §2.
 *
 * - El progreso 0→1 sale de `scrollY` sobre la distancia de scroll del contenedor exterior.
 * - El transform se escribe directo en el DOM dentro de rAF; React solo se re-renderiza
 *   cuando cambia el panel activo (D3).
 */

interface Metrics {
  /** scrollY en el que empieza el carrete */
  start: number;
  /** Distancia de scroll que recorre el carrete completo */
  range: number;
  /** Ancho del sticky en la última medición (detecta rotación/resize horizontal) */
  width: number;
}

/** Tras este tiempo sin eventos de scroll se considera que el usuario no está desplazando. */
const SCROLL_IDLE_MS = 200;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const progressOf = (m: Metrics) => clamp01((window.scrollY - m.start) / m.range);
const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Devuelve los refs que el carrete debe asignar:
 * `outer` (aporta la distancia de scroll), `sticky` (100dvh), `viewport` (overflow: clip)
 * y `track` (fila de paneles que se traslada).
 */
export function useStickyScroll(count: number) {
  const outer = useRef<HTMLDivElement>(null);
  const sticky = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const metrics = useRef<Metrics>({ start: 0, range: 1, width: 0 });
  const frame = useRef<number | null>(null);

  const measure = useCallback(() => {
    const o = outer.current;
    const s = sticky.current;
    if (!o || !s) return;
    metrics.current = {
      start: o.getBoundingClientRect().top + window.scrollY,
      range: Math.max(1, o.offsetHeight - s.offsetHeight),
      width: s.clientWidth,
    };
  }, []);

  const render = useCallback(() => {
    frame.current = null;
    const p = progressOf(metrics.current);
    if (track.current) {
      // D2: % del ancho del propio track, no vw.
      track.current.style.transform = `translate3d(${-p * (count - 1) * 100}%, 0, 0)`;
    }
    // NAV-8: la pista de scroll se oculta en cuanto hay desplazamiento.
    outer.current?.toggleAttribute("data-scrolled", p > 0.005);
    const i = Math.round(p * (count - 1));
    if (i !== activeRef.current) {
      activeRef.current = i;
      setActive(i);
    }
  }, [count]);

  /** scrollY en el que el panel i queda alineado — SPEC §2.1 panelTop(i). */
  const panelTop = useCallback(
    (i: number) => metrics.current.start + (i * metrics.current.range) / (count - 1),
    [count],
  );

  /** NAV-2/3/4/6/7. NAV-9: con reduced motion el salto es instantáneo. */
  const goTo = useCallback(
    (i: number, opts?: { instant?: boolean }) => {
      const target = Math.min(count - 1, Math.max(0, i));
      window.scrollTo({
        top: panelTop(target),
        behavior: opts?.instant || prefersReducedMotion() ? "instant" : "smooth",
      });
    },
    [count, panelTop],
  );

  // Pintar antes del primer paint: evita un frame desalineado al recargar a mitad de página.
  useLayoutEffect(() => {
    measure();
    render();
  }, [measure, render]);

  useEffect(() => {
    let lastScroll = 0;

    const onScroll = () => {
      lastScroll = performance.now();
      if (frame.current == null) frame.current = requestAnimationFrame(render);
    };

    // NAV-10: conservar el progreso al redimensionar o rotar.
    const onResize = () => {
      const before = metrics.current;
      const p = progressOf(before);
      measure();
      const after = metrics.current;
      // Un cambio solo de alto mientras se hace scroll es la barra de URL de iOS:
      // re-anclar ahí cortaría la inercia, así que solo se repinta.
      const widthChanged = after.width !== before.width;
      const scrolling = performance.now() - lastScroll < SCROLL_IDLE_MS;
      if (widthChanged || !scrolling) {
        const top = after.start + p * after.range;
        if (Math.abs(window.scrollY - top) > 1) window.scrollTo({ top, behavior: "instant" });
      }
      render();
    };

    // A11Y-FOCUS: al enfocar un elemento de otro panel, alinear ese panel.
    const vp = viewport.current;
    const onFocusIn = (e: FocusEvent) => {
      // overflow: clip evita el auto-scroll horizontal; esto cubre navegadores con fallback a hidden.
      if (vp) vp.scrollLeft = 0;
      const panel = (e.target as Element | null)?.closest<HTMLElement>("[data-panel]");
      if (!panel) return;
      const i = Number(panel.dataset.panel);
      if (Math.abs(window.scrollY - panelTop(i)) > 1) goTo(i, { instant: true });
    };

    const ro = new ResizeObserver(onResize);
    if (sticky.current) ro.observe(sticky.current);
    if (outer.current) ro.observe(outer.current);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("orientationchange", onResize);
    vp?.addEventListener("focusin", onFocusIn);

    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("orientationchange", onResize);
      vp?.removeEventListener("focusin", onFocusIn);
      if (frame.current != null) cancelAnimationFrame(frame.current);
      frame.current = null;
    };
  }, [goTo, measure, panelTop, render]);

  return { refs: { outer, sticky, viewport, track }, active, goTo };
}
