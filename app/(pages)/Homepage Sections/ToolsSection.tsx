import Image from "next/image";

import { cn } from "@/lib/utils";
import BackgroundGraphic from "@/components/custom/BackgroundGraphic";

type ToolLogo = {
  name: string;
  logo: string;
};

const LOGO_SIZE = "120px";
const logoToneClass =
  "object-contain transition-opacity duration-200 [filter:grayscale(1)_contrast(0)_brightness(1)] opacity-90 hover:opacity-100";

const topRowTools: ToolLogo[] = [
  {
    name: "Figma",
    logo: "/logos/figma.svg",
  },
  {
    name: "Next.js",
    logo: "/logos/nextjs.svg",
  },
  {
    name: "Tailwind CSS",
    logo: "/logos/tailwind.svg",
  },
];

const bottomRowTools: ToolLogo[] = [
  {
    name: "Illustrator",
    logo: "/logos/illustrator.svg",
  },
  {
    name: "Supabase",
    logo: "/logos/supabase.png",
  },
  {
    name: "Vercel",
    logo: "/logos/vercel.png",
  },
];

export function ToolsSection() {
  return (
    <section className="py-20">
      <style>
        {`
          @keyframes tools-marquee-left {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }

          @keyframes tools-marquee-right {
            from { transform: translateX(-50%); }
            to { transform: translateX(0); }
          }

          @media (prefers-reduced-motion: reduce) {
            .tools-marquee-track {
              animation: none !important;
              transform: translateX(0) !important;
            }
          }
        `}
      </style>

      <div className="container space-y-10 lg:space-y-16">
        <h2 className="mb-4 text-3xl text-center">Tools we&apos;ve mastered</h2>

        <div className="flex w-full flex-col items-center gap-8 max-w-screen-md bg-card rounded-xl border-solid border-border/95 border-[1px] mx-auto z-1 py-5 relative">
          <LogoRow
            companies={[...topRowTools, ...topRowTools]}
            gridClassName="grid-cols-3"
          />
          <LogoRow
            companies={[...bottomRowTools, ...bottomRowTools]}
            gridClassName="grid-cols-3"
            direction="right"
          />
        </div>
      </div>
    </section>
  );
}

type LogoRowProps = {
  companies: ToolLogo[];
  gridClassName: string;
  direction?: "left" | "right";
};

const LogoRow = ({
  companies,
  gridClassName,
  direction = "left",
}: LogoRowProps) => {
  const marqueeCompanies = [...companies, ...companies];

  return (
    <>
      <div className="w-full overflow-hidden">
        <div
          className={cn(
            "tools-marquee-track flex w-max items-center hover:[animation-play-state:paused]",
            direction === "right"
              ? "[animation:tools-marquee-right_36s_linear_infinite]"
              : "[animation:tools-marquee-left_36s_linear_infinite]",
          )}
        >
          {marqueeCompanies.map((company, index) => {
            const isDuplicate = index >= companies.length;

            return (
              <LogoImage
                key={`${company.name}-${index}`}
                company={company}
                decorative={isDuplicate}
                className="mx-8"
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

type LogoImageProps = {
  company: ToolLogo;
  className?: string;
  decorative?: boolean;
};

const LogoImage = ({
  company,
  className,
  decorative = false,
}: LogoImageProps) => (
  <div
    aria-hidden={decorative}
    className={cn("relative h-[50px] w-[120px] shrink-0", className)}
  >
    <Image
      src={company.logo}
      alt={decorative ? "" : `${company.name} logo`}
      fill
      sizes={LOGO_SIZE}
      draggable={false}
      className={logoToneClass}
    />
  </div>
);
