import type { MetadataRoute } from "next";
import { siteConfig } from "./seo";
import { getBlogPostUrl, getPublishedBlogPosts } from "@/lib/blog-mdx";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const posts = await getPublishedBlogPosts();

  return [
    {
      url: siteConfig.url,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/work`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/blog`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...posts.map((post) => {
      const publishedDate = new Date(post.frontmatter.publishDate);

      return {
        url: `${siteConfig.url}${getBlogPostUrl(post.slug)}`,
        lastModified: Number.isNaN(publishedDate.getTime())
          ? lastModified
          : publishedDate,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      };
    }),
  ];
}
