import Image from "next/image";
import { site, type Content } from "@/content";
import { GoToButton } from "../reel/GoToButton";
import { ScrollHint } from "../reel/ScrollHint";
import { Blob } from "../ui/Blob";
import { Eyebrow } from "../ui/Emph";
import { panelTitleId } from "./Panel";
import styles from "./Hero.module.css";

/** Panel 01 · Inicio — SPEC §3.2 */
export function Hero({ t, projectsIndex }: { t: Content; projectsIndex: number }) {
  const { hero } = t;
  return (
    <>
      <Blob motion="floaty" size={140} color="rgb(255 176 58 / 0.22)" style={{ right: "8%", top: "10%" }} />
      <Blob motion="drift" size={110} color="rgb(255 92 225 / 0.2)" blur={36} style={{ left: "40%", bottom: "12%" }} />
      <Blob motion="drift" size={64} ring style={{ left: "5%", bottom: "14%" }} />

      <div className={styles.hero}>
        <div className={styles.copy}>
          <Eyebrow accent="amber">{hero.eyebrow}</Eyebrow>
          <h1 id={panelTitleId("inicio")} className={styles.h1}>
            <span className={`grad serif ${styles.first}`}>{hero.firstName}</span>
            <span className={styles.last}>{hero.lastName}</span>
          </h1>
          <p className={styles.lead}>{hero.lead}</p>
          <div className={styles.ctas}>
            <a href={`mailto:${site.email}`} className={`pill ${styles.primary}`}>
              {hero.ctaPrimary}
              <span className={styles.arrow} aria-hidden="true">
                →
              </span>
            </a>
            <GoToButton panel={projectsIndex} className={`pill ${styles.secondary}`}>
              {hero.ctaSecondary}
            </GoToButton>
          </div>
          {/* Escritorio: anclada abajo al centro del hero. Móvil: en el flujo, bajo los CTA. */}
          <ScrollHint pointer={t.nav.hintPointer} touch={t.nav.hintTouch} />
        </div>

        <div className={styles.photoCol}>
          <div className={styles.photo}>
            <svg className={`spin ${styles.ring}`} viewBox="0 0 200 200" aria-hidden="true">
              <defs>
                <path id="hero-ring" d="M100,100 m-88,0 a88,88 0 1,1 176,0 a88,88 0 1,1 -176,0" />
              </defs>
              <text className={styles.ringText}>
                <textPath href="#hero-ring">{hero.ring}</textPath>
              </text>
            </svg>
            <div className={styles.frame} aria-hidden="true" />
            <Image
              src={site.photo.src}
              width={site.photo.width}
              height={site.photo.height}
              alt={hero.photoAlt}
              priority
              sizes="(max-width: 820px) 26vh, 440px"
              className={styles.img}
            />
            <span className={`floaty ${styles.badge}`}>{hero.badge}</span>
          </div>
        </div>
      </div>
    </>
  );
}
