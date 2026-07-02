import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { siteConfig, socialImage } from "@/app/seo";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  formatBlogDate,
  getAllBlogSlugs,
  getBlogPostBySlug,
} from "@/lib/blog-mdx";
import { FooterCta } from "../../Homepage Sections/FooterCta";

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllBlogSlugs();
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const imageUrl = post.frontmatter.coverImage ?? socialImage.openGraphPath;
  const imageAlt =
    post.frontmatter.coverAlt ??
    `${post.frontmatter.title} article from ${siteConfig.name}`;
  const publishDate = new Date(post.frontmatter.publishDate);
  const publishedTime = Number.isNaN(publishDate.getTime())
    ? undefined
    : publishDate.toISOString();

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: `${post.frontmatter.title} | ${siteConfig.name}`,
      description: post.frontmatter.description,
      url: `/blog/${post.slug}`,
      siteName: siteConfig.name,
      type: "article",
      publishedTime,
      authors: [post.frontmatter.author],
      tags: post.frontmatter.tags,
      images: [
        {
          url: imageUrl,
          width: socialImage.width,
          height: socialImage.height,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.frontmatter.title} | ${siteConfig.name}`,
      description: post.frontmatter.description,
      creator: "@minimumviableme",
      images: [imageUrl],
    },
  };
}

function CrosshatchBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 opacity-60"
      style={{
        backgroundImage: `
          repeating-linear-gradient(22.5deg, transparent, transparent 2px, rgba(75, 85, 99, 0.06) 2px, rgba(75, 85, 99, 0.06) 3px, transparent 3px, transparent 8px),
          repeating-linear-gradient(67.5deg, transparent, transparent 2px, rgba(107, 114, 128, 0.05) 2px, rgba(107, 114, 128, 0.05) 3px, transparent 3px, transparent 8px),
          repeating-linear-gradient(112.5deg, transparent, transparent 2px, rgba(55, 65, 81, 0.04) 2px, rgba(55, 65, 81, 0.04) 3px, transparent 3px, transparent 8px),
          repeating-linear-gradient(157.5deg, transparent, transparent 2px, rgba(31, 41, 55, 0.03) 2px, rgba(31, 41, 55, 0.03) 3px, transparent 3px, transparent 8px)
        `,
      }}
    />
  );
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="relative min-h-screen bg-neutral-100 text-foreground">
      <CrosshatchBackground />
      <article className="container relative z-1 mx-auto px-4 pb-20 pt-28 lg:pt-32">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/blog"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <ArrowLeft className="size-4" />
            Blog
          </Link>

          <header className="pt-8 text-pretty">
            <div className="flex flex-wrap items-center gap-2 text-detail uppercase text-muted-foreground">
              <time dateTime={post.frontmatter.publishDate}>
                {formatBlogDate(post.frontmatter.publishDate)}
              </time>
              <span aria-hidden="true">/</span>
              <span>{post.frontmatter.author}</span>
            </div>
            <h1 className="mt-4 text-h2 text-pretty">
              {post.frontmatter.title}
            </h1>

            <p className="mt-4 max-w-2xl text-p text-muted-foreground">
              {post.frontmatter.description}
            </p>
            {post.frontmatter.tags ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {post.frontmatter.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : null}
            {post.frontmatter.coverImage ? (
              <Image
                src={post.frontmatter.coverImage}
                alt={post.frontmatter.coverAlt ?? post.frontmatter.title}
                width={1600}
                height={900}
                priority
                className="mt-4 aspect-video w-full rounded-[8px] border border-border object-cover shadow-sm"
              />
            ) : null}
          </header>
          <div className="mt-10">{post.content}</div>
        </div>
      </article>
      <FooterCta />
    </main>
  );
}
