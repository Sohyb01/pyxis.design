import type { BrandConfig } from "@/lib/brand/types";

import { SectionMeta } from "../shared";

type VoiceAndToneSectionProps = {
  brand: BrandConfig;
};

export function VoiceAndToneSection({ brand }: VoiceAndToneSectionProps) {
  const { voiceAndTone } = brand;

  return (
    <section
      id="voice-and-tone"
      className="min-h-svh scroll-mt-14 overflow-clip bg-(--brand-background) px-5 pb-32 [color:var(--brand-foreground)] min-[640px]:px-8 min-[900px]:px-16 min-[900px]:pb-48 min-[1024px]:scroll-mt-0"
      data-brand-section="voice-and-tone"
      aria-labelledby="voice-and-tone-heading"
    >
      <div className="mx-auto w-full max-w-[100rem]">
        <SectionMeta
          brandName={brand.name}
          section="Voice and tone"
          index={6}
        />

        <header className="mb-12 grid gap-6 pt-12 min-[1024px]:pt-8">
          <h2 id="voice-and-tone-heading" className="text-5xl md:text-7xl">
            Voice and tone
          </h2>
          <p className="max-w-[44ch] text-p_ui text-muted-foreground/70 text-pretty">
            {voiceAndTone.description}
          </p>
        </header>

        <div className="grid gap-x-6 gap-y-14 min-[720px]:grid-cols-2">
          {voiceAndTone.principles.map((principle) => (
            <article
              className="flex min-w-0 flex-col gap-4"
              key={principle.label}
            >
              <h3 className="order-2 text-subtle">{principle.label}</h3>
              <div className="order-1 flex min-h-[21rem] items-start rounded-sm bg-(--brand-surface) p-6 min-[1000px]:p-10">
                <blockquote className="w-full text-h2 text-balance">
                  {principle.example}
                </blockquote>
              </div>
              <p className="order-3 -mt-3 max-w-[44ch] text-subtle text-muted-foreground/70 text-pretty">
                {principle.explanation}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-40 grid gap-x-6 gap-y-12 min-[720px]:grid-cols-2">
          {voiceAndTone.usageExamples.map((example) => (
            <article
              className="flex min-w-0 flex-col gap-4"
              key={example.context}
            >
              <h3 className="text-detail text-muted-foreground/70">
                {example.context}
              </h3>

              <div className="border-l-solid border-(--brand-accent) border-l-[2px] pl-4">
                <span className="mb-1 block text-detail [color:var(--brand-accent)]">
                  Do
                </span>
                <p className="text-p_ui">{example.do}</p>
              </div>

              <div className="border-l border-(--brand-line) pl-4 text-muted-foreground/70">
                <span className="mb-1 block text-detail">Don&apos;t</span>
                <p className="text-p_ui line-through decoration-1">
                  {example.dont}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
