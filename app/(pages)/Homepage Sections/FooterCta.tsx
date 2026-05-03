import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CtaActions } from "@/components/custom/CtaActions";

export function FooterCta({
  showArrow = false,
  showLinkedIn = false,
  twitterHref = "https://x.com/minviablemuslim",
}: {
  showArrow?: boolean;
  showLinkedIn?: boolean;
  twitterHref?: string;
}) {
  return (
    <section className="w-full">
      <div className="container mx-auto flex w-full flex-col items-center px-4 pb-10 pt-20 text-center">
        <h2 className="text-2xl font-semibold">
          Let&apos;s build something sharp
        </h2>
        <CtaActions
          className="mt-4"
          bookIcon={showArrow ? <ArrowRight className="size-4" /> : undefined}
        />
        <footer className="mt-12 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs">
          {/* <span>hello@example.studio</span> */}
          <Link
            href={twitterHref}
            target={twitterHref === "#" ? undefined : "_blank"}
            className="hover:text-foreground"
          >
            Twitter/X
          </Link>
          {showLinkedIn ? (
            <Link href="#" className="hover:text-foreground">
              LinkedIn
            </Link>
          ) : null}
          <span>&copy; 2026 pyxis.studio</span>
        </footer>
      </div>
    </section>
  );
}
