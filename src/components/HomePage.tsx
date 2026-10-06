import type { ReactNode } from "react";
import { getContent, site, type Locale, type PanelId } from "@/content";
import { About } from "./panels/About";
import { Contact } from "./panels/Contact";
import { Experience } from "./panels/Experience";
import { Hero } from "./panels/Hero";
import { Panel } from "./panels/Panel";
import { Projects } from "./panels/Projects";
import { Stack } from "./panels/Stack";
import { Reel } from "./reel/Reel";

/** Ensambla el carrete con sus 6 paneles — SPEC §2, §3. */
export function HomePage({ locale }: { locale: Locale }) {
  const t = getContent(locale);

  const panels: Record<PanelId, ReactNode> = {
    inicio: <Hero t={t} projectsIndex={site.panels.indexOf("proyectos")} />,
    "sobre-mi": <About t={t} />,
    stack: <Stack t={t} />,
    experiencia: <Experience t={t} />,
    proyectos: (
      <Projects copy={t.projects} projects={site.projects} panelIndex={site.panels.indexOf("proyectos")} />
    ),
    contacto: <Contact t={t} />,
  };

  return (
    <Reel locale={locale} panels={site.panels} header={t.header} nav={t.nav}>
      {site.panels.map((id, i) => (
        <Panel key={id} id={id} index={i}>
          {panels[id]}
        </Panel>
      ))}
    </Reel>
  );
}
