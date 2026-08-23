import type { BrandConfig, BrandMotionConfig } from "@/lib/brand/types";

import { MotionExplorer } from "../client";
import { SectionMeta } from "../shared";

type MotionSectionProps = {
  brand: BrandConfig;
};

const expectedExampleKinds = [
  "exchange",
  "carousel",
  "toggle",
  "reveal",
] as const;

function validateMotionConfig(brandName: string, motion: BrandMotionConfig) {
  if (motion.eases.length !== 2) {
    throw new Error(
      `Brand "${brandName}" must configure exactly two primary motion eases.`,
    );
  }

  if (motion.examples.length !== 4) {
    throw new Error(
      `Brand "${brandName}" must configure exactly four motion examples.`,
    );
  }

  const easeIds = new Set<string>();
  for (const ease of motion.eases) {
    if (easeIds.has(ease.id)) {
      throw new Error(
        `Brand "${brandName}" has a duplicate motion ease ID: "${ease.id}".`,
      );
    }

    if (!Number.isFinite(ease.durationMs) || ease.durationMs <= 0) {
      throw new Error(
        `Brand "${brandName}" motion ease "${ease.id}" must have a positive duration.`,
      );
    }

    if (
      ease.bezier.some((value) => !Number.isFinite(value)) ||
      ease.bezier[0] < 0 ||
      ease.bezier[0] > 1 ||
      ease.bezier[2] < 0 ||
      ease.bezier[2] > 1
    ) {
      throw new Error(
        `Brand "${brandName}" motion ease "${ease.id}" has an invalid cubic Bézier tuple.`,
      );
    }

    easeIds.add(ease.id);
  }

  const exampleIds = new Set<string>();
  const exampleKinds = new Set<string>();
  for (const example of motion.examples) {
    if (exampleIds.has(example.id)) {
      throw new Error(
        `Brand "${brandName}" has a duplicate motion example ID: "${example.id}".`,
      );
    }

    if (!easeIds.has(example.easeId)) {
      throw new Error(
        `Brand "${brandName}" motion example "${example.id}" references unknown ease "${example.easeId}".`,
      );
    }

    exampleIds.add(example.id);
    exampleKinds.add(example.kind);
  }

  for (const kind of expectedExampleKinds) {
    if (!exampleKinds.has(kind)) {
      throw new Error(
        `Brand "${brandName}" must configure one "${kind}" motion example.`,
      );
    }
  }
}

export function MotionSection({ brand }: MotionSectionProps) {
  validateMotionConfig(brand.name, brand.motion);

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
