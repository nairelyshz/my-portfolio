"use client";

import { useEffect, useState } from "react";
import { getTags, type Content, type ProjectConfig, type ProjectKey } from "@/content";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { fmt } from "@/lib/format";
import { ProjectVisual } from "../mockups/ProjectVisual";
import { useReel } from "../reel/ReelContext";
import { Blob } from "../ui/Blob";
import { PauseIcon, PlayIcon } from "../ui/icons";
import { panelTitleId } from "./Panel";
import styles from "./Projects.module.css";

/** Tiempo que cada proyecto queda en pantalla durante el recorrido (PRJ-7). */
export const AUTOPLAY_MS = 2000;

/**
 * Panel 05 · Proyectos — SPEC §3.6, PRJ-1…10.
 * Recorrido automático: cada AUTOPLAY_MS pasa al siguiente proyecto (cíclico) y el visual
 * nuevo se revela en círculo sobre el anterior.
 */
export function Projects({
  copy,
  projects,
  panelIndex,
}: {
  copy: Content["projects"];
  projects: ProjectConfig[];
  panelIndex: number;
}) {
  const { active } = useReel();
  const reducedMotion = usePrefersReducedMotion();

  /** `previous` queda debajo mientras el nuevo visual se revela en círculo. */
  const [view, setView] = useState<{ selected: ProjectKey; previous: ProjectKey | null }>({
    selected: projects[0]?.key ?? "cuento",
    previous: null,
  });
  /** null = el usuario no ha decidido: se reproduce salvo que pida reducir movimiento (PRJ-10). */
  const [userPlaying, setUserPlaying] = useState<boolean | null>(null);
  const [hovered, setHovered] = useState(false);
  /**
   * Tras pulsar "Reanudar" el cursor sigue encima: el hover no pausa hasta que salga del panel.
   * (Un flag y no solo `hovered=false`: al cambiar el icono bajo el cursor, WebKit dispara un
   * mouseover nuevo que React interpreta como otra entrada.)
   */
  const [hoverIgnored, setHoverIgnored] = useState(false);
  const [focused, setFocused] = useState(false);

  const playing = userPlaying ?? !reducedMotion;
  // PRJ-8: solo corre con el panel en pantalla y sin cursor ni foco encima.
  const running = playing && active === panelIndex && !(hovered && !hoverIgnored) && !focused;

  const select = (key: ProjectKey) =>
    setView((v) => (v.selected === key ? v : { selected: key, previous: v.selected }));

  // PRJ-7: avanzar al siguiente (cíclico). El temporizador se reinicia en cada cambio y al reanudar.
  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => {
      setView((v) => {
        const i = projects.findIndex((p) => p.key === v.selected);
        const next = projects[(i + 1) % projects.length];
        return next ? { selected: next.key, previous: v.selected } : v;
      });
    }, AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [running, view.selected, projects]);

  const project = projects.find((p) => p.key === view.selected) ?? projects[0];
  if (!project) return null;
  const previous = projects.find((p) => p.key === view.previous) ?? null;
  const item = copy.items[project.key];
  const tags = getTags(item.tags, project);

  return (
    <div
      className={styles.root}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setHoverIgnored(false);
      }}
    >
      <Blob motion="drift" size={140} color="rgb(255 176 58 / 0.18)" blur={44} style={{ right: "18%", top: "18%" }} />

      <div className={styles.split}>
        <div className={styles.info}>
          <div className={styles.headRow}>
            <h2 id={panelTitleId("proyectos")} className={`eyebrow ${styles.heading}`}>
              {fmt(copy.eyebrow, { n: project.n })}
            </h2>
            {/* PRJ-9 / WCAG 2.2.2: el movimiento automático siempre se puede pausar */}
            <button
              type="button"
              className={styles.toggle}
              aria-label={playing ? copy.autoplayPause : copy.autoplayPlay}
              onClick={() => {
                // Reanudar con el cursor encima debe arrancar ya (ver hoverIgnored).
                if (!playing) setHoverIgnored(true);
                setUserPlaying(!playing);
              }}
            >
              {playing ? <PauseIcon /> : <PlayIcon />}
            </button>
          </div>

          {/* PRJ-8: recorrer la lista con teclado pausa el recorrido (el botón de pausa no) */}
          <ul
            className={styles.list}
            aria-label={copy.listLabel}
            onFocus={() => setFocused(true)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
            }}
          >
            {projects.map((p) => (
              <li key={p.key}>
                <button
                  type="button"
                  className={styles.item}
                  aria-pressed={p.key === project.key}
                  onClick={() => {
                    select(p.key);
                    setUserPlaying(false); // PRJ-9: elegir un proyecto detiene el recorrido
                  }}
                >
                  <span className={styles.n}>{p.n}</span>
                  <span className={styles.name}>{copy.items[p.key].name}</span>
                </button>
              </li>
            ))}
          </ul>

          {/* Durante el recorrido no se anuncia cada cambio (sería ruido cada 2 s) */}
          <p className={styles.desc} aria-live={playing ? "off" : "polite"}>
            {item.desc}
          </p>
          {tags.length > 0 && (
            <ul className={styles.tags}>
              {tags.map((tag) => (
                <li key={tag} className="chip">
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={styles.visualCol}>
          <ProjectVisual project={project} previous={previous} alt={item.visualAlt} />
        </div>
      </div>
    </div>
  );
}
