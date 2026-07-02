import type { ComponentPropsWithoutRef } from "react";
import Link from "next/link";
import type { MDXComponents } from "mdx/types";
import { cn } from "@/lib/utils";

function MdxAnchor({
  className,
  href,
  ...props
}: ComponentPropsWithoutRef<"a">) {
  const isHashLink = href?.startsWith("#");
  const isExternalLink = Boolean(href && !isHashLink);
  const classes = cn(
    "font-medium underline underline-offset-4 transition-colors hover:text-foreground",
    className,
  );

  if (href?.startsWith("/")) {
    return <Link href={href} className={classes} {...props} />;
  }

  return (
    <a
      className={classes}
      href={href}
      rel={isExternalLink ? "noreferrer" : undefined}
      target={isExternalLink ? "_blank" : undefined}
      {...props}
    />
  );
}

function MdxImage({
  alt = "",
  className,
  ...props
}: ComponentPropsWithoutRef<"img">) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt}
      className={cn(
        "my-8 w-full rounded-[8px] border border-border object-cover shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

export const blogMdxComponents: MDXComponents = {
  h1: ({ className, ...props }) => (
    <h1 className={cn("mt-10 text-h2", className)} {...props} />
  ),
  h2: ({ className, ...props }) => (
    <h2 className={cn("mt-10 text-h3", className)} {...props} />
  ),
  h3: ({ className, ...props }) => (
    <h3 className={cn("mt-8 text-h4", className)} {...props} />
  ),
  h4: ({ className, ...props }) => (
    <h4 className={cn("mt-6 text-h5", className)} {...props} />
  ),
  p: ({ className, ...props }) => (
    <p
      className={cn("mt-5 text-p text-foreground/75 first:mt-0", className)}
      {...props}
    />
  ),
  a: MdxAnchor,
  ul: ({ className, ...props }) => (
    <ul
      className={cn(
        "mt-5 ml-5 list-disc space-y-2 text-p text-foreground/75",
        className,
      )}
      {...props}
    />
  ),
  ol: ({ className, ...props }) => (
    <ol
      className={cn(
        "mt-5 ml-5 list-decimal space-y-2 text-p text-foreground/75",
        className,
      )}
      {...props}
    />
  ),
  li: ({ className, ...props }) => (
    <li className={cn("pl-1", className)} {...props} />
  ),
  blockquote: ({ className, ...props }) => (
    <blockquote
      className={cn(
        "my-8 border-l-2 border-foreground pl-5 text-blockquote text-foreground/70",
        className,
      )}
      {...props}
    />
  ),
  hr: ({ className, ...props }) => (
    <hr className={cn("my-10 border-border", className)} {...props} />
  ),
  code: ({ className, ...props }) => (
    <code
      className={cn(
        "rounded-[4px] border border-border bg-muted px-1.5 py-0.5 font-mono text-[0.9em]",
        className,
      )}
      {...props}
    />
  ),
  pre: ({ className, ...props }) => (
    <pre
      className={cn(
        "my-8 overflow-x-auto rounded-[8px] border border-border bg-black p-4 text-sm text-white [&_code]:border-0 [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-white",
        className,
      )}
      {...props}
    />
  ),
  table: ({ className, ...props }) => (
    <div className="my-8 overflow-x-auto rounded-[8px] border border-border">
      <table
        className={cn("w-full border-collapse text-left text-subtle", className)}
        {...props}
      />
    </div>
  ),
  th: ({ className, ...props }) => (
    <th
      className={cn("border-b border-border bg-muted px-3 py-2", className)}
      {...props}
    />
  ),
  td: ({ className, ...props }) => (
    <td
      className={cn("border-b border-border px-3 py-2 align-top", className)}
      {...props}
    />
  ),
  img: MdxImage,
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...blogMdxComponents,
    ...components,
  };
}
