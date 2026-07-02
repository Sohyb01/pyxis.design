import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FileText } from "lucide-react";
import { siteConfig, socialImage } from "@/app/seo";
import { Badge } from "@/components/ui/badge";
import {
  formatBlogDate,
  getBlogPostUrl,
  getPublishedBlogPosts,
} from "@/lib/blog-mdx";
import { cn } from "@/lib/utils";
import { FooterCta } from "../Homepage Sections/FooterCta";

const blogDescription =
  "Notes, tutorials, and useful resources on design, product building, interfaces, launches, and the craft of sharper digital work.";

export const metadata: Metadata = {
  title: "Blog",
  description: blogDescription,
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: `Blog | ${siteConfig.name}`,
    description: blogDescription,
    url: "/blog",
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
    title: `Blog | ${siteConfig.name}`,
    description: blogDescription,
    creator: "@minimumviableme",
    images: [socialImage.twitterPath],
  },
};

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

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts();

  return (
    <main className="relative min-h-screen bg-neutral-100 text-foreground">
      <CrosshatchBackground />
      <section className="container relative z-1 mx-auto px-4 py-20 ">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <h1 className="text-h2">Pyxis blog</h1>
          <p className="mt-4 max-w-2xl text-p_ui text-muted-foreground">
            {blogDescription}
          </p>
        </div>

        {posts.length > 0 ? (
          <div className="mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={getBlogPostUrl(post.slug)}
                className={cn(
                  "group overflow-hidden rounded-[1rem] border border-border bg-background transition flex-col items-start text-start no-scrollbar",
                  "hover:-translate-y-0.5",
                  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none",
                )}
              >
                {post.frontmatter.coverImage ? (
                  <div className="relative aspect-4/2 w-full overflow-hidden bg-muted no-scrollbar">
                    <Image
                      src={post.frontmatter.coverImage}
                      alt={post.frontmatter.coverAlt ?? post.frontmatter.title}
                      fill
                      sizes="(min-width: 744px) 220px, 100vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="grid aspect-4/2 min-h-48 place-items-center bg-muted text-muted-foreground">
                    <FileText className="size-6" />
                  </div>
                )}
                <div className="p-4 pt-3">
                  <span className="flex flex-wrap items-center gap-2 text-detail uppercase text-muted-foreground text-pretty">
                    <time dateTime={post.frontmatter.publishDate}>
                      {formatBlogDate(post.frontmatter.publishDate)}
                    </time>
                    <span aria-hidden="true">/</span>
                    <span>{post.frontmatter.author}</span>
                  </span>
                  <div className="text-xl pt-1 line-clamp-1">
                    {post.frontmatter.title}
                  </div>
                  <div className="max-w-2xl pt-1 text-p_ui text-muted-foreground line-clamp-2">
                    {post.frontmatter.description}
                  </div>
                  {post.frontmatter.tags ? (
                    <span className="mt-4 flex flex-wrap gap-2">
                      {post.frontmatter.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </span>
                  ) : null}
                  {/* <span
                    className={buttonVariants({
                      variant: "outline",
                      className: "flex gap-2 items-center",
                    })}
                    aria-hidden="true"
                  >
                    Learn more
                    <ArrowUpRight className="size-4" />
                  </span> */}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mx-auto mt-10 flex max-w-xl flex-col items-center rounded-[8px] border border-border bg-background/85 p-8 text-center shadow-sm">
            <FileText className="size-5" />
            <h2 className="mt-4 text-h4">No posts published yet</h2>
            <p className="mt-2 text-p_ui text-muted-foreground">
              Published MDX posts will appear here once files are added to the
              blog content folder.
            </p>
          </div>
        )}
      </section>
      <FooterCta />
    </main>
  );
}
