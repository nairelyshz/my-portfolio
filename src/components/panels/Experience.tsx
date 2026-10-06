import { site, type Content } from "@/content";
import { Blob } from "../ui/Blob";
import { Emph, Eyebrow } from "../ui/Emph";
import { panelTitleId } from "./Panel";
import styles from "./Experience.module.css";

/** Panel 04 · Experiencia — SPEC §3.5 */
export function Experience({ t }: { t: Content }) {
  const { experience } = t;
  return (
    <>
      <Blob motion="floaty" size={130} color="rgb(255 92 225 / 0.18)" style={{ right: "10%", top: "14%" }} />

      <Eyebrow accent="lime">{experience.eyebrow}</Eyebrow>
      <h2 id={panelTitleId("experiencia")} className={`title ${styles.title}`}>
        <Emph copy={experience.title} accent="amber" />
      </h2>

      <ol className={styles.list}>
        {site.jobs.map((job) => (
          <li key={job.key} className={styles.row}>
            <span className={styles.years}>{job.years}</span>
            <span className={styles.name}>{job.name}</span>
            <span className={styles.detail}>{experience.details[job.key]}</span>
          </li>
        ))}
      </ol>
    </>
  );
}
