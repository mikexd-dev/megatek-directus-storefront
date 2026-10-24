import siteConfig from "@/config/site";
import directus from "@/lib/directus";
import { MetadataRoute } from "next";

const getLastModified = (item: any) => {
  const date = item?.date_updated ?? item?.date_created;
  return date ? new Date(date) : undefined;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseURL = siteConfig.siteUrl;

  const [categories, products] = await Promise.all([
    directus.items("category").readByQuery({
      filter: { status: { _eq: "published" } },
      fields: ["slug", "date_updated", "date_created", "subcategory.slug"],
      limit: -1,
    }),
    directus.items("product").readByQuery({
      filter: { status: { _eq: "published" } },
      fields: ["slug", "date_updated", "date_created", "subcategory.slug"],
      limit: -1,
    }),
  ]);

  // Product URLs are /en/<category>/<subcategory>/<product>, so resolve each
  // subcategory to the category that lists it
  const categorySlugBySubcategory = new Map<string, string>();
  categories?.data?.forEach((category: any) =>
    category.subcategory?.forEach((subcategory: any) =>
      categorySlugBySubcategory.set(subcategory.slug, category.slug)
    )
  );

  const categoryLinks = (categories?.data ?? []).map((category: any) => ({
    url: `${baseURL}/en/${category.slug}`,
    lastModified: getLastModified(category),
  }));

  const productLinks = (products?.data ?? []).flatMap((product: any) => {
    const subcategorySlug = product.subcategory?.slug;
    const categorySlug = categorySlugBySubcategory.get(subcategorySlug);
    if (!categorySlug) return [];
    return [
      {
        url: `${baseURL}/en/${categorySlug}/${subcategorySlug}/${product.slug}`,
        lastModified: getLastModified(product),
      },
    ];
  });

  return [{ url: `${baseURL}/en` }, ...categoryLinks, ...productLinks];
}
