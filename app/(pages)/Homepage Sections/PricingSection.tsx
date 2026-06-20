"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CtaActions } from "@/components/custom/CtaActions";
import { TextEffect } from "@/components/motion/text-effect";

const BOOK_CALL_HREF = "https://calendly.com/suhaybm/strategy-call";

const pricingOptions = [
  {
    key: "product",
    label: "Product",
    title: "Custom scope",
    price: "$10,000+",
    features: [
      "Custom website features",
      "Deep UX research",
      "Pixel-perfect development",
      "Rapid iteration and feedback cycles",
      "Figma + PNG handoff",
    ],
  },
  {
    key: "landing",
    label: "Landing",
    title: "Custom scope",
    price: "$5,000+",
    features: [
      "Single page",
      "Full copywriting",
      "2 week delivery",
      "NextJS development",
      "30-day maintenance",
    ],
  },
  {
    key: "full-site",
    label: "Full Site",
    title: "Custom scope",
    price: "$10,000+",
    features: [
      "Multiple pages",
      "Full copywriting",
      "2-4 week delivery",
      "Figma + rive/lottie",
      "Framer/Webflow/NextJS",
    ],
  },
  {
    key: "brand",
    label: "Brand",
    title: "Flat Fee",
    price: "$7,500+",
    features: [
      "Logo, type, colors",
      "Brand assets",
      "Brand guidelines",
      "2-4 week delivery",
      "Ready-to-use brand kit",
    ],
  },
] as const;

const retainerFeatures = [
  "1 request at a time",
  "Flexible, evolving scope",
  "Daily updates mon-fri",
];

function MeetIcon() {
  return (
    <Image
      src="/logos/Google_Meet_icon_(2020).svg"
      alt=""
      width={15}
      height={15}
      aria-hidden="true"
    />
  );
}

function FeatureList({
  features,
  animationKey,
}: {
  features: readonly string[];
  animationKey?: string;
}) {
  return (
    <ul className="flex flex-col gap-2.5 text-subtle text-muted-foreground">
      {features.map((feature, index) => (
        <li key={feature} className="flex items-center gap-1.5">
          <span className="flex size-3.5 shrink-0 items-center justify-center text-foreground">
            <Check className="size-3.5" />
          </span>
          {animationKey ? (
            <TextEffect
              key={`${animationKey}-${index}-${feature}`}
              as="span"
              per="word"
              preset="slide"
              speedReveal={1.35}
              speedSegment={1.25}
            >
              {feature}
            </TextEffect>
          ) : (
            <span>{feature}</span>
          )}
        </li>
      ))}
    </ul>
  );
}

function BookIntroCallButton({ className }: { className?: string }) {
  return (
    <Link
      href={BOOK_CALL_HREF}
      target="_blank"
      rel="noreferrer"
      className={buttonVariants({
        variant: "secondary",
        className: cn("rounded-full", className),
      })}
    >
      <MeetIcon />
      Book Intro Call
    </Link>
  );
}

export function PricingSection() {
  const [selectedKey, setSelectedKey] =
    useState<(typeof pricingOptions)[number]["key"]>("product");
  const selectedOption =
    pricingOptions.find((option) => option.key === selectedKey) ??
    pricingOptions[0];

  return (
    <section className="w-full">
      <div className="container mx-auto flex w-full flex-col items-center gap-8 px-4 py-16 md:gap-12">
        <h2 className="text-center text-2xl font-semibold md:text-3xl">
          Pricing
        </h2>
        <div className="flex w-full flex-col items-stretch justify-center gap-[1.125rem] md:flex-row">
          {/* Left side */}
          <div className="flex w-full flex-col gap-4 md:w-auto">
            <div className="flex w-full items-center justify-start gap-2 md:w-[23.125rem]">
              {pricingOptions.map((option) => {
                const isSelected = option.key === selectedOption.key;

                return (
                  <Button
                    key={option.key}
                    type="button"
                    onClick={() => setSelectedKey(option.key)}
                    variant={isSelected ? "secondary" : "outline"}
                    size="sm"
                    className="z-1"
                  >
                    {option.label}
                  </Button>
                );
              })}
            </div>
            <article className="relative flex w-full flex-1 flex-col justify-between rounded-3xl border border-border bg-card px-6 py-5 pb-6 z-[1] md:w-[23.125rem] border-border/95 border-solid border-[1px]">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-muted-foreground">
                  {selectedOption.title}
                </span>
                <TextEffect
                  key={`${selectedOption.key}-${selectedOption.price}`}
                  as="span"
                  per="char"
                  preset="slide"
                  speedReveal={1.6}
                  speedSegment={1.25}
                  className="text-2xl font-bold text-foreground"
                >
                  {selectedOption.price}
                </TextEffect>
              </div>
              <div className="mt-4">
                <FeatureList
                  features={selectedOption.features}
                  animationKey={selectedOption.key}
                />
              </div>
              <CtaActions showMessage={false} className="mt-7 me-auto" />
            </article>
          </div>
          {/* Right side */}
          <div className="flex w-full flex-col items-center gap-4 md:w-auto">
            <article className="relative flex w-full flex-1 flex-col justify-between rounded-3xl border border-border bg-card px-6 py-5 pb-6 z-[1] md:w-[23.125rem] border-border/95 border-solid border-[1px]">
              <Badge
                variant="ghost"
                className="absolute right-5 top-5 text-muted-foreground"
              >
                (1/2 slots available)
              </Badge>
              <div>
                <div className="pr-28">
                  <p className="text-sm font-medium text-muted-foreground">
                    Design/dev retainer
                  </p>
                  <h3 className="mt-1 text-2xl font-bold">$10,000/mo</h3>
                </div>
                <div className="mt-6">
                  <FeatureList features={retainerFeatures} />
                </div>
              </div>
              <CtaActions showMessage={false} className="mt-7 me-auto" />
            </article>
            <article className="flex w-full flex-wrap items-center justify-between gap-3 rounded-3xl border border-border bg-card px-6 py-5 pb-5 z-[1] md:w-[23.125rem] border-border/95 border-solid border-[1px]">
              <p className="text-xl">Something else in mind?</p>
              <CtaActions showBook={false} />
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
