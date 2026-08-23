import Image from "next/image";

import type { BrandConfig } from "@/lib/brand/types";

import { MediaPlaceholder, SectionMeta } from "../shared";

type IntroductionSectionProps = {
  brand: BrandConfig;
};

export function IntroductionSection({ brand }: IntroductionSectionProps) {
  const { introduction, logo } = brand;

  return (
    <section
      id="introduction"
      className="min-h-svh scroll-mt-14 bg-(--brand-background) [color:var(--brand-foreground)] min-[1024px]:scroll-mt-0"
      data-brand-section="introduction"
      aria-labelledby="introduction-heading"
    >
      <div className="relative flex min-h-svh flex-col justify-between overflow-hidden bg-neutral-950 text-white">
        {introduction.heroSrc ? (
          <Image
            className="object-cover"
            src={introduction.heroSrc}
            alt={introduction.heroAlt}
            fill
            priority
            sizes="(min-width: 1024px) calc(100vw - 17rem), 100vw"
          />
        ) : (
          <MediaPlaceholder
            className="absolute inset-0 min-h-0 rounded-none border-0"
            label="Hero image not supplied"
            tone="dark"
          />
        )}
        <div
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.58)_0%,transparent_38%),linear-gradient(0deg,rgba(0,0,0,0.82)_0%,transparent_62%)]"
          aria-hidden="true"
        />

        <div className="relative z-20 px-5 text-white min-[640px]:px-8 min-[900px]:px-16">
          <SectionMeta
            brandName={brand.name}
            section="Introduction"
            index={1}
          />
        </div>

        <div className="relative z-10 w-68 max-w-[58vw] px-5 py-8 min-[640px]:px-8 min-[900px]:px-16">
          {logo.primary.src ? (
            <Image
              className="h-auto w-full object-contain object-left"
              src={logo.primary.src}
              alt={logo.primary.alt}
              width={560}
              height={240}
            />
          ) : (
            <MediaPlaceholder
              className="min-h-20 border-white/30 bg-black/20 text-white/70"
              label="Primary logo not supplied"
              tone="dark"
            />
          )}
        </div>

        <div className="relative z-10 grid gap-10 px-5 pt-16 pb-8 min-[640px]:px-8 min-[900px]:grid-cols-12 min-[900px]:items-end min-[900px]:px-16 min-[1280px]:pb-12">
          <h1
            id="introduction-heading"
            className="max-w-[20ch] text-h1 text-balance min-[900px]:col-span-5"
          >
            {introduction.statement}
          </h1>

          <dl className="grid grid-cols-4 gap-5 min-[900px]:col-span-full">
            {introduction.facts.map((fact) => (
              <div
                className="grid content-start gap-1 border-t border-white/30 pt-3"
                key={fact.label}
              >
                <dt className="text-detail text-white/65">{fact.label}</dt>
                <dd className="text-body_medium">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="grid gap-8 px-5 py-20 min-[640px]:px-8 min-[900px]:grid-cols-12 min-[900px]:px-16 min-[900px]:py-32">
        <h2 className="text-h2 text-balance min-[900px]:col-span-6">
          {introduction.heading}
        </h2>
        <div className="grid max-w-[46rem] gap-4 min-[900px]:col-span-5 min-[900px]:col-start-8">
          <p className="text-lead">{introduction.lead}</p>
          <p className="text-p opacity-70">{introduction.body}</p>
        </div>
      </div>
    </section>
  );
}
