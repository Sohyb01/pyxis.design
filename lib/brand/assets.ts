import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

import type {
  BrandApplication,
  BrandConfig,
  BrandDefinition,
  BrandDownloadAsset,
  BrandImage,
  BrandLogoFile,
  BrandMotionExample,
  BrandMotionMedia,
} from "@/lib/brand/types";

const PNG_SIGNATURE = "89504e470d0a1a0a";

function publicAssetPath(slug: string, relativePath: string) {
  return `/brand/${slug}/${relativePath.replaceAll("\\", "/")}`;
}

function publicFilePath(slug: string, relativePath: string) {
  return path.resolve(process.cwd(), "public", "brand", slug, relativePath);
}

function assertRequiredFile(
  brandName: string,
  slug: string,
  relativePath: string,
) {
  const filePath = publicFilePath(slug, relativePath);
  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    throw new Error(
      `Brand "${brandName}" is missing required static asset "${publicAssetPath(slug, relativePath)}".`,
    );
  }
}

function readPngDimensions(filePath: string) {
  const buffer = readFileSync(filePath);
  if (
    buffer.length < 24 ||
    buffer.subarray(0, 8).toString("hex") !== PNG_SIGNATURE ||
    buffer.subarray(12, 16).toString("ascii") !== "IHDR"
  ) {
    throw new Error(`Expected a valid PNG file at "${filePath}".`);
  }

  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

function discoverNumberedPngs(
  brandName: string,
  slug: string,
  folder: "moodboard" | "applications",
) {
  const folderPath = publicFilePath(slug, folder);
  if (!existsSync(folderPath) || !statSync(folderPath).isDirectory()) {
    throw new Error(
      `Brand "${brandName}" must provide the folder "${publicAssetPath(slug, folder)}".`,
    );
  }

  const files = readdirSync(folderPath, { withFileTypes: true })
    .filter(
      (entry) => entry.isFile() && /^[1-9]\d*\.png$/i.test(entry.name),
    )
    .map((entry) => ({
      name: entry.name,
      index: Number.parseInt(entry.name, 10),
      filePath: path.join(folderPath, entry.name),
      src: publicAssetPath(slug, `${folder}/${entry.name}`),
    }))
    .sort((left, right) => left.index - right.index);

  files.forEach((file, index) => {
    const expectedIndex = index + 1;
    if (file.index !== expectedIndex) {
      throw new Error(
        `Brand "${brandName}" must number ${folder} PNGs consecutively from 1; expected "${expectedIndex}.png" before "${file.name}".`,
      );
    }
  });

  return files;
}

function resolveMotionExamples<TSlug extends string>(
  brand: BrandDefinition<TSlug>,
): BrandConfig<TSlug>["motion"]["examples"] {
  const media = (
    relativePath: string,
    alt: string,
  ): BrandMotionMedia => ({
    src: publicAssetPath(brand.slug, relativePath),
    alt,
  });

  const resolveExample = (
    example: BrandDefinition<TSlug>["motion"]["examples"][number],
  ): BrandMotionExample => {
    const timing =
      example.durationMs === undefined
        ? {}
        : { durationMs: example.durationMs };

    if (example.kind === "exchange") {
      return {
        id: example.id,
        kind: example.kind,
        label: example.label,
        easeId: example.easeId,
        ...timing,
        images: [
          media("motion/exchange-1.png", example.imageAlts[0]),
          media("motion/exchange-2.png", example.imageAlts[1]),
        ],
      };
    }

    if (example.kind === "carousel") {
      return {
        id: example.id,
        kind: example.kind,
        label: example.label,
        easeId: example.easeId,
        ...timing,
        images: [
          media("motion/carousel-1.png", example.imageAlts[0]),
          media("motion/carousel-2.png", example.imageAlts[1]),
          media("motion/carousel-3.png", example.imageAlts[2]),
        ],
      };
    }

    return {
      id: example.id,
      kind: example.kind,
      label: example.label,
      easeId: example.easeId,
      ...timing,
    };
  };

  return [
    resolveExample(brand.motion.examples[0]),
    resolveExample(brand.motion.examples[1]),
    resolveExample(brand.motion.examples[2]),
    resolveExample(brand.motion.examples[3]),
  ];
}

export function resolveBrandDefinition<const TSlug extends string>(
  brand: BrandDefinition<TSlug>,
): BrandConfig<TSlug> {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(brand.slug)) {
    throw new Error(
      `Brand "${brand.name}" has invalid URL slug "${brand.slug}".`,
    );
  }
  if (brand.assetsBasePath !== `/brand/${brand.slug}`) {
    throw new Error(
      `Brand "${brand.name}" must use assetsBasePath "/brand/${brand.slug}" before static assets can be resolved.`,
    );
  }

  const requiredFiles = [
    "introduction.png",
    "logos/primary-logo.svg",
    "logos/primary-logo-dark.svg",
    "logos/logomark.svg",
    "logos/logomark-dark.svg",
    "motion/exchange-1.png",
    "motion/exchange-2.png",
    "motion/carousel-1.png",
    "motion/carousel-2.png",
    "motion/carousel-3.png",
  ] as const;

  requiredFiles.forEach((relativePath) =>
    assertRequiredFile(brand.name, brand.slug, relativePath),
  );

  const moodboardFiles = discoverNumberedPngs(
    brand.name,
    brand.slug,
    "moodboard",
  );
  const applicationFiles = discoverNumberedPngs(
    brand.name,
    brand.slug,
    "applications",
  );

  const moodboardImages: BrandImage[] = moodboardFiles.map((file, index) => ({
    src: file.src,
    alt:
      brand.moodboard.imageAlts?.[index] ??
      `${brand.name} moodboard image ${file.index}`,
    ...readPngDimensions(file.filePath),
  }));
  const applications: BrandApplication[] = applicationFiles.map(
    (file, index) => ({
      title:
        brand.applications.titles?.[index] ?? `Application ${file.index}`,
      src: file.src,
    }),
  );
  const imagery: BrandDownloadAsset[] = moodboardFiles.map((file, index) => ({
    label:
      brand.assets.imageryLabels?.[index] ??
      `Moodboard image ${file.index}`,
    src: file.src,
  }));
  const logoFiles: BrandLogoFile[] = [
    {
      name: "Primary logo",
      src: publicAssetPath(brand.slug, "logos/primary-logo.svg"),
    },
    {
      name: "Primary logo — dark",
      src: publicAssetPath(brand.slug, "logos/primary-logo-dark.svg"),
    },
    {
      name: "Logomark",
      src: publicAssetPath(brand.slug, "logos/logomark.svg"),
    },
    {
      name: "Logomark — dark",
      src: publicAssetPath(brand.slug, "logos/logomark-dark.svg"),
    },
  ];

  const resolved: BrandConfig<TSlug> = {
    ...brand,
    introduction: {
      ...brand.introduction,
      heroSrc: publicAssetPath(brand.slug, "introduction.png"),
    },
    logo: {
      ...brand.logo,
      primary: {
        ...brand.logo.primary,
        src: publicAssetPath(brand.slug, "logos/primary-logo.svg"),
        darkSrc: publicAssetPath(brand.slug, "logos/primary-logo-dark.svg"),
      },
      mark: {
        ...brand.logo.mark,
        src: publicAssetPath(brand.slug, "logos/logomark.svg"),
        darkSrc: publicAssetPath(brand.slug, "logos/logomark-dark.svg"),
      },
    },
    motion: {
      ...brand.motion,
      examples: resolveMotionExamples(brand),
    },
    moodboard: {
      heading: brand.moodboard.heading,
      description: brand.moodboard.description,
      images: moodboardImages,
    },
    applications: {
      heading: brand.applications.heading,
      description: brand.applications.description,
      items: applications,
    },
    assets: {
      heading: brand.assets.heading,
      description: brand.assets.description,
      fontStylesheetSrc: brand.assets.fontStylesheetSrc,
      motionStylesheetSrc: brand.assets.motionStylesheetSrc,
      completePackSrc: brand.assets.completePackSrc,
      logoFiles,
      typefaces: brand.assets.typefaces,
      colorFiles: brand.assets.colorFiles,
      imagery,
    },
  };

  return resolved;
}
