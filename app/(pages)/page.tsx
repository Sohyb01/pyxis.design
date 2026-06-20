import type { Metadata } from "next";
import { siteConfig, socialImage } from "@/app/seo";
import { FaqSection } from "./Homepage Sections/FaqSection";
import { FooterCta } from "./Homepage Sections/FooterCta";
import { GainingTrustSection } from "./Homepage Sections/GainingTrustSection";
import { HeroSection } from "./Homepage Sections/HeroSection";
import { PricingSection } from "./Homepage Sections/PricingSection";
import { ShowcaseGallerySection } from "./Homepage Sections/ShowcaseGallerySection";
import { TestimonialsSection } from "./Homepage Sections/TestimonialsSection";
import { ToolsSection } from "./Homepage Sections/ToolsSection";
import { TrustedBySection } from "./Homepage Sections/TrustedBySection";
import { WhyStudioSection } from "./Homepage Sections/WhyStudioSection";

export const metadata: Metadata = {
  title: {
    absolute: siteConfig.title,
  },
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: "/",
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
    title: siteConfig.title,
    description: siteConfig.description,
    creator: "@minimumviableme",
    images: [socialImage.twitterPath],
  },
};

export default function Home() {
  return (
    <main className="min-h-screen text-foreground relative bg-neutral-100">
      {/* Crosshatch Art - Light Pattern */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-60"
        style={{
          backgroundImage: `
              repeating-linear-gradient(22.5deg, transparent, transparent 2px, rgba(75, 85, 99, 0.06) 2px, rgba(75, 85, 99, 0.06) 3px, transparent 3px, transparent 8px),
              repeating-linear-gradient(67.5deg, transparent, transparent 2px, rgba(107, 114, 128, 0.05) 2px, rgba(107, 114, 128, 0.05) 3px, transparent 3px, transparent 8px),
              repeating-linear-gradient(112.5deg, transparent, transparent 2px, rgba(55, 65, 81, 0.04) 2px, rgba(55, 65, 81, 0.04) 3px, transparent 3px, transparent 8px),
              repeating-linear-gradient(157.5deg, transparent, transparent 2px, rgba(31, 41, 55, 0.03) 2px, rgba(31, 41, 55, 0.03) 3px, transparent 3px, transparent 8px)
            `,
        }}
      />
      <HeroSection />
      <ShowcaseGallerySection />
      <TrustedBySection />
      <GainingTrustSection />
      {/* <ClientsSection /> */}
      <WhyStudioSection />
      <TestimonialsSection />
      <ToolsSection />
      {/* <TeamSection /> */}
      <PricingSection />
      <FaqSection />
      <FooterCta />
    </main>
  );
}
