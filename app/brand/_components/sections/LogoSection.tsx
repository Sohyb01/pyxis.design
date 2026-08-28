import Image from "next/image";

import type { BrandConfig, BrandLogoVariant } from "@/lib/brand/types";

import { ClearSpaceArtwork } from "../client";
import { MediaPlaceholder, SectionMeta } from "../shared";

type LogoSectionProps = {
  brand: BrandConfig;
};

type LogoVariantProps = {
  variant: BrandLogoVariant;
  headingId?: string;
  secondary?: boolean;
};

function LogoArtwork({
  variant,
  tone,
}: {
  variant: BrandLogoVariant;
  tone: "light" | "dark";
}) {
  const artworkSrc =
    tone === "dark" ? (variant.darkSrc ?? variant.src) : variant.src;

  return (
    <div className="relative grid min-h-0 place-items-center">
      {artworkSrc ? (
        <Image
          className="relative z-10 h-auto max-h-48 w-[min(72%,20rem)] object-contain"
          src={artworkSrc}
          alt={variant.alt}
          width={720}
          height={360}
        />
      ) : (
        <MediaPlaceholder
          className="relative z-10 min-h-40 w-[min(78%,20rem)]"
          label={`${variant.title} artwork not supplied`}
          tone={tone}
        />
      )}
    </div>
  );
}

function LogoVariant({
  variant,
  headingId,
  secondary = false,
}: LogoVariantProps) {
  return (
    <article
      className={`pt-12 min-[1024px]:pt-8 ${
        secondary ? "mt-36 min-[1024px]:mt-44" : ""
      }`}
    >
      <header className="mb-12 grid gap-2">
        <h2 id={headingId} className="text-h1">
          {variant.title}
        </h2>
        <p className="max-w-[44ch] text-p_ui text-muted-foreground/70 text-pretty">
          {variant.description}
        </p>
      </header>

      <div className="grid gap-6 min-[752px]:grid-cols-3">
        <div className="relative grid min-h-[30rem] grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-sm border border-(--brand-line) bg-white p-4 [color:var(--brand-foreground)] min-[752px]:min-h-[clamp(31rem,64svh,40rem)]">
          <p className="relative z-20 text-detail text-muted-foreground/70">
            Light
          </p>
          <LogoArtwork variant={variant} tone="light" />
        </div>

        <div className="relative grid min-h-[30rem] grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-sm border border-neutral-950 bg-neutral-950 p-4 text-white min-[752px]:min-h-[clamp(31rem,64svh,40rem)]">
          <p className="relative z-20 text-detail text-white/70">Dark</p>
          <LogoArtwork variant={variant} tone="dark" />
        </div>

        <div className="relative grid min-h-[30rem] grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-sm border border-(--brand-line) bg-(--brand-background) p-4 [color:var(--brand-foreground)] min-[752px]:min-h-[clamp(31rem,64svh,40rem)]">
          <p className="relative z-20 text-detail text-muted-foreground/70">
            Clear space
          </p>

          <ClearSpaceArtwork variant={variant} />
          <div className="absolute bottom-4 start-4 z-20 grid max-w-96 gap-1 pt-6 text-subtle">
            <p className="[color:var(--brand-accent)]">
              {variant.clearSpaceLabel}
            </p>
            <p className="text-muted-foreground/70">
              Keep clear space equal to half the mark&apos;s height on every
              side. Nothing enters this zone.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

export function LogoSection({ brand }: LogoSectionProps) {
  const { logo } = brand;

  return (
    <section
      id="logo"
      className="min-h-svh scroll-mt-14 overflow-clip bg-(--brand-background) px-5 pb-32 [color:var(--brand-foreground)] min-[640px]:px-8 min-[900px]:px-16 min-[900px]:pb-48 min-[1024px]:scroll-mt-0"
      data-brand-section="logo"
      aria-labelledby="logo-heading"
    >
      <div className="mx-auto w-full max-w-[100rem]">
        <SectionMeta brandName={brand.name} section="Logo" index={2} />
        <LogoVariant variant={logo.primary} headingId="logo-heading" />
        <LogoVariant variant={logo.mark} secondary />
      </div>
    </section>
  );
}
