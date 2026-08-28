import type { BrandConfig } from "@/lib/brand/types";

import { MotionExplorer } from "../client";
import { SectionMeta } from "../shared";

type MotionSectionProps = {
  brand: BrandConfig;
};

export function MotionSection({ brand }: MotionSectionProps) {
  return (
    <section
      id="motion"
      className="min-h-svh scroll-mt-14 overflow-clip bg-(--brand-background) px-5 pb-32 [color:var(--brand-foreground)] md:px-8 md:pb-48 lg:scroll-mt-0 lg:px-16"
      data-brand-section="motion"
      aria-labelledby="motion-heading"
    >
      <div className="mx-auto w-full max-w-[100rem]">
        <SectionMeta brandName={brand.name} section="Motion" index={5} />

        <header className="mb-32 grid gap-6 pt-12 lg:pt-8">
          <h2 id="motion-heading" className="text-5xl md:text-7xl">
            {brand.motion.heading}
          </h2>
          <p className="max-w-[44ch] text-p_ui text-muted-foreground/70 text-pretty">
            {brand.motion.description}
          </p>
        </header>

        <MotionExplorer brandSlug={brand.slug} motionConfig={brand.motion} />
      </div>
    </section>
  );
}
