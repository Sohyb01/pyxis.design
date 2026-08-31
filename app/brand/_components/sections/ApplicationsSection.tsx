import Image from "next/image";

import type { BrandConfig } from "@/lib/brand/types";

import { SectionMeta } from "../shared";

type ApplicationsSectionProps = {
  brand: BrandConfig;
};

export function ApplicationsSection({ brand }: ApplicationsSectionProps) {
  const { applications } = brand;

  return (
    <section
      id="applications"
      className="min-h-svh scroll-mt-14 bg-(--brand-background) px-5 pb-32 [color:var(--brand-foreground)] min-[640px]:px-8 min-[900px]:px-16 min-[900px]:pb-48 min-[1024px]:scroll-mt-0"
      data-brand-section="applications"
      aria-labelledby="applications-heading"
    >
      <div className="mx-auto w-full max-w-[100rem]">
        <SectionMeta brandName={brand.name} section="Applications" index={8} />
        <header className="mb-12 grid gap-6 pt-12 min-[1024px]:pt-8">
          <h2 id="applications-heading" className="text-5xl md:text-7xl">
            {applications.heading}
          </h2>
          <p className="max-w-[44ch] text-p_ui text-muted-foreground/70 text-pretty">
            {applications.description}
          </p>
        </header>

        {applications.items.length > 0 ? (
          <div className="grid gap-x-7 gap-y-8 md:grid-cols-2 min-[1280px]:grid-cols-3">
            {applications.items.map((application) => (
              <figure className="grid gap-3" key={application.src}>
                <div className="relative aspect-4/3 overflow-hidden rounded-sm bg-(--brand-surface)">
                  <Image
                    className="object-contain p-6"
                    src={application.src}
                    alt={`${brand.name} ${application.title} application`}
                    fill
                    sizes="(min-width: 1024px) 28vw, (min-width: 640px) 48vw, 100vw"
                  />
                </div>
                {/* <figcaption className="text-body text-muted-foreground/70">
                  {application.title}
                </figcaption> */}
              </figure>
            ))}
          </div>
        ) : (
          <p className="border-t border-(--brand-line) py-6 text-body text-muted-foreground/70">
            No files provided
          </p>
        )}
      </div>
    </section>
  );
}
