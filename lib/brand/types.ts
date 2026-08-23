export const BRAND_SECTION_IDS = [
  "introduction",
  "logo",
  "colors",
  "typography",
  "motion",
  "voice-and-tone",
  "moodboard",
  "applications",
  "assets",
] as const;

export type BrandSectionId = (typeof BRAND_SECTION_IDS)[number];

export interface BrandSectionDefinition {
  id: BrandSectionId;
  label: string;
}

export interface BrandMetadata {
  title: string;
  description: string;
}

export interface BrandTheme {
  background: string;
  foreground: string;
  accent: string;
  accentForeground: string;
  surface: string;
  muted: string;
  border: string;
}

export interface BrandFact {
  label: string;
  value: string;
}

export interface BrandIntroduction {
  heroSrc: string | null;
  heroAlt: string;
  statement: string;
  facts: readonly BrandFact[];
  heading: string;
  lead: string;
  body: string;
}

export interface BrandLogoVariant {
  title: string;
  description: string;
  src: string | null;
  darkSrc?: string | null;
  alt: string;
  clearSpaceLabel: string;
}

export interface BrandLogoConfig {
  heading: string;
  description: string;
  primary: BrandLogoVariant;
  mark: BrandLogoVariant;
}

export interface BrandMosaicPlacement {
  columnStart: number;
  columnSpan: number;
  rowStart: number;
  rowSpan: number;
}

export interface BrandColor {
  name: string;
  mosaicLabel?: string;
  hex: `#${string}`;
  foreground: "light" | "dark";
  proportion: number;
  mosaic: BrandMosaicPlacement;
}

export interface BrandColorsConfig {
  heading: string;
  description: string;
  proportionsNote: string;
  items: readonly BrandColor[];
}

export interface BrandFontWeight {
  name: string;
  value: number;
}

export interface BrandTypeface {
  id: string;
  displayName: string;
  nativeName?: string;
  cssFamily: string;
  source: string;
  styleCount: string;
  weights: readonly BrandFontWeight[];
}

export interface BrandTypeScaleItem {
  role: string;
  usage: "heading" | "body";
  sizePx: number;
  lineHeightPx: number;
  weight: number;
  sample: string;
}

export interface BrandTypographyHeadingSpecimen {
  typefaceId: string;
  role: string;
  description: string;
  charset: string;
  specimenGlyph: string;
  specimenWeightValues: readonly [number, ...number[]];
}

export interface BrandTypographySharedBody {
  mode: "shared";
}

export interface BrandTypographySeparateBody {
  mode: "separate";
  typefaceId: string;
  role: string;
  description: string;
  sample: string;
  specimenWeightValues: readonly [number, ...number[]];
}

export type BrandTypographyBody =
  BrandTypographySharedBody | BrandTypographySeparateBody;

export interface BrandTypographySystem {
  id: string;
  label: string;
  lang: string;
  direction: "ltr" | "rtl";
  heading: BrandTypographyHeadingSpecimen;
  body: BrandTypographyBody;
  scale: readonly BrandTypeScaleItem[];
}

export interface BrandTypographyConfig {
  heading: string;
  description: string;
  defaultSystemId: string;
  typefaces: readonly [BrandTypeface, ...BrandTypeface[]];
  systems: readonly [BrandTypographySystem, ...BrandTypographySystem[]];
}

export interface BrandMotionEase {
  id: string;
  name: string;
  description: string;
  bezier: readonly [number, number, number, number];
  durationMs: number;
  staggerMs?: number;
}

export interface BrandMotionMedia {
  src: string;
  alt: string;
}

interface BrandMotionExampleBase {
  id: string;
  label: string;
  easeId: string;
  durationMs?: number;
}

export interface BrandMotionExchangeExample extends BrandMotionExampleBase {
  kind: "exchange";
  images: readonly [BrandMotionMedia, BrandMotionMedia];
}

export interface BrandMotionCarouselExample extends BrandMotionExampleBase {
  kind: "carousel";
  images: readonly [
    BrandMotionMedia,
    BrandMotionMedia,
    BrandMotionMedia,
    ...BrandMotionMedia[],
  ];
}

export interface BrandMotionToggleExample extends BrandMotionExampleBase {
  kind: "toggle";
}

export interface BrandMotionRevealExample extends BrandMotionExampleBase {
  kind: "reveal";
  images: readonly [
    BrandMotionMedia,
    BrandMotionMedia,
    BrandMotionMedia,
    BrandMotionMedia,
    ...BrandMotionMedia[],
  ];
}

export type BrandMotionExample =
  | BrandMotionExchangeExample
  | BrandMotionCarouselExample
  | BrandMotionToggleExample
  | BrandMotionRevealExample;

export interface BrandMotionConfig {
  heading: string;
  description: string;
  labels: {
    demonstrations: string;
    examples: string;
    curves: string;
  };
  eases: readonly [BrandMotionEase, BrandMotionEase];
  examples: readonly [
    BrandMotionExample,
    BrandMotionExample,
    BrandMotionExample,
    BrandMotionExample,
  ];
  curveNarrative: readonly [string, string];
}

export interface BrandVoicePrinciple {
  example: string;
  label: string;
  explanation: string;
}

export interface BrandUsageExample {
  context: string;
  do: string;
  dont: string;
}

export interface BrandVoiceAndToneConfig {
  heading: string;
  description: string;
  principles: readonly BrandVoicePrinciple[];
  usageExamples: readonly BrandUsageExample[];
}

export interface BrandImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface BrandMoodboardConfig {
  heading: string;
  description: string;
  images: readonly BrandImage[];
}

export interface BrandApplication {
  title: string;
  src: string;
}

export interface BrandApplicationsConfig {
  heading: string;
  description: string;
  items: readonly BrandApplication[];
}

export interface BrandDownloadAsset {
  label: string;
  src: string;
}

export interface BrandLogoFile {
  name: string;
  src: string;
}

export interface BrandAssetsConfig {
  heading: string;
  description: string;
  completePackSrc: string | null;
  logoFiles: readonly BrandLogoFile[];
  typefaces: readonly BrandDownloadAsset[];
  colorFiles: readonly BrandDownloadAsset[];
  imagery: readonly BrandDownloadAsset[];
}

export interface BrandConfig<TSlug extends string = string> {
  slug: TSlug;
  name: string;
  guidelinesLabel: string;
  summary: string;
  year: number;
  assetsBasePath: `/brand/${TSlug}`;
  metadata: BrandMetadata;
  theme: BrandTheme;
  introduction: BrandIntroduction;
  logo: BrandLogoConfig;
  colors: BrandColorsConfig;
  typography: BrandTypographyConfig;
  motion: BrandMotionConfig;
  voiceAndTone: BrandVoiceAndToneConfig;
  moodboard: BrandMoodboardConfig;
  applications: BrandApplicationsConfig;
  assets: BrandAssetsConfig;
}
