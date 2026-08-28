import type {
  BrandConfig,
  BrandLogoVariant,
  BrandMotionConfig,
  BrandTypographyConfig,
} from "@/lib/brand/types";

const EXPECTED_MOTION_EXAMPLE_KINDS = [
  "exchange",
  "carousel",
  "toggle",
  "reveal",
] as const;

function fail(brandName: string, message: string): never {
  throw new Error(`Brand "${brandName}" ${message}`);
}

function assertText(brandName: string, label: string, value: string) {
  if (value.trim().length === 0) {
    fail(brandName, `must provide ${label}.`);
  }
}

function assertUniqueValues(
  brandName: string,
  label: string,
  values: readonly string[],
) {
  const seen = new Set<string>();

  for (const value of values) {
    if (seen.has(value)) {
      fail(brandName, `contains the duplicate ${label} "${value}".`);
    }
    seen.add(value);
  }
}

function validateLogoVariant(brandName: string, variant: BrandLogoVariant) {
  assertText(brandName, "a logo title", variant.title);
  assertText(brandName, `${variant.title} usage guidance`, variant.description);
  assertText(brandName, `${variant.title} alt text`, variant.alt);
  assertText(
    brandName,
    `${variant.title} clear-space label`,
    variant.clearSpaceLabel,
  );

  for (const source of [variant.src, variant.darkSrc]) {
    if (source && !/\.svg(?:[?#]|$)/i.test(source)) {
      fail(
        brandName,
        `${variant.title} artwork "${source}" must reference an SVG file.`,
      );
    }
  }
}

function validateColors(brand: BrandConfig) {
  const { colors } = brand;
  assertText(brand.name, "a Color heading", colors.heading);
  assertText(brand.name, "a Color description", colors.description);

  if (colors.items.length === 0) {
    fail(brand.name, "must configure at least one brand color.");
  }

  assertUniqueValues(
    brand.name,
    "color name",
    colors.items.map((color) => color.name),
  );

  const occupiedCells = new Map<string, string>();
  let totalProportion = 0;

  for (const color of colors.items) {
    if (!/^#[0-9a-f]{6}$/i.test(color.hex)) {
      fail(
        brand.name,
        `color "${color.name}" has invalid HEX value "${color.hex}".`,
      );
    }

    if (!Number.isFinite(color.proportion) || color.proportion <= 0) {
      fail(
        brand.name,
        `color "${color.name}" must have a positive proportion.`,
      );
    }
    totalProportion += color.proportion;

    const { columnStart, columnSpan, rowStart, rowSpan } = color.mosaic;
    const placementValues = [columnStart, columnSpan, rowStart, rowSpan];
    if (
      placementValues.some((value) => !Number.isInteger(value) || value < 1)
    ) {
      fail(
        brand.name,
        `color "${color.name}" has an invalid mosaic placement.`,
      );
    }
    if (columnStart + columnSpan - 1 > 6) {
      fail(
        brand.name,
        `color "${color.name}" exceeds the six-column mosaic grid.`,
      );
    }

    for (let row = rowStart; row < rowStart + rowSpan; row += 1) {
      for (
        let column = columnStart;
        column < columnStart + columnSpan;
        column += 1
      ) {
        const cell = `${column}:${row}`;
        const occupyingColor = occupiedCells.get(cell);
        if (occupyingColor) {
          fail(
            brand.name,
            `colors "${occupyingColor}" and "${color.name}" overlap at mosaic cell ${cell}.`,
          );
        }
        occupiedCells.set(cell, color.name);
      }
    }
  }

  if (Math.abs(totalProportion - 100) > 0.001) {
    fail(
      brand.name,
      `color proportions must total 100; received ${totalProportion}.`,
    );
  }
}

function validateTypography(
  brandName: string,
  typography: BrandTypographyConfig,
) {
  assertText(brandName, "a Typography heading", typography.heading);
  assertText(brandName, "a Typography description", typography.description);
  assertUniqueValues(
    brandName,
    "typeface ID",
    typography.typefaces.map((typeface) => typeface.id),
  );
  assertUniqueValues(
    brandName,
    "typography system ID",
    typography.systems.map((system) => system.id),
  );

  const typefaces = new Map(
    typography.typefaces.map((typeface) => [typeface.id, typeface] as const),
  );
  const systemIds = new Set(typography.systems.map((system) => system.id));

  if (!systemIds.has(typography.defaultSystemId)) {
    fail(
      brandName,
      `typography default system "${typography.defaultSystemId}" does not exist.`,
    );
  }

  for (const typeface of typography.typefaces) {
    assertText(
      brandName,
      `a display name for typeface "${typeface.id}"`,
      typeface.displayName,
    );
    assertText(
      brandName,
      `a CSS family for typeface "${typeface.id}"`,
      typeface.cssFamily,
    );
    assertUniqueValues(
      brandName,
      `weight in typeface "${typeface.id}"`,
      typeface.weights.map((weight) => String(weight.value)),
    );
  }

  for (const system of typography.systems) {
    assertText(
      brandName,
      `a label for typography system "${system.id}"`,
      system.label,
    );
    assertText(
      brandName,
      `a language for typography system "${system.id}"`,
      system.lang,
    );

    const headingTypeface = typefaces.get(system.heading.typefaceId);
    if (!headingTypeface) {
      fail(
        brandName,
        `typography system "${system.id}" references missing heading typeface "${system.heading.typefaceId}".`,
      );
    }

    const bodyTypeface =
      system.body.mode === "shared"
        ? headingTypeface
        : typefaces.get(system.body.typefaceId);
    if (!bodyTypeface) {
      const bodyTypefaceId =
        system.body.mode === "separate"
          ? system.body.typefaceId
          : system.heading.typefaceId;
      fail(
        brandName,
        `typography system "${system.id}" references missing body typeface "${bodyTypefaceId}".`,
      );
    }

    const headingWeights = new Set(
      headingTypeface.weights.map((weight) => weight.value),
    );
    for (const weight of system.heading.specimenWeightValues) {
      if (!headingWeights.has(weight)) {
        fail(
          brandName,
          `typography system "${system.id}" uses unavailable heading weight ${weight}.`,
        );
      }
    }

    const bodyWeights = new Set(
      bodyTypeface.weights.map((weight) => weight.value),
    );
    if (system.body.mode === "separate") {
      for (const weight of system.body.specimenWeightValues) {
        if (!bodyWeights.has(weight)) {
          fail(
            brandName,
            `typography system "${system.id}" uses unavailable body weight ${weight}.`,
          );
        }
      }
    }

    for (const scaleItem of system.scale) {
      const availableWeights =
        scaleItem.usage === "heading" ? headingWeights : bodyWeights;
      if (!availableWeights.has(scaleItem.weight)) {
        fail(
          brandName,
          `typography system "${system.id}" scale role "${scaleItem.role}" uses unavailable ${scaleItem.usage} weight ${scaleItem.weight}.`,
        );
      }
      if (scaleItem.sizePx <= 0 || scaleItem.lineHeightPx <= 0) {
        fail(
          brandName,
          `typography system "${system.id}" scale role "${scaleItem.role}" must use positive metrics.`,
        );
      }
    }
  }
}

function validateMotion(brandName: string, motion: BrandMotionConfig) {
  assertText(brandName, "a Motion heading", motion.heading);
  assertText(brandName, "a Motion description", motion.description);

  if (motion.eases.length !== 2) {
    fail(brandName, "must configure exactly two primary motion eases.");
  }
  if (motion.examples.length !== 4) {
    fail(brandName, "must configure exactly four motion examples.");
  }

  assertUniqueValues(
    brandName,
    "motion ease ID",
    motion.eases.map((ease) => ease.id),
  );
  assertUniqueValues(
    brandName,
    "motion example ID",
    motion.examples.map((example) => example.id),
  );

  const easeIds = new Set(motion.eases.map((ease) => ease.id));
  for (const ease of motion.eases) {
    if (!Number.isFinite(ease.durationMs) || ease.durationMs <= 0) {
      fail(
        brandName,
        `motion ease "${ease.id}" must have a positive duration.`,
      );
    }
    if (
      ease.staggerMs !== undefined &&
      (!Number.isFinite(ease.staggerMs) || ease.staggerMs < 0)
    ) {
      fail(brandName, `motion ease "${ease.id}" has an invalid stagger.`);
    }
    if (
      ease.bezier.some((value) => !Number.isFinite(value)) ||
      ease.bezier[0] < 0 ||
      ease.bezier[0] > 1 ||
      ease.bezier[2] < 0 ||
      ease.bezier[2] > 1
    ) {
      fail(
        brandName,
        `motion ease "${ease.id}" has an invalid cubic Bézier tuple.`,
      );
    }
  }

  const exampleKinds = new Set<string>();
  for (const example of motion.examples) {
    if (!easeIds.has(example.easeId)) {
      fail(
        brandName,
        `motion example "${example.id}" references unknown ease "${example.easeId}".`,
      );
    }
    if (
      example.durationMs !== undefined &&
      (!Number.isFinite(example.durationMs) || example.durationMs <= 0)
    ) {
      fail(
        brandName,
        `motion example "${example.id}" has an invalid duration.`,
      );
    }
    exampleKinds.add(example.kind);
  }

  for (const kind of EXPECTED_MOTION_EXAMPLE_KINDS) {
    if (!exampleKinds.has(kind)) {
      fail(brandName, `must configure one "${kind}" motion example.`);
    }
  }
}

export function collectBrandAssetPaths(brand: BrandConfig): string[] {
  const paths: Array<string | null | undefined> = [
    brand.introduction.heroSrc,
    brand.logo.primary.src,
    brand.logo.primary.darkSrc,
    brand.logo.mark.src,
    brand.logo.mark.darkSrc,
    brand.assets.fontStylesheetSrc,
    brand.assets.motionStylesheetSrc,
    brand.assets.completePackSrc,
    ...brand.motion.examples.flatMap((example) =>
      "images" in example ? example.images.map((image) => image.src) : [],
    ),
    ...brand.moodboard.images.map((image) => image.src),
    ...brand.applications.items.map((application) => application.src),
    ...brand.assets.logoFiles.map((asset) => asset.src),
    ...brand.assets.typefaces.map((asset) => asset.src),
    ...brand.assets.colorFiles.map((asset) => asset.src),
    ...brand.assets.imagery.map((asset) => asset.src),
  ];

  return [...new Set(paths.filter((path): path is string => Boolean(path)))];
}

export function assertValidBrandConfig(brand: BrandConfig): void {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(brand.slug)) {
    fail(brand.name, `has invalid URL slug "${brand.slug}".`);
  }
  if (brand.assetsBasePath !== `/brand/${brand.slug}`) {
    fail(
      brand.name,
      `must use assetsBasePath "/brand/${brand.slug}"; received "${brand.assetsBasePath}".`,
    );
  }
  if (!Number.isInteger(brand.year) || brand.year < 1900) {
    fail(brand.name, "must provide a valid year.");
  }

  const requiredText: ReadonlyArray<[string, string]> = [
    ["a name", brand.name],
    ["a guidelines label", brand.guidelinesLabel],
    ["a summary", brand.summary],
    ["a metadata title", brand.metadata.title],
    ["a metadata description", brand.metadata.description],
    ["an Introduction statement", brand.introduction.statement],
    ["an Introduction heading", brand.introduction.heading],
    ["an Introduction lead", brand.introduction.lead],
    ["an Introduction body", brand.introduction.body],
    ["a Logo heading", brand.logo.heading],
    ["a Logo description", brand.logo.description],
    ["a Voice and tone heading", brand.voiceAndTone.heading],
    ["a Voice and tone description", brand.voiceAndTone.description],
    ["a Moodboard heading", brand.moodboard.heading],
    ["a Moodboard description", brand.moodboard.description],
    ["an Applications heading", brand.applications.heading],
    ["an Applications description", brand.applications.description],
    ["an Assets heading", brand.assets.heading],
    ["an Assets description", brand.assets.description],
  ];
  requiredText.forEach(([label, value]) =>
    assertText(brand.name, label, value),
  );

  const requiredCollections: ReadonlyArray<[string, readonly unknown[]]> = [
    ["Introduction facts", brand.introduction.facts],
    ["voice principles", brand.voiceAndTone.principles],
    ["voice usage examples", brand.voiceAndTone.usageExamples],
    ["Moodboard images", brand.moodboard.images],
    ["Applications", brand.applications.items],
  ];
  requiredCollections.forEach(([label, values]) => {
    if (values.length === 0) fail(brand.name, `must provide ${label}.`);
  });

  validateLogoVariant(brand.name, brand.logo.primary);
  validateLogoVariant(brand.name, brand.logo.mark);
  validateColors(brand);
  validateTypography(brand.name, brand.typography);
  validateMotion(brand.name, brand.motion);

  for (const logoFile of brand.assets.logoFiles) {
    if (!/\.svg(?:[?#]|$)/i.test(logoFile.src)) {
      fail(
        brand.name,
        `logo download "${logoFile.name}" must reference an SVG file.`,
      );
    }
  }

  for (const assetPath of collectBrandAssetPaths(brand)) {
    if (
      !assetPath.startsWith(`${brand.assetsBasePath}/`) ||
      assetPath.includes("..") ||
      assetPath.includes("\\")
    ) {
      fail(
        brand.name,
        `asset "${assetPath}" must stay inside "${brand.assetsBasePath}/".`,
      );
    }
  }
}

export function defineBrand<const TSlug extends string>(
  brand: BrandConfig<TSlug>,
): BrandConfig<TSlug> {
  assertValidBrandConfig(brand);
  return brand;
}

export function assertUniqueBrandSlugs(brands: readonly BrandConfig[]): void {
  assertUniqueValues(
    "registry",
    "brand slug",
    brands.map((brand) => brand.slug),
  );
}
