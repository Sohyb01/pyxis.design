import type { BrandConfig } from "@/lib/brand/types";

import { ColumnsMoodboard } from "../client";
import { SectionMeta } from "../shared";

type MoodboardSectionProps = {
  brand: BrandConfig;
};

export function MoodboardSection({ brand }: MoodboardSectionProps) {
  const { moodboard } = brand;

  return (
    <section
      id="moodboard"
      className="min-h-svh scroll-mt-14 bg-(--brand-background) px-5 pb-32 [color:var(--brand-foreground)] min-[640px]:px-8 min-[900px]:px-16 min-[900px]:pb-48 min-[1024px]:scroll-mt-0"
      data-brand-section="moodboard"
      aria-labelledby="moodboard-heading"
    >
      <div className="mx-auto w-full max-w-[100rem]">
        <SectionMeta brandName={brand.name} section="Moodboard" index={7} />
        <header className="mb-12 grid gap-6 pt-12 min-[1024px]:pt-8">
          <h2 id="moodboard-heading" className="text-5xl md:text-7xl">
            {moodboard.heading}
          </h2>
          <p className="max-w-[44ch] text-p_ui text-muted-foreground/70 text-pretty">
            {moodboard.description}
          </p>
        </header>

        <ColumnsMoodboard items={moodboard.images} />
      </div>
    </section>
  );
}
