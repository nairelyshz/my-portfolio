import Image from "next/image";
import { site, whatsappUrl, type Content } from "@/content";
import { Blob } from "../ui/Blob";
import { Emph, Eyebrow } from "../ui/Emph";
import { WhatsAppIcon } from "../ui/icons";
import { panelTitleId } from "./Panel";
import styles from "./Contact.module.css";

/** Panel 06 · Contacto — SPEC §3.7, §4 */
export function Contact({ t }: { t: Content }) {
  const { contact } = t;
  const wa = whatsappUrl();

  return (
    <>
      <Blob motion="floaty" size={160} color="rgb(198 241 74 / 0.14)" blur={44} style={{ right: "14%", top: "18%" }} />

      <div className={styles.head}>
        <Image
          src={site.photo.src}
          width={site.photo.width}
          height={site.photo.height}
          alt=""
          sizes="56px"
          className={styles.avatar}
        />
        <Eyebrow accent="pink">{contact.eyebrow}</Eyebrow>
      </div>

      <h2 id={panelTitleId("contacto")} className="title">
        <Emph copy={contact.title} accent="amber" />
      </h2>

      <a href={`mailto:${site.email}`} className={`grad ${styles.email}`}>
        {site.email}
      </a>

      <div className={styles.links}>
        <a href={site.linkedin} target="_blank" rel="noopener" className={`pill ${styles.linkedin}`}>
          LinkedIn
        </a>
        <a href={site.github} target="_blank" rel="noopener" className={`pill ${styles.outline}`}>
          GitHub
        </a>
        {wa && (
          <a href={wa} target="_blank" rel="noopener" className={`pill ${styles.whatsapp}`}>
            <WhatsAppIcon />
            WhatsApp
          </a>
        )}
      </div>
    </>
  );
}
