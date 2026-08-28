import type { BrandMotionEase } from "@/lib/brand/types";

export interface BrandColorFormats {
  hex: string;
  rgb: string;
  hsl: string;
  cmyk: string;
}

export type BrandMotionSnippetFormat = "css" | "gsap" | "react";

export type BrandMotionSnippets = Record<BrandMotionSnippetFormat, string>;

function hexToRgbChannels(hex: string) {
  const raw = hex.replace("#", "").trim();
  const normalized =
    raw.length === 3
      ? raw
          .split("")
          .map((character) => `${character}${character}`)
          .join("")
      : raw;

  if (!/^[0-9a-f]{6}$/i.test(normalized)) {
    throw new Error(`Cannot convert invalid HEX color "${hex}".`);
  }

  return {
    red: Number.parseInt(normalized.slice(0, 2), 16),
    green: Number.parseInt(normalized.slice(2, 4), 16),
    blue: Number.parseInt(normalized.slice(4, 6), 16),
  };
}

export function getBrandColorFormats(hex: string): BrandColorFormats {
  const { red, green, blue } = hexToRgbChannels(hex);
  const redUnit = red / 255;
  const greenUnit = green / 255;
  const blueUnit = blue / 255;
  const max = Math.max(redUnit, greenUnit, blueUnit);
  const min = Math.min(redUnit, greenUnit, blueUnit);
  const delta = max - min;

  let hue = 0;
  if (delta !== 0) {
    if (max === redUnit) {
      hue = 60 * (((greenUnit - blueUnit) / delta) % 6);
    } else if (max === greenUnit) {
      hue = 60 * ((blueUnit - redUnit) / delta + 2);
    } else {
      hue = 60 * ((redUnit - greenUnit) / delta + 4);
    }
  }
  if (hue < 0) hue += 360;

  const lightness = (max + min) / 2;
  const saturation =
    delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));
  const black = 1 - max;
  const cyan = black === 1 ? 0 : (1 - redUnit - black) / (1 - black);
  const magenta = black === 1 ? 0 : (1 - greenUnit - black) / (1 - black);
  const yellow = black === 1 ? 0 : (1 - blueUnit - black) / (1 - black);

  const rgb = `${red}, ${green}, ${blue}`;
  const hsl = `${Math.round(hue)}, ${Math.round(saturation * 100)}%, ${Math.round(lightness * 100)}%`;
  const cmyk = `${Math.round(cyan * 100)}%, ${Math.round(magenta * 100)}%, ${Math.round(yellow * 100)}%, ${Math.round(black * 100)}%`;

  return {
    hex: hex.toUpperCase(),
    rgb: `rgb(${rgb})`,
    hsl: `hsl(${hsl})`,
    cmyk: `cmyk(${cmyk})`,
  };
}

function seconds(milliseconds: number) {
  return Number((milliseconds / 1000).toFixed(3));
}

export function formatBrandBezier(bezier: BrandMotionEase["bezier"]) {
  return bezier.join(", ");
}

export function getBrandMotionSnippets(
  brandSlug: string,
  ease: BrandMotionEase,
): BrandMotionSnippets {
  const bezier = formatBrandBezier(ease.bezier);
  const easeName = `${brandSlug}-${ease.id}`;
  const duration = seconds(ease.durationMs);

  return {
    css: `transition: transform ${ease.durationMs}ms cubic-bezier(${bezier});`,
    gsap: `CustomEase.create("${easeName}", "M0,0 C${ease.bezier[0]},${ease.bezier[1]} ${ease.bezier[2]},${ease.bezier[3]} 1,1");\ngsap.to(target, { duration: ${duration}, ease: "${easeName}" });`,
    react: `{ transition: { duration: ${duration}, ease: [${bezier}] } }`,
  };
}
