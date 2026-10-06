import { Instrument_Serif, Space_Grotesk } from "next/font/google";

/** Cuerpo, UI y titulares — SPEC §6. */
export const grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

/** Palabras de énfasis, nombre y cifras — SPEC §6. */
export const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-serif",
  display: "swap",
});

export const fontVariables = `${grotesk.variable} ${serif.variable}`;
