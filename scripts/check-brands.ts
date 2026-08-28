import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";

import { siteConfig } from "../app/seo";
import {
  brandSectionLinks,
  brands,
  collectBrandAssetPaths,
  createPublicBrandDocument,
  serializePublicBrandDocument,
} from "../lib/brand";

const publicRoot = path.resolve(process.cwd(), "public");

async function assertAssetExists(slug: string, assetPath: string) {
  const brandRoot = path.resolve(publicRoot, "brand", slug);
  const filePath = path.resolve(publicRoot, assetPath.slice(1));

  assert.ok(
    filePath.startsWith(`${brandRoot}${path.sep}`),
    `${assetPath} resolves outside ${brandRoot}.`,
  );

  await access(filePath);
}

async function assertBrainbotsTokenFiles() {
  const brand = brands.find((entry) => entry.slug === "brainbots");
  if (!brand) return;

  const tokensPath = path.resolve(
    publicRoot,
    "brand",
    brand.slug,
    "tokens.json",
  );
  const motionPath = path.resolve(
    publicRoot,
    "brand",
    brand.slug,
    "motion.css",
  );
  const tokens = JSON.parse(await readFile(tokensPath, "utf8")) as {
    brainbots: {
      easing: Record<string, { $value: number[] }>;
    };
  };
  const motionCss = await readFile(motionPath, "utf8");

  for (const ease of brand.motion.eases) {
    assert.deepEqual(
      tokens.brainbots.easing[ease.id]?.$value,
      [...ease.bezier],
      `Brainbots tokens.json does not match the ${ease.id} ease.`,
    );
    assert.ok(
      motionCss.includes(
        `--brainbots-ease-${ease.id}: cubic-bezier(${ease.bezier.join(", ")});`,
      ),
      `Brainbots motion.css does not match the ${ease.id} ease.`,
    );
  }
}

async function main() {
  let assetCount = 0;

  for (const brand of brands) {
    const assetPaths = collectBrandAssetPaths(brand);
    await Promise.all(
      assetPaths.map((assetPath) => assertAssetExists(brand.slug, assetPath)),
    );
    assetCount += assetPaths.length;

    const document = createPublicBrandDocument(
      brand,
      brandSectionLinks,
      siteConfig.url,
    );
    const firstSerialization = serializePublicBrandDocument(document);
    const secondSerialization = serializePublicBrandDocument(
      createPublicBrandDocument(brand, brandSectionLinks, siteConfig.url),
    );

    assert.equal(
      firstSerialization,
      secondSerialization,
      `${brand.name} public data is not deterministic.`,
    );
    assert.deepEqual(JSON.parse(firstSerialization), document);
    assert.equal(document.sectionOrder.length, 9);
    assert.ok(document.canonicalUrl.startsWith("https://"));
    assert.ok(document.dataUrl.endsWith(`/${brand.slug}/brand.json`));
    assert.ok(
      document.implementation.stylesheets.every((url) =>
        url.startsWith("https://"),
      ),
    );

    const unsafeDocument = {
      ...document,
      brand: { ...document.brand, summary: "</script><script>unsafe" },
    };
    const safeSerialization = serializePublicBrandDocument(unsafeDocument);
    assert.ok(!safeSerialization.includes("</script>"));
    assert.equal(
      (JSON.parse(safeSerialization) as typeof unsafeDocument).brand.summary,
      unsafeDocument.brand.summary,
    );
  }

  await assertBrainbotsTokenFiles();
  const brandCount: number = brands.length;
  console.log(
    `Validated ${brandCount} brand${brandCount === 1 ? "" : "s"} and ${assetCount} public asset references.`,
  );
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
