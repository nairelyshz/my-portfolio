import { site, type Content, type StatKey } from "@/content";
import { Blob } from "../ui/Blob";
import { Emph, Eyebrow } from "../ui/Emph";
import { panelTitleId } from "./Panel";
import styles from "./About.module.css";

const STATS: StatKey[] = ["years", "teams", "products", "platforms"];

/** Panel 02 · Sobre mí — SPEC §3.3 */
export function About({ t }: { t: Content }) {
  const { about } = t;
  return (
    <>
      <Blob motion="floaty" size={120} color="rgb(198 241 74 / 0.18)" blur={36} style={{ right: "12%", top: "18%" }} />

      <Eyebrow accent="pink">{about.eyebrow}</Eyebrow>
      <h2 id={panelTitleId("sobre-mi")} className={`title ${styles.title}`}>
        <Emph copy={about.title} accent="amber" />
      </h2>
      <p className={styles.body}>{about.body}</p>

      <dl className={styles.stats}>
        {STATS.map((k) => (
          <div key={k} className={styles.stat}>
            <dt className={styles.label}>{about.stats[k]}</dt>
            <dd className={`grad serif ${styles.value}`}>{site.stats[k]}</dd>
          </div>
        ))}
      </dl>

      <ul className={styles.chips}>
        {about.chips.map((c, i) => (
          <li key={c} className={`chip ${i === about.chips.length - 1 ? styles.accent : ""}`}>
            {c}
          </li>
        ))}
      </ul>
    </>
  );
}
