import { siteConfig } from "@/app/seo";
import {
  brandSectionLinks,
  brands,
  createPublicBrandDocument,
  getBrandBySlug,
  serializePublicBrandDocument,
} from "@/lib/brand";

type BrandDataRouteProps = {
  params: Promise<{ slug: string }>;
};

const publicHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Cache-Control":
    "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
  "Content-Type": "application/json; charset=utf-8",
} as const;

export const dynamic = "force-static";
export const dynamicParams = true;

export function generateStaticParams() {
  return brands.map((brand) => ({ slug: brand.slug }));
}

export async function GET(_request: Request, { params }: BrandDataRouteProps) {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);

  if (!brand) {
    return new Response(
      JSON.stringify({ error: "Brand not found", slug }, null, 2),
      { status: 404, headers: publicHeaders },
    );
  }

  const document = createPublicBrandDocument(
    brand,
    brandSectionLinks,
    siteConfig.url,
  );

  return new Response(serializePublicBrandDocument(document), {
    headers: {
      ...publicHeaders,
      "Content-Disposition": `inline; filename="${brand.slug}-brand.json"`,
    },
  });
}
