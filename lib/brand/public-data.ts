import type { BrandConfig, BrandSectionDefinition } from "@/lib/brand/types";
import {
  formatBrandBezier,
  getBrandColorFormats,
  getBrandMotionSnippets,
  type BrandColorFormats,
  type BrandMotionSnippets,
} from "@/lib/brand/values";

export const PUBLIC_BRAND_SCHEMA_VERSION = "1.0" as const;

export type PublicBrandConfig = Omit<BrandConfig, "assetsBasePath"> & {
  assetsBaseUrl: string;
};

export interface PublicBrandColorValue {
  name: string;
  formats: BrandColorFormats;
  foreground: "light" | "dark";
  proportion: number;
}

export interface PublicBrandMotionValue {
  id: string;
  name: string;
  description: string;
  bezier: readonly [number, number, number, number];
  cssTimingFunction: string;
  durationMs: number;
  staggerMs: number | null;
  snippets: BrandMotionSnippets;
}

export interface PublicBrandDownload {
  category: "complete-pack" | "logo" | "typeface" | "color" | "imagery";
  label: string;
  url: string;
}

export interface PublicBrandDocument {
  schemaVersion: typeof PUBLIC_BRAND_SCHEMA_VERSION;
  canonicalUrl: string;
  dataUrl: string;
  sectionOrder: readonly BrandSectionDefinition[];
  brand: PublicBrandConfig;
  implementation: {
    colors: readonly PublicBrandColorValue[];
    motion: readonly PublicBrandMotionValue[];
    stylesheets: readonly string[];
    downloads: readonly PublicBrandDownload[];
  };
}

function toAbsoluteUrl(path: string, siteUrl: string) {
  return new URL(path, siteUrl).toString();
}

function absolutizeBrandValues(
  value: unknown,
  assetsBasePath: string,
  siteUrl: string,
): unknown {
  if (typeof value === "string") {
    return value === assetsBasePath || value.startsWith(`${assetsBasePath}/`)
      ? toAbsoluteUrl(value, siteUrl)
      : value;
  }

  if (Array.isArray(value)) {
    return value.map((item) =>
      absolutizeBrandValues(item, assetsBasePath, siteUrl),
    );
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        absolutizeBrandValues(item, assetsBasePath, siteUrl),
      ]),
    );
  }

  return value;
}

function createPublicConfig(
  brand: BrandConfig,
  siteUrl: string,
): PublicBrandConfig {
  const { assetsBasePath, ...config } = brand;
  const absoluteConfig = absolutizeBrandValues(
    config,
    assetsBasePath,
    siteUrl,
  ) as Omit<BrandConfig, "assetsBasePath">;

  return {
    ...absoluteConfig,
    assetsBaseUrl: toAbsoluteUrl(assetsBasePath, siteUrl),
  };
}

export function createPublicBrandDocument(
  brand: BrandConfig,
  sections: readonly BrandSectionDefinition[],
  siteUrl: string,
): PublicBrandDocument {
  const publicBrand = createPublicConfig(brand, siteUrl);
  const stylesheets = [
    publicBrand.assets.fontStylesheetSrc,
    publicBrand.assets.motionStylesheetSrc,
    ...publicBrand.assets.colorFiles
      .filter((asset) => /\.css(?:[?#]|$)/i.test(asset.src))
      .map((asset) => asset.src),
  ].filter((source): source is string => Boolean(source));

  const downloads: PublicBrandDownload[] = [];
  if (publicBrand.assets.completePackSrc) {
    downloads.push({
      category: "complete-pack",
      label: "Complete brand pack",
      url: publicBrand.assets.completePackSrc,
    });
  }
  downloads.push(
    ...publicBrand.assets.logoFiles.map((asset) => ({
      category: "logo" as const,
      label: asset.name,
      url: asset.src,
    })),
    ...publicBrand.assets.typefaces.map((asset) => ({
      category: "typeface" as const,
      label: asset.label,
      url: asset.src,
    })),
    ...publicBrand.assets.colorFiles.map((asset) => ({
      category: "color" as const,
      label: asset.label,
      url: asset.src,
    })),
    ...publicBrand.assets.imagery.map((asset) => ({
      category: "imagery" as const,
      label: asset.label,
      url: asset.src,
    })),
  );

  return {
    schemaVersion: PUBLIC_BRAND_SCHEMA_VERSION,
    canonicalUrl: toAbsoluteUrl(`/brand/${brand.slug}`, siteUrl),
    dataUrl: toAbsoluteUrl(`/brand/${brand.slug}/brand.json`, siteUrl),
    sectionOrder: sections,
    brand: publicBrand,
    implementation: {
      colors: brand.colors.items.map((color) => ({
        name: color.name,
        formats: getBrandColorFormats(color.hex),
        foreground: color.foreground,
        proportion: color.proportion,
      })),
      motion: brand.motion.eases.map((ease) => ({
        id: ease.id,
        name: ease.name,
        description: ease.description,
        bezier: ease.bezier,
        cssTimingFunction: `cubic-bezier(${formatBrandBezier(ease.bezier)})`,
        durationMs: ease.durationMs,
        staggerMs: ease.staggerMs ?? null,
        snippets: getBrandMotionSnippets(brand.slug, ease),
      })),
      stylesheets: [...new Set(stylesheets)],
      downloads,
    },
  };
}

export function serializePublicBrandDocument(document: PublicBrandDocument) {
  return JSON.stringify(document, null, 2)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
