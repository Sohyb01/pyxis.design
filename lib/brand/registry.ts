import { brainbotsBrand } from "@/lib/brand/brands/brainbots";
import type { BrandConfig, BrandSectionDefinition } from "@/lib/brand/types";

export const brandSectionLinks = [
  { id: "introduction", label: "Introduction" },
  { id: "logo", label: "Logo" },
  { id: "colors", label: "Color" },
  { id: "typography", label: "Typography" },
  { id: "motion", label: "Motion" },
  { id: "voice-and-tone", label: "Voice and tone" },
  { id: "moodboard", label: "Moodboard" },
  { id: "applications", label: "Applications" },
  { id: "assets", label: "Assets" },
] as const satisfies readonly BrandSectionDefinition[];

export const brands = [brainbotsBrand] as const satisfies readonly BrandConfig[];

const brandsBySlug = new Map<string, BrandConfig>(
  brands.map((brand) => [brand.slug, brand]),
);

export function getBrandBySlug(slug: string): BrandConfig | undefined {
  return brandsBySlug.get(slug);
}
