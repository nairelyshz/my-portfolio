import { RootDocument } from "@/components/RootDocument";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata("en");

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <RootDocument locale="en">{children}</RootDocument>;
}
