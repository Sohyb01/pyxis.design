import type { CSSProperties } from "react";

import type { BrandConfig, BrandSectionDefinition } from "@/lib/brand";

import { brandUiFont } from "../brand-font";
import { BrandNavigation } from "./client/BrandNavigation";
import {
  ApplicationsSection,
  AssetsSection,
  ColorsSection,
  IntroductionSection,
  LogoSection,
  MoodboardSection,
  MotionSection,
  TypographySection,
  VoiceAndToneSection,
} from "./sections";

type BrandDocumentProps = {
  brand: BrandConfig;
  sections: readonly BrandSectionDefinition[];
};

type BrandThemeProperties = CSSProperties & {
  "--brand-background": string;
  "--brand-foreground": string;
  "--brand-accent": string;
  "--brand-accent-foreground": string;
  "--brand-surface": string;
  "--brand-muted": string;
  "--brand-line": string;
};

export function BrandDocument({ brand, sections }: BrandDocumentProps) {
  const theme: BrandThemeProperties = {
    "--brand-background": brand.theme.background,
    "--brand-foreground": brand.theme.foreground,
    "--brand-accent": brand.theme.accent,
    "--brand-accent-foreground": brand.theme.accentForeground,
    "--brand-surface": brand.theme.surface,
    "--brand-muted": brand.theme.muted,
    "--brand-line": brand.theme.border,
  };

  return (
    <div
      className="min-h-svh bg-(--brand-background) [color:var(--brand-foreground)]"
      style={theme}
    >
      <link
        rel="stylesheet"
        href={`${brand.assetsBasePath}/fonts.css`}
        precedence="high"
      />
      <BrandNavigation
        brandName={brand.name}
        fontClassName={brandUiFont.className}
        guidelinesLabel={brand.guidelinesLabel}
        sections={sections}
        themeStyle={theme}
      >
        <IntroductionSection brand={brand} />
        <LogoSection brand={brand} />
        <ColorsSection brand={brand} />
        <TypographySection brand={brand} />
        <MotionSection brand={brand} />
        <VoiceAndToneSection brand={brand} />
        <MoodboardSection brand={brand} />
        <ApplicationsSection brand={brand} />
        <AssetsSection brand={brand} />
      </BrandNavigation>
    </div>
  );
}
