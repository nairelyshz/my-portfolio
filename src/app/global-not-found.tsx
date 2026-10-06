import "@/styles/globals.css";
import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import { LOCALE_PATH } from "@/content";

export const metadata: Metadata = {
  title: "404 · Nairelys Hernández",
  robots: { index: false },
};

/** 404 bilingüe: con dos root layouts no hay idioma de la ruta del que partir. */
export default function GlobalNotFound() {
  return (
    <html lang="es" className={fontVariables}>
      <body>
        <main
          style={{
            minHeight: "100dvh",
            display: "grid",
            placeContent: "center",
            gap: 16,
            padding: "0 var(--gx)",
            textAlign: "center",
          }}
        >
          <p className="grad serif" style={{ fontSize: "var(--fs-h1)", lineHeight: 1 }}>
            404
          </p>
          <p style={{ fontSize: "var(--fs-body)", color: "var(--muted)" }}>
            Esta página no existe. <span lang="en">This page doesn’t exist.</span>
          </p>
          <p style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <a href={LOCALE_PATH.es} style={{ color: "var(--pink)", padding: "12px 0" }}>
              Ir al inicio
            </a>
            <span aria-hidden="true" style={{ color: "var(--line)", padding: "12px 0" }}>
              ·
            </span>
            <a href={LOCALE_PATH.en} lang="en" style={{ color: "var(--pink)", padding: "12px 0" }}>
              Go home
            </a>
          </p>
        </main>
      </body>
    </html>
  );
}
