import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { siteConfig, socialImage } from "@/app/seo";
import { BrandDocument } from "@/app/brand/_components/BrandDocument";
import { brandSectionLinks, brands, getBrandBySlug } from "@/lib/brand";

type BrandPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return brands.map((brand) => ({ slug: brand.slug }));
}

export async function generateMetadata({
  params,
}: BrandPageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);

  if (!brand) notFound();

  const canonical = `/brand/${brand.slug}`;
  const image = brand.introduction.heroSrc ?? socialImage.openGraphPath;

  return {
    title: brand.metadata.title,
    description: brand.metadata.description,
    alternates: { canonical },
    openGraph: {
      title: `${brand.metadata.title} | ${siteConfig.name}`,
      description: brand.metadata.description,
      url: canonical,
      siteName: siteConfig.name,
      type: "website",
      images: [{ url: image, alt: brand.introduction.heroAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${brand.metadata.title} | ${siteConfig.name}`,
      description: brand.metadata.description,
      images: [image],
    },
  };
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);

  if (!brand) notFound();

  return <BrandDocument brand={brand} sections={brandSectionLinks} />;
}
