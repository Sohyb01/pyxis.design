import type { BrandConfig } from "@/lib/brand/types";

import { TypographyExplorer } from "../client";
import { SectionMeta } from "../shared";

type TypographySectionProps = {
  brand: BrandConfig;
};

export function TypographySection({ brand }: TypographySectionProps) {
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
