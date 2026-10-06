import type { ProjectKey } from "@/content";
import s from "./mockups.module.css";

/**
 * Mockups CSS de los proyectos sin captura (PRJ-6). Son ilustraciones decorativas:
 * su texto imita la interfaz de cada app, por eso no se traduce y va aria-hidden.
 * Cuando llega la captura real de un proyecto (site.ts → image), su mockup se elimina.
 */

function WobberMockup() {
  return (
    <div className={s.stage}>
      <div className={`${s.phone} ${s.wobber}`}>
        <div className={s.wobberBrand}>WOBBER</div>
        <div className={s.wobberUser}>
          <span className={s.avatar} />
          <span>@ruta_andina</span>
        </div>
        <div className={s.wobberMap}>
          <svg viewBox="0 0 140 76" preserveAspectRatio="none">
            <path d="M8 64 C30 20 60 70 80 34 S120 20 132 10" fill="none" stroke="#FF6A00" strokeWidth="4" strokeLinecap="round" strokeDasharray="1 8" />
            <circle cx="8" cy="64" r="5" fill="#F2F0EA" />
            <circle cx="132" cy="10" r="5" fill="#FF6A00" />
          </svg>
        </div>
        <div className={s.small}>Rodada del domingo · 240 km</div>
      </div>
    </div>
  );
}

function GlikMockup() {
  const users: Array<[string, string, boolean]> = [
    ["ana.r", "admin", true],
    ["carlos.m", "editor", true],
    ["luisa.p", "lector", false],
  ];
  return (
    <div className={`${s.stage} ${s.glikStage}`}>
      <div className={s.window}>
        <div className={s.titlebar}>
          <span className={s.light} style={{ background: "#FF6B6B" }} />
          <span className={s.light} style={{ background: "#FFD23F" }} />
          <span className={s.light} style={{ background: "#39FF88" }} />
          <span>glik / usuarios</span>
        </div>
        <div className={s.users}>
          {users.map(([name, role, active]) => (
            <div key={name} className={s.user}>
              <span>{name}</span>
              <span className={s.dim}>{role}</span>
              <span className={active ? s.on : s.dim}>{active ? "● activo" : "○ pausado"}</span>
            </div>
          ))}
          <div className={s.invite}>+ Invitar usuario</div>
        </div>
      </div>
    </div>
  );
}

function LibreMockup() {
  return (
    <div className={s.stage}>
      <div className={`${s.phone} ${s.libre}`}>
        <div className={s.grid}>
          <svg viewBox="0 0 160 140">
            <path d="M24 120 L24 74 L86 74 L86 34 L132 34" fill="none" stroke="#3355FF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="24" cy="120" r="8" fill="#10183A" />
            <circle cx="132" cy="34" r="9" fill="#3355FF" stroke="#FFFFFF" strokeWidth="3" />
          </svg>
        </div>
        <div className={s.ride}>
          <div className={s.rideTitle}>Centro · 12 min</div>
          <div className={s.rideButton}>Pedir viaje</div>
        </div>
      </div>
    </div>
  );
}

const MOCKUPS: Partial<Record<ProjectKey, () => React.JSX.Element>> = {
  wobber: WobberMockup,
  glik: GlikMockup,
  libre: LibreMockup,
};

/** Mockup del proyecto, o null si no tiene (debe tener captura). */
export function Mockup({ project }: { project: ProjectKey }) {
  const M = MOCKUPS[project];
  return M ? <M /> : null;
}
