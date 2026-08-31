# Adding a brand guideline

Every brand page is generated from one typed `BrandConfig`. Do not copy the nine React section components and do not maintain a separate `brand.json` file. The page, embedded machine-readable data, and `/brand/<slug>/brand.json` endpoint all use the registered config.

Use [Brainbots](./brands/brainbots.ts) as the complete example. Complete this checklist in order.

## 1. Create the brand scaffold

- [ ] Choose a lowercase, URL-safe slug such as `new-brand`.
- [ ] Create `public/brand/<slug>/` with `logos/`, `motion/`, `fonts/`, `moodboard/`, and `applications/` folders.
- [ ] Add the required convention files: `introduction.png`; `logos/primary-logo.svg`, `logos/primary-logo-dark.svg`, `logos/logomark.svg`, `logos/logomark-dark.svg`; `motion/exchange-1.png`, `motion/exchange-2.png`, and `motion/carousel-1.png` through `motion/carousel-3.png`.
- [ ] Create `lib/brand/brands/<slug>.ts`.
- [ ] Define `const basePath = "/brand/<slug>" as const`.
- [ ] Export the config with `defineBrand({ ... })`. This preserves the literal slug type and runs structural validation immediately.
- [ ] Add the brand name, guidelines label, summary, year, metadata, and seven semantic theme colors.

`defineBrand()` derives these paths and throws when any required convention file is missing. Keep private, licensed, or unpublished material out of the public brand folder because every discovered file is public.

## 2. Introduction

- [ ] Add the hero artwork as the required `public/brand/<slug>/introduction.png` file; do not configure its source path.
- [ ] Write useful `heroAlt`, statement, heading, lead, and body copy.
- [ ] Add the compact facts shown over the hero.
- [ ] Check the full-height hero and editorial block on small and large screens.

## 3. Logo

- [ ] Configure the primary logo and logomark independently.
- [ ] Put the light and dark SVGs at the four required logo convention paths; do not configure their source paths.
- [ ] Add alt text, usage guidance, and clear-space labels. The four SVG downloads are generated automatically.
- [ ] Verify light, dark, and calculated clear-space presentations for both variants.

## 4. Color

- [ ] Add every named color with a six-digit HEX value and `light` or `dark` foreground treatment.
- [ ] Set example proportions that total exactly `100`.
- [ ] Place each color in the non-overlapping six-column mosaic using positive integer starts and spans.
- [ ] Keep semantic theme values aligned with the palette.
- [ ] Add the implementation-ready color CSS and token JSON files to `assets.colorFiles`.
- [ ] Verify Mosaic, Proportions, and all four copy formats.

RGB, HSL, and CMYK values in public brand data are derived from HEX and must not be entered separately.

## 5. Typography

- [ ] Register every typeface with a stable ID, display/native name, exact CSS family, source, style count, and available weights.
- [ ] Add each writing system with a label, BCP 47 language code, `ltr` or `rtl` direction, heading specimen, charset, glyph, and specimen weights.
- [ ] Choose `body.mode: "shared"` when headings and body use the same family. Use `"separate"` only when a second family introduction is required.
- [ ] Add the complete scale and explicitly mark every row as `heading` or `body` usage.
- [ ] Optionally set `letterSpacing` on any scale row using a CSS `em` or `px` value such as `-0.03em` or `0.5px`.
- [ ] Place font files and licenses in `fonts/`, create `fonts.css`, and set `assets.fontStylesheetSrc`.
- [ ] Add downloadable font files to `assets.typefaces`.
- [ ] Verify every configured weight exists and native-script text uses the intended font, language, and direction.

## 6. Motion

- [ ] Configure exactly two primary eases with unique IDs, names, descriptions, Bézier tuples, durations, and optional stagger values.
- [ ] Configure exactly one `exchange`, `carousel`, `toggle`, and `reveal` example.
- [ ] Reference `easeId` from every example; never copy an ease tuple into an example.
- [ ] Put Exchange and Carousel PNGs at the five required motion convention paths and configure only their descriptive alt text.
- [ ] Set `assets.motionStylesheetSrc` when a downloadable motion stylesheet exists.
- [ ] Keep that stylesheet and any downloadable tokens aligned with the config.
- [ ] Verify demonstrations, examples, curve graphs, and CSS/GSAP/React copy output.

## 7. Voice and tone

- [ ] Add voice principles as `{ example, label, explanation }` objects.
- [ ] Add Do/Don't usage objects for campaigns, product language, errors, calls to action, and any brand-specific contexts.
- [ ] Use concrete examples that an AI or human writer can reuse as guidance.

## 8. Moodboard

- [ ] Add approved images as sequential `1.png`, `2.png`, `3.png`, and so on in `public/brand/<slug>/moodboard/`.
- [ ] Configure optional alt text in matching order. Intrinsic dimensions and source paths are read automatically.
- [ ] Leave the folder empty to render `No files provided`.
- [ ] Verify image loading, aspect ratios, and column balance at each responsive breakpoint.

## 9. Applications

- [ ] Add previews as sequential `1.png`, `2.png`, `3.png`, and so on in `public/brand/<slug>/applications/`.
- [ ] Configure optional titles in matching order; source paths are generated automatically.
- [ ] Leave the folder empty to render `No files provided`.
- [ ] Verify all previews and their one-, two-, and three-column layouts.

## 10. Assets

- [ ] Add the optional complete-pack archive.
- [ ] Declare `fontStylesheetSrc` and `motionStylesheetSrc`, using `null` when one is intentionally unavailable.
- [ ] Add typefaces and color/token files to their corresponding arrays. Logo downloads and numbered moodboard imagery are generated automatically.
- [ ] Confirm every declared file exists below `public/brand/<slug>/` and every download works from the deployed origin.

## 11. Register and publish

- [ ] Import the config in `registry.ts` and add it to the `brands` array. Route generation, the directory, sitemap, and JSON endpoint derive from this registry.
- [ ] Run `npm run brand:check`.
- [ ] Run `npx tsc --noEmit`, scoped ESLint, and `npm run build`.
- [ ] Verify `/brand`, `/brand/<slug>`, and `/brand/<slug>/brand.json`.
- [ ] Verify an unknown slug returns a 404 and the sitemap contains only the canonical HTML page.
- [ ] Fetch the HTML without JavaScript and confirm `script#brand-data` contains the complete JSON document.
- [ ] Confirm the page head advertises the JSON endpoint as an `application/json` alternate.

## Machine-readable contract

The public payload has `schemaVersion: "1.0"` and is deterministic. It contains:

- Canonical HTML and JSON URLs plus the ordered nine-section index.
- The complete public brand config with absolute asset URLs.
- Derived HEX, RGB, HSL, and CMYK color formats.
- CSS-ready typography families, weights, languages, directions, and scale metrics.
- Motion timing functions and generated CSS, GSAP, and React Motion snippets.
- A categorized list of stylesheets and downloadable assets.

Consumers can use either source:

```js
const embedded = JSON.parse(document.querySelector("#brand-data").textContent);

const response = await fetch("/brand/<slug>/brand.json");
const brand = await response.json();
```

Do not add UI state, timestamps, measurements discovered in the browser, or secrets to this payload. Breaking changes require a new schema version.
