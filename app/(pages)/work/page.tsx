import path from "node:path";
import { readdir } from "node:fs/promises";
import type { Metadata } from "next";
import { siteConfig, socialImage } from "@/app/seo";
import { FooterCta } from "../Homepage Sections/FooterCta";
import WorkArchiveSection from "./sections/WorkArchiveSection";
import type { ArchiveImage, WorkCategory } from "./sections/archiveTypes";

const workDescription =
  "Explore Pyxis work across websites, brand directions, interface studies, and visual systems for startups and digital products.";
const archiveImageExtensions = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".avif",
]);
const archiveFileSorter = new Intl.Collator("en", {
  numeric: true,
  sensitivity: "base",
});

function getArchiveCategory(fileName: string): WorkCategory | null {
  const lowerFileName = fileName.toLowerCase();

  if (lowerFileName.startsWith("branding")) {
    return "branding";
  }

  if (lowerFileName.startsWith("websites") || lowerFileName.startsWith("ui")) {
    return "websites";
  }

  return null;
}

function getArchiveAlt(fileName: string) {
  const baseName = fileName.replace(/\.[^.]+$/, "");
  const readableName = baseName
    .replace(/([a-z])(\d)/gi, "$1 $2")
    .replace(/^ui\b/i, "UI")
    .replace(/^websites\b/i, "Website")
    .replace(/^branding\b/i, "Branding");

  return `${readableName} project`;
}

async function getArchiveImages(): Promise<ArchiveImage[]> {
  const archiveDirectory = path.join(
    process.cwd(),
    "public",
    "projects",
    "archive",
  );
  const fileNames = await readdir(archiveDirectory);

  return fileNames
    .filter((fileName) =>
      archiveImageExtensions.has(path.extname(fileName).toLowerCase()),
    )
    .sort((a, b) => archiveFileSorter.compare(a, b))
    .flatMap((fileName) => {
      const category = getArchiveCategory(fileName);

      if (!category) {
        return [];
      }

      return {
        id: fileName,
        src: `/projects/archive/${fileName}`,
        alt: getArchiveAlt(fileName),
        category,
      };
    });
}

export const metadata: Metadata = {
  title: "Archive",
  description: workDescription,
  alternates: {
    canonical: "/work",
  },
  openGraph: {
    title: `Archive | ${siteConfig.name}`,
    description: workDescription,
    url: "/work",
    siteName: siteConfig.name,
    type: "website",
    images: [
      {
        url: socialImage.openGraphPath,
        width: socialImage.width,
        height: socialImage.height,
        alt: siteConfig.ogAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Recent Work | ${siteConfig.name}`,
    description: workDescription,
    creator: "@minviablemuslim",
    images: [socialImage.twitterPath],
  },
};

export default async function WorkPage() {
  const archiveImages = await getArchiveImages();

  return (
    <main className="min-h-screen relative text-foreground bg-neutral-100">
      {/* Crosshatch Art - Light Pattern */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
              repeating-linear-gradient(22.5deg, transparent, transparent 2px, rgba(75, 85, 99, 0.06) 2px, rgba(75, 85, 99, 0.06) 3px, transparent 3px, transparent 8px),
              repeating-linear-gradient(67.5deg, transparent, transparent 2px, rgba(107, 114, 128, 0.05) 2px, rgba(107, 114, 128, 0.05) 3px, transparent 3px, transparent 8px),
              repeating-linear-gradient(112.5deg, transparent, transparent 2px, rgba(55, 65, 81, 0.04) 2px, rgba(55, 65, 81, 0.04) 3px, transparent 3px, transparent 8px),
              repeating-linear-gradient(157.5deg, transparent, transparent 2px, rgba(31, 41, 55, 0.03) 2px, rgba(31, 41, 55, 0.03) 3px, transparent 3px, transparent 8px)
            `,
        }}
      />
      <WorkArchiveSection archiveImages={archiveImages} />
      <FooterCta />
    </main>
  );
}
