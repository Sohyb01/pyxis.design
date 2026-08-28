import type {
  BrandConfig,
  BrandDownloadAsset,
  BrandLogoFile,
} from "@/lib/brand/types";

import { DownloadAssetRow } from "../client";
import { MediaPlaceholder, SectionMeta } from "../shared";

type AssetsSectionProps = {
  brand: BrandConfig;
};

function renderSimpleDownloads(items: readonly BrandDownloadAsset[]) {
  return (
    <div className="grid gap-1">
      {items.map((item) => (
        <div
          className="flex min-h-14 items-center justify-between gap-4 border-b border-(--brand-line) py-3"
          key={item.src}
        >
          <p className="min-w-0 break-words text-p_ui_medium">{item.label}</p>
          <a
            className="cursor-pointer border-b border-(--brand-line) py-1 text-body text-muted-foreground/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand-accent)"
            href={item.src}
            download
          >
            Download
          </a>
        </div>
      ))}
    </div>
  );
}

function renderLogoDownloads(items: readonly BrandLogoFile[]) {
  return (
    <div className="grid gap-1">
      {items.map((item) => (
        <DownloadAssetRow
          label={item.name}
          src={item.src}
          key={item.src}
          showFileSize
          containPreview
        />
      ))}
    </div>
  );
}

function validateLogoFiles(brandName: string, items: readonly BrandLogoFile[]) {
  items.forEach((item) => {
    if (!/\.svg(?:[?#]|$)/i.test(item.src)) {
      throw new Error(
        `Brand "${brandName}" logo file "${item.name}" must reference an SVG source.`,
      );
    }
  });
}

export function AssetsSection({ brand }: AssetsSectionProps) {
  const { assets } = brand;
  validateLogoFiles(brand.name, assets.logoFiles);

  return (
    <section
      id="assets"
      className="min-h-svh scroll-mt-14 bg-(--brand-background) px-5 pb-32 [color:var(--brand-foreground)] min-[640px]:px-8 min-[900px]:px-16 min-[900px]:pb-48 min-[1024px]:scroll-mt-0"
      data-brand-section="assets"
      aria-labelledby="assets-heading"
    >
      <div className="mx-auto w-full max-w-[100rem]">
        <SectionMeta brandName={brand.name} section="Assets" index={9} />
        <header className="mb-12 grid gap-8 pt-12 min-[900px]:grid-cols-12 min-[900px]:items-end min-[1024px]:pt-8">
          <div className="grid gap-6 min-[900px]:col-span-7">
            <h2 id="assets-heading" className="text-5xl lg:text-7xl">
              {assets.heading}
            </h2>
            <p className="max-w-[44ch] text-p_ui text-muted-foreground/70 text-pretty">
              {assets.description}
            </p>
          </div>
          <div className="min-[900px]:col-span-3 min-[900px]:col-start-10 min-[900px]:flex min-[900px]:justify-end">
            {assets.completePackSrc ? (
              <a
                className="cursor-pointer border-b border-(--brand-line) py-1 text-body text-muted-foreground/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand-accent)"
                href={assets.completePackSrc}
                download
              >
                Download all
              </a>
            ) : null}
          </div>
        </header>

        <div className="grid">
          <article className="grid min-h-[28rem] content-start gap-6 py-8">
            <header className="flex items-baseline justify-between gap-4 border-b border-(--brand-line) pb-3">
              <h3 className="text-h4">Logo files</h3>
              <span className="text-detail text-muted-foreground/70">
                {assets.logoFiles.length}
              </span>
            </header>
            {assets.logoFiles.length > 0 ? (
              renderLogoDownloads(assets.logoFiles)
            ) : (
              <MediaPlaceholder
                className="min-h-48"
                label="Logo files have not been supplied"
              />
            )}
          </article>

          <article className="grid content-start gap-6 py-8">
            <header className="flex items-baseline justify-between gap-4 border-b border-(--brand-line) pb-3">
              <h3 className="text-h4">Typefaces</h3>
              <span className="text-detail text-muted-foreground/70">
                {assets.typefaces.length}
              </span>
            </header>
            {renderSimpleDownloads(assets.typefaces)}
          </article>

          <article className="grid content-start gap-6 py-8">
            <header className="flex items-baseline justify-between gap-4 border-b border-(--brand-line) pb-3">
              <h3 className="text-h4">Brand colors</h3>
              <span className="text-detail text-muted-foreground/70">
                {assets.colorFiles.length}
              </span>
            </header>
            {renderSimpleDownloads(assets.colorFiles)}
          </article>

          <article className="grid content-start gap-6 py-8">
            <header className="flex items-baseline justify-between gap-4 border-b border-(--brand-line) pb-3">
              <h3 className="text-h4">Imagery</h3>
              <span className="text-detail text-muted-foreground/70">
                {assets.imagery.length}
              </span>
            </header>
            <div className="grid gap-1">
              {assets.imagery.map((asset) => (
                <DownloadAssetRow
                  label={asset.label}
                  src={asset.src}
                  key={asset.src}
                />
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
