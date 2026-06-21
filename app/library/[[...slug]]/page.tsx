import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteConfig, socialImage } from "@/app/seo";
import { getLibraryEntry, libraryEntries } from "@/lib/library/registry";
import { LibraryBrowser } from "./LibraryBrowser";

type LibaryPageProps = {
  params: Promise<{
    slug?: string[];
  }>;
};

export const dynamic = "force-static";

export function generateStaticParams() {
  return [
    { slug: [] },
    ...libraryEntries.map((entry) => ({
      slug: [entry.categorySlug, entry.slug],
    })),
  ];
}

export async function generateMetadata({
  params,
}: LibaryPageProps): Promise<Metadata> {
  const { slug = [] } = await params;
  const defaultTitle = "Libary";
  const defaultDescription =
    "Browse Pyxis component experiments by category with instant keyboard navigation.";

  if (slug.length === 2) {
    const entry = getLibraryEntry(slug[0] ?? "", slug[1] ?? "");

    if (entry) {
      return {
        title: entry.title,
        description: entry.description,
        alternates: {
          canonical: entry.href,
        },
        openGraph: {
          title: `${entry.title} | ${siteConfig.name}`,
          description: entry.description,
          url: entry.href,
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
          title: `${entry.title} | ${siteConfig.name}`,
          description: entry.description,
          creator: "@minimumviableme",
          images: [socialImage.twitterPath],
        },
      };
    }
  }

  return {
    title: defaultTitle,
    description: defaultDescription,
    alternates: {
      canonical: "/libary",
    },
    openGraph: {
      title: `${defaultTitle} | ${siteConfig.name}`,
      description: defaultDescription,
      url: "/libary",
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
      title: `${defaultTitle} | ${siteConfig.name}`,
      description: defaultDescription,
      creator: "@minimumviableme",
      images: [socialImage.twitterPath],
    },
  };
}

export default async function LibaryPage({ params }: LibaryPageProps) {
  const { slug = [] } = await params;

  if (slug.length === 0) {
    return (
      <LibraryBrowser initialCategorySlug={null} initialEntrySlug={null} />
    );
  }

  if (slug.length !== 2) {
    notFound();
  }

  const [categorySlug, entrySlug] = slug;

  if (!categorySlug || !entrySlug) {
    notFound();
  }

  const entry = getLibraryEntry(categorySlug, entrySlug);

  if (!entry) {
    notFound();
  }

  return (
    <LibraryBrowser
      initialCategorySlug={entry.categorySlug}
      initialEntrySlug={entry.slug}
    />
  );
}
