import Image from "next/image";
import type { ProjectConfig } from "@/content";
import { Mockup } from "./Mockups";
import mock from "./mockups.module.css";
import styles from "./ProjectVisual.module.css";

/**
 * Visual cuadrado del proyecto seleccionado — PRJ-4, PRJ-6, PRJ-7.
 * Cada cambio revela el visual nuevo en círculo (desde el centro) sobre el anterior,
 * que queda debajo como capa decorativa.
 */
export function ProjectVisual({
  project,
  previous,
  alt,
}: {
  project: ProjectConfig;
  previous: ProjectConfig | null;
  alt: string;
}) {
  return (
    <div className={styles.visual}>
      {previous && previous.key !== project.key && (
        <div key={`prev-${previous.key}`} className={styles.layer} aria-hidden="true">
          <Layer project={previous} alt="" />
        </div>
      )}
      <div key={project.key} className={`${styles.layer} ${previous ? styles.reveal : ""}`}>
        <Layer project={project} alt={alt} />
      </div>
    </div>
  );
}

/** Fondo del proyecto + captura (llenando el cuadrado o en un teléfono) o mockup CSS. */
function Layer({ project, alt }: { project: ProjectConfig; alt: string }) {
  const { image } = project;
  return (
    <div className={styles.fill} style={{ background: project.bg }}>
      {image && project.imageFrame === "phone" ? (
        <div className={mock.stage}>
          <div className={`${mock.phone} ${styles.phone}`} style={{ background: project.screenBg }}>
            <Image
              src={image.src}
              width={image.width}
              height={image.height}
              alt={alt}
              sizes="(max-width: 820px) 14vh, 260px"
              className={styles.screen}
            />
          </div>
        </div>
      ) : image ? (
        <Image
          src={image.src}
          width={image.width}
          height={image.height}
          alt={alt}
          sizes="(max-width: 820px) 30vh, 560px"
          className={styles.img}
        />
      ) : (
        <div className={styles.fill} aria-hidden="true">
          <Mockup project={project.key} />
        </div>
      )}
    </div>
  );
}
