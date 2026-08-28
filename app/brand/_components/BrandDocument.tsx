import type { CSSProperties } from "react";

import {
  serializePublicBrandDocument,
  type BrandConfig,
  type BrandSectionDefinition,
  type PublicBrandDocument,
} from "@/lib/brand";

import { brandUiFont } from "../brand-font";
import { BrandNavigation } from "./client/BrandNavigation";
import { BrandDocumentEnd } from "./shared";
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
  publicDocument: PublicBrandDocument;
};

type BrandThemeProperties = CSSProperties & {
  "--foreground": string;
  "--muted-foreground": string;
  "--brand-background": string;
  "--brand-foreground": string;
  "--brand-accent": string;
  "--brand-accent-foreground": string;
  "--brand-surface": string;
  "--brand-muted": string;
  "--brand-line": string;
  "--display-brand-accent": string;
};

const BRAND_DOCUMENT_THEME = {
  background: "#FFFFFF",
  foreground: "#0A0A0A",
  accent: "#2201FF",
  accentForeground: "#FFFFFF",
  surface: "#F2F2F2",
  muted: "#747474",
  border: "#D8D8D8",
} as const;

export function BrandDocument({
  brand,
  sections,
  publicDocument,
}: BrandDocumentProps) {
  const theme: BrandThemeProperties = {
    "--foreground": BRAND_DOCUMENT_THEME.foreground,
    "--muted-foreground": BRAND_DOCUMENT_THEME.muted,
    "--brand-background": BRAND_DOCUMENT_THEME.background,
    "--brand-foreground": BRAND_DOCUMENT_THEME.foreground,
    "--brand-accent": BRAND_DOCUMENT_THEME.accent,
    "--brand-accent-foreground": BRAND_DOCUMENT_THEME.accentForeground,
    "--brand-surface": BRAND_DOCUMENT_THEME.surface,
    "--brand-muted": BRAND_DOCUMENT_THEME.muted,
    "--brand-line": BRAND_DOCUMENT_THEME.border,
    "--display-brand-accent": brand.theme.accent,
  };

  return (
    <div
      className="min-h-svh bg-(--brand-background) [color:var(--brand-foreground)]"
      style={theme}
    >
      {brand.assets.fontStylesheetSrc ? (
        <link
          rel="stylesheet"
          href={brand.assets.fontStylesheetSrc}
          precedence="high"
        />
      ) : null}
      <script
        id="brand-data"
        type="application/json"
        data-schema-version={publicDocument.schemaVersion}
        dangerouslySetInnerHTML={{
          __html: serializePublicBrandDocument(publicDocument),
        }}
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
        <BrandDocumentEnd brand={brand} />
      </BrandNavigation>
    </div>
  );
}
