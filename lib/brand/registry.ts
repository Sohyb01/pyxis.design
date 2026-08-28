import { brainbotsBrand } from "@/lib/brand/brands/brainbots";
import { evexaBrand } from "@/lib/brand/brands/evexa";
import type { BrandConfig, BrandSectionDefinition } from "@/lib/brand/types";
import { assertUniqueBrandSlugs } from "@/lib/brand/validation";

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

export const brands = [
  brainbotsBrand,
  evexaBrand,
] as const satisfies readonly BrandConfig[];

assertUniqueBrandSlugs(brands);

const brandsBySlug = new Map<string, BrandConfig>(
  brands.map((brand) => [brand.slug, brand]),
);

export function getBrandBySlug(slug: string): BrandConfig | undefined {
  return brandsBySlug.get(slug);
}
