import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { siteConfig, socialImage } from "@/app/seo";
import { brands } from "@/lib/brand";

const description =
  "Browse the identities, voice, motion, typography, and reusable assets behind the brands Pyxis builds.";

export const metadata: Metadata = {
  title: "Brand library",
  description,
  alternates: { canonical: "/brand" },
  openGraph: {
    title: `Brand library | ${siteConfig.name}`,
    description,
    url: "/brand",
    siteName: siteConfig.name,
    type: "website",
    images: [
      {
        url: socialImage.openGraphPath,
        width: socialImage.width,
        height: socialImage.height,
        alt: siteConfig.ogAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Brand library | ${siteConfig.name}`,
    description,
    images: [socialImage.twitterPath],
  },
};

export default function BrandDirectoryPage() {
  return (
    <main className="min-h-dvh bg-neutral-950 px-4 py-8 text-white md:px-8 md:py-12">
      <header className="mx-auto grid max-w-7xl gap-12 border-t border-white/25 pt-4 md:grid-cols-2 md:gap-20">
        <div>
          <Link
            href="/"
            className="text-detail uppercase text-white/60 underline-offset-4 hover:text-white hover:underline focus-visible:outline focus-visible:outline-offset-4"
          >
            Pyxis design
          </Link>
        </div>
        <div>
          <p className="text-detail uppercase text-white/60">Brand library</p>
          <h1 className="mt-4 max-w-xl text-h2 md:text-h1">
            Guidelines for the people who build the brand.
          </h1>
          <p className="mt-6 max-w-xl text-p text-white/65">{description}</p>
        </div>
      </header>

      <section className="mx-auto mt-24 max-w-7xl border-t border-white/25 pt-4 md:mt-32">
        <div className="flex items-center justify-between gap-4 text-detail uppercase text-white/60">
          <h2>Available brands</h2>
          <span>{String(brands.length).padStart(2, "0")}</span>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {brands.map((brand) => (
            <Link
              key={brand.slug}
              href={`/brand/${brand.slug}`}
              className="group overflow-hidden rounded-xl border border-white/20 bg-white text-neutral-950 transition hover:-translate-y-1 focus-visible:outline focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <div className="relative aspect-video overflow-hidden bg-neutral-200">
                {brand.introduction.heroSrc ? (
                  <Image
                    src={brand.introduction.heroSrc}
                    alt=""
                    fill
                    sizes="(min-width: 744px) 50vw, 100vw"
                    className="object-cover transition duration-300 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-detail text-neutral-500">
                    Preview not supplied
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 flex h-3">
                  {brand.colors.items.map((color) => (
                    <span
                      key={color.hex}
                      className="h-full"
                      style={{
                        backgroundColor: color.hex,
                        flexGrow: color.proportion,
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="grid gap-8 p-5 md:grid-cols-2 md:p-6">
                <div>
                  <p className="text-h4">{brand.name}</p>
                  <p className="mt-1 text-detail uppercase text-neutral-500">
                    {brand.guidelinesLabel} · {brand.year}
                  </p>
                </div>
                <div className="flex flex-col justify-between gap-8">
                  <p className="text-p text-neutral-600">{brand.summary}</p>
                  <span className="inline-flex items-center gap-2 text-p_ui_medium">
                    Open guidelines
                    <ArrowUpRight
                      className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
