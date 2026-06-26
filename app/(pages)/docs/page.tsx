import type { Metadata } from "next";
import { DocsBrowser } from "./DocsBrowser";

export const metadata: Metadata = {
  title: "Pyxis Client Docs",
  description:
    "Internal Pyxis client documents rendered as branded HTML documents.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-neutral-100 text-foreground">
      <DocsBrowser />
    </main>
  );
}
