import fs from "node:fs/promises";
import path from "node:path";
import type { ReactNode } from "react";
import { compileMDX } from "next-mdx-remote/rsc";
import { blogMdxComponents } from "@/app/mdx-components";

export type BlogFrontmatter = {
  title: string;
  description: string;
  author: string;
  publishDate: string;
  tags?: string[];
  coverImage?: string;
  coverAlt?: string;
  draft?: boolean;
};

export type BlogPost = {
  slug: string;
  frontmatter: BlogFrontmatter;
  content: ReactNode;
};

const contentDirectory = path.join(
  process.cwd(),
  "app",
  "(pages)",
  "blog",
  "_mdx-content",
);
const mdxExtension = ".mdx";
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function getStringField(
  frontmatter: Record<string, unknown>,
  key: keyof BlogFrontmatter,
  slug: string,
) {
  const value = frontmatter[key];

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Blog post "${slug}" is missing frontmatter "${key}".`);
  }

  return value;
}

function getOptionalString(
  frontmatter: Record<string, unknown>,
  key: keyof BlogFrontmatter,
) {
  const value = frontmatter[key];
  return typeof value === "string" && value.trim().length > 0
    ? value
    : undefined;
}

function getOptionalPublicImage(frontmatter: Record<string, unknown>) {
  const coverImage = getOptionalString(frontmatter, "coverImage");

  if (!coverImage) {
    return undefined;
  }

  if (!coverImage.startsWith("/")) {
    throw new Error(
      'Blog post coverImage must be a root-relative public path, like "/projects/archive/websites1.png".',
    );
  }

  return coverImage;
}

function getOptionalTags(frontmatter: Record<string, unknown>) {
  const value = frontmatter.tags;

  if (!Array.isArray(value)) {
    return undefined;
  }

  const tags = value.filter(
    (tag): tag is string => typeof tag === "string" && tag.trim().length > 0,
  );

  return tags.length > 0 ? tags : undefined;
}

function normalizeFrontmatter(frontmatter: unknown, slug: string) {
  if (!isRecord(frontmatter)) {
    throw new Error(`Blog post "${slug}" is missing frontmatter.`);
  }

  return {
    title: getStringField(frontmatter, "title", slug),
    description: getStringField(frontmatter, "description", slug),
    author: getStringField(frontmatter, "author", slug),
    publishDate: getStringField(frontmatter, "publishDate", slug),
    tags: getOptionalTags(frontmatter),
    coverImage: getOptionalPublicImage(frontmatter),
    coverAlt: getOptionalString(frontmatter, "coverAlt"),
    draft: frontmatter.draft === true,
  } satisfies BlogFrontmatter;
}

function getDateTime(value: string) {
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function getSlugFromFileName(fileName: string) {
  return path.basename(fileName, mdxExtension);
}

export function isValidBlogSlug(slug: string) {
  return slugPattern.test(slug);
}

export function formatBlogDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function getBlogPostUrl(slug: string) {
  return `/blog/${slug}`;
}

async function getBlogFileNames() {
  try {
    const entries = await fs.readdir(contentDirectory, { withFileTypes: true });

    return entries
      .filter((entry) => entry.isFile() && entry.name.endsWith(mdxExtension))
      .map((entry) => entry.name)
      .filter((fileName) => isValidBlogSlug(getSlugFromFileName(fileName)))
      .sort();
  } catch (error) {
    if (
      isRecord(error) &&
      typeof error.code === "string" &&
      error.code === "ENOENT"
    ) {
      return [];
    }

    throw error;
  }
}

async function readBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!isValidBlogSlug(slug)) {
    return null;
  }

  const filePath = path.join(contentDirectory, `${slug}${mdxExtension}`);

  try {
    const source = await fs.readFile(filePath, "utf8");
    const { content, frontmatter } = await compileMDX<BlogFrontmatter>({
      source,
      components: blogMdxComponents,
      options: {
        parseFrontmatter: true,
      },
    });

    return {
      slug,
      frontmatter: normalizeFrontmatter(frontmatter, slug),
      content,
    };
  } catch (error) {
    if (
      isRecord(error) &&
      typeof error.code === "string" &&
      error.code === "ENOENT"
    ) {
      return null;
    }

    throw error;
  }
}

export async function getBlogPostBySlug(slug: string) {
  const post = await readBlogPostBySlug(slug);

  if (!post || post.frontmatter.draft) {
    return null;
  }

  return post;
}

export async function getAllBlogPosts() {
  const fileNames = await getBlogFileNames();
  const posts = await Promise.all(
    fileNames.map((fileName) =>
      readBlogPostBySlug(getSlugFromFileName(fileName)),
    ),
  );

  return posts
    .filter((post): post is BlogPost => Boolean(post))
    .sort(
      (postA, postB) =>
        getDateTime(postB.frontmatter.publishDate) -
        getDateTime(postA.frontmatter.publishDate),
    );
}

export async function getPublishedBlogPosts() {
  const posts = await getAllBlogPosts();
  return posts.filter((post) => !post.frontmatter.draft);
}

export async function getAllBlogSlugs() {
  const posts = await getPublishedBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}
