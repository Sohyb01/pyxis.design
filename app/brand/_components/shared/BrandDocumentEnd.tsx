import Link from "next/link";

import type { BrandConfig } from "@/lib/brand/types";

type BrandDocumentEndProps = {
  brand: BrandConfig;
};

export function BrandDocumentEnd({ brand }: BrandDocumentEndProps) {
  return (
    <footer className="bg-(--brand-background) px-5 pb-8 min-[640px]:px-8 min-[900px]:px-16 text-muted-foreground/70">
      <div className="mx-auto grid w-full max-w-[100rem] grid-cols-2 items-baseline gap-4 border-t border-(--brand-line) pt-2 text-detail min-[640px]:grid-cols-3">
        <span>
          {brand.name} {brand.guidelinesLabel.toLowerCase()}
        </span>
        <span className="hidden text-center min-[640px]:block">
          End of document
        </span>
        <span className="flex justify-self-end gap-1.5 whitespace-nowrap">
          <Link
            className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand-accent)"
            href="/"
          >
            Published with Pyxis
          </Link>
          <span aria-hidden="true">&middot;</span>
          <span>&copy; {brand.year}</span>
        </span>
      </div>
    </footer>
  );
}
