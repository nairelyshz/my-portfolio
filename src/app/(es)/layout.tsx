import { RootDocument } from "@/components/RootDocument";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata("es");

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <RootDocument locale="es">{children}</RootDocument>;
}
