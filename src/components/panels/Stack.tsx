import { site, type Content } from "@/content";
import { Emph, Eyebrow } from "../ui/Emph";
import { Marquee } from "../ui/Marquee";
import { panelTitleId } from "./Panel";
import styles from "./Stack.module.css";

/** Panel 03 · Stack — SPEC §3.4 */
export function Stack({ t }: { t: Content }) {
  const { stack } = t;
  const all = [...site.marquee.rowA, ...site.marquee.rowB].map((m) => m.label);

  return (
    <>
      <Eyebrow accent="amber">{stack.eyebrow}</Eyebrow>
      <h2 id={panelTitleId("stack")} className={`title ${styles.title}`}>
        <Emph copy={stack.title} accent="pink" />
      </h2>

      {/* SPEC §8: equivalente accesible de las marquesinas */}
      <ul className="sr-only" aria-label={stack.srListLabel}>
        {all.map((label) => (
          <li key={label}>{label}</li>
        ))}
      </ul>

      <div className={styles.marquees}>
        <Marquee items={site.marquee.rowA} variant="sans" />
        <Marquee items={site.marquee.rowB} variant="serif" reverse />
      </div>

      <div className={styles.extra}>
        <div>
          <Eyebrow accent="pink">{stack.aiLabel}</Eyebrow>
          <ul className={styles.tools}>
            {site.aiTools.map((tool) => (
              <li key={tool} className={styles.tool}>
                {tool}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <Eyebrow accent="lime">{stack.methodLabel}</Eyebrow>
          <p className={styles.method}>
            <strong>{stack.methodLead}</strong> {stack.methodBody}
          </p>
        </div>
      </div>
    </>
  );
}
