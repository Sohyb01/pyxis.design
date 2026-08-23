import type { BrandConfig } from "@/lib/brand/types";

import { ColorExplorer } from "../client";
import { SectionMeta } from "../shared";

type ColorsSectionProps = {
  brand: BrandConfig;
};

export function ColorsSection({ brand }: ColorsSectionProps) {
  const { colors } = brand;

  return (
    <section
      id="colors"
      className="min-h-svh scroll-mt-14 bg-(--brand-background) px-5 pb-32 [color:var(--brand-foreground)] min-[640px]:px-8 min-[900px]:px-16 min-[900px]:pb-48 min-[1024px]:scroll-mt-0"
      data-brand-section="colors"
      aria-labelledby="colors-heading"
    >
      <div className="mx-auto w-full max-w-[100rem]">
        <SectionMeta brandName={brand.name} section="Color" index={3} />
        <ColorExplorer
          heading={colors.heading}
          description={colors.description}
          colors={colors.items}
          proportionsLabel={colors.proportionsNote}
        />
      </div>
    </section>
  );
}
