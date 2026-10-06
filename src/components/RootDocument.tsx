import "@/styles/globals.css";
import type { Locale } from "@/content";
import { fontVariables } from "@/lib/fonts";

/**
 * <html> compartido por los dos root layouts (D1): cada route group pasa su idioma
 * y el documento sale con su propio `lang` (I18N-4).
 */
export function RootDocument({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return (
    <html lang={locale} className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
