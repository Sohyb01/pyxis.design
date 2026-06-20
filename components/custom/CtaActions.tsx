import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const BOOK_CALL_HREF = "https://calendly.com/suhaybm/strategy-call";

function GoogleMeetIcon() {
  return (
    <Image
      src="/logos/Google_Meet_icon_(2020).svg"
      alt=""
      width={16}
      height={16}
      aria-hidden="true"
    />
  );
}

function XLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4">
      <path
        fill="currentColor"
        d="M13.74 10.52 21.15 2h-1.76l-6.43 7.4L7.82 2H1.9l7.77 11.19L1.9 22h1.76l6.78-7.79L15.85 22h5.92l-8.03-11.48Zm-2.4 2.76-.79-1.11L4.3 3.31h2.68l5.06 7.16.78 1.11 6.57 9.3h-2.68l-5.37-7.6Z"
      />
    </svg>
  );
}

function TelegramLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4">
      <path
        fill="currentColor"
        d="M21.84 3.22a1.52 1.52 0 0 0-1.55-.25L3.03 9.61c-1.18.46-1.16 2.14.04 2.55l4.37 1.49 1.7 5.39c.36 1.15 1.83 1.47 2.63.57l2.45-2.73 4.43 3.26c.95.7 2.31.17 2.54-.99L23 4.8c.12-.61-.16-1.23-.67-1.58Zm-3.06 3.35-8.6 7.65-.33 3.05-1.13-3.58 10.06-7.12Z"
      />
    </svg>
  );
}

const socialLinks = [
  { label: "X", href: "https://x.com/minimumviableme", icon: XLogo },
  {
    label: "Telegram",
    href: "http://t.me/minimumviableme",
    icon: TelegramLogo,
  },
];

export function CtaActions({
  className,
  bookHref = BOOK_CALL_HREF,
  bookLabel = "Book a call",
  bookIcon = <GoogleMeetIcon />,
  bookClassName,
  messageLabel = "Send message",
  showBook = true,
  showMessage = true,
}: {
  className?: string;
  bookHref?: string;
  bookLabel?: string;
  bookIcon?: ReactNode;
  bookClassName?: string;
  messageLabel?: string;
  showBook?: boolean;
  showMessage?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-4",
        className,
      )}
    >
      {showBook ? (
        <Button asChild variant="secondary" className={bookClassName}>
          <Link
            href={bookHref}
            target={bookHref === "#" ? undefined : "_blank"}
            rel={bookHref === "#" ? undefined : "noreferrer"}
          >
            {bookLabel}
            {bookIcon}
          </Link>
        </Button>
      ) : null}
      {showMessage ? (
        <div className="flex items-center gap-2 text-muted-foreground text-subtle">
          {messageLabel}
          {socialLinks.map((social) => {
            const Icon = social.icon;

            return (
              <Link
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className={buttonVariants({
                  variant: "outline",
                  size: "icon-sm",
                  className: "rounded-full text-foreground",
                })}
              >
                <Icon />
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
