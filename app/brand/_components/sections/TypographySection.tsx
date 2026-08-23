import type {
  BrandConfig,
  BrandTypographyConfig,
} from "@/lib/brand/types";

import { TypographyExplorer } from "../client";
import { SectionMeta } from "../shared";

type TypographySectionProps = {
  brand: BrandConfig;
};

function validateTypographyConfig(typography: BrandTypographyConfig) {
  const typefaceIds = new Set<string>();

  typography.typefaces.forEach((typeface) => {
    if (typefaceIds.has(typeface.id)) {
      throw new Error(
        `Brand typography configuration contains the duplicate typeface ID "${typeface.id}".`,
      );
    }

    typefaceIds.add(typeface.id);
  });

  const systemIds = new Set<string>();

  typography.systems.forEach((system) => {
    if (systemIds.has(system.id)) {
      throw new Error(
        `Brand typography configuration contains the duplicate system ID "${system.id}".`,
      );
    }

    systemIds.add(system.id);

    if (!typefaceIds.has(system.heading.typefaceId)) {
      throw new Error(
        `Typography system "${system.id}" references the missing heading typeface "${system.heading.typefaceId}".`,
      );
    }

    if (
      system.body.mode === "separate" &&
      !typefaceIds.has(system.body.typefaceId)
    ) {
      throw new Error(
        `Typography system "${system.id}" references the missing body typeface "${system.body.typefaceId}".`,
      );
    }
  });

  if (!systemIds.has(typography.defaultSystemId)) {
    throw new Error(
      `Brand typography default system "${typography.defaultSystemId}" does not exist.`,
    );
  }
}

export function TypographySection({ brand }: TypographySectionProps) {
  validateTypographyConfig(brand.typography);

  return (
    <section
      id="typography"
      className="min-h-svh scroll-mt-14 overflow-clip bg-(--brand-background) px-5 pb-32 [color:var(--brand-foreground)] min-[640px]:px-8 min-[900px]:px-16 min-[900px]:pb-48 min-[1024px]:scroll-mt-0"
      data-brand-section="typography"
      aria-labelledby="typography-heading"
    >
      <div className="mx-auto w-full max-w-[100rem]">
        <SectionMeta brandName={brand.name} section="Typography" index={4} />
        <TypographyExplorer typography={brand.typography} />
      </div>
    </section>
  );
}
