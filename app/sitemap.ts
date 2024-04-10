import directus from "@/lib/directus";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseURL = process.env.NEXT_PUBLIC_SITE_URL as string;

  // Get Posts
  const category = await directus.items("category").readByQuery({
    fields: ["slug", "date_updated"],
  });

  const categoryLinks = category?.data?.map((cat) => {
    return [
      {
        url: `${baseURL}/en/${cat.slug}`,
        lastModified: new Date(cat.date_updated),
      },
      {
        url: `${baseURL}/${cat.slug}`,
        lastModified: new Date(cat.date_updated),
      },
    ];
  });

  // // Get Categories
  // const categories = await directus.items("Category").readByQuery({
  //   fields: ["slug", "date_updated"],
  // });

  // const categoryLinks = categories?.data?.map((category) => {
  //   return [
  //     {
  //       url: `${baseURL}/en/${category.slug}`,
  //       lastModified: new Date(),
  //     },
  //     {
  //       url: `${baseURL}/de/${category.slug}`,
  //       lastModified: new Date(),
  //     },
  //     {
  //       url: `${baseURL}/${category.slug}`,
  //       lastModified: new Date(),
  //     },
  //   ];
  // });
  const loadHardcodedLinks = () => {
    return [
      "https://configurator.megatek.org/en/industry-seatings/chairs/9s-series-cleanroom-esd-chair",
      "https://configurator.megatek.org/en/industry-seatings/chairs/9g-series-conductive-chair",
      "https://configurator.megatek.org/en/industry-seatings/chairs/9p-series-cleanroom-esd-chair",
      "https://configurator.megatek.org/en/industry-seatings/chairs/5p-series-cleanroom-esd-chair",
      "https://configurator.megatek.org/en/industry-seatings/chairs/7p-series-cleanroom-esd-chair",
      "https://configurator.megatek.org/en/industry-seatings/chairs/p8-series-cleanroom-esd-pu-chair",
      "https://configurator.megatek.org/en/industry-seatings/chairs/pu-moulded-laboratory-chair",
      "https://configurator.megatek.org/en/industry-seatings/stools/technical-s1-cleanroom-esd-stool",
      "https://configurator.megatek.org/en/industry-seatings/stools/technical-s2-stainless-steel-stool",
      "https://configurator.megatek.org/en/industry-seatings/stools/technical-s3-cleanroom-esd-pu-stool",
      "https://configurator.megatek.org/en/industry-seatings/stools/technical-s4-pu-sit-stand-stool",
      "https://configurator.megatek.org/en/industry-seatings/stools/technical-s5-cleanroom-esd-saddle-stool",
      "https://configurator.megatek.org/en/industry-seatings/components/chair-base",
      "https://configurator.megatek.org/en/industry-seatings/components/chair-gas-lift",
      "https://configurator.megatek.org/en/industry-seatings/components/chair-foot-ring",
      "https://configurator.megatek.org/en/industry-seatings/components/chair-castors",
      "https://configurator.megatek.org/en/industrial-wire-shelving/wire-shelving-rack/wire-shelving-rack",
    ].map((link) => ({ url: link, lastModified: new Date() }));
  };

  const dynamicLinks =
    categoryLinks?.concat(loadHardcodedLinks() ?? []).flat() ?? [];

  return [
    {
      url: baseURL,
      lastModified: new Date(),
    },
    {
      url: `${baseURL}/en`,
      lastModified: new Date(),
    },
    ...dynamicLinks,
  ];
}
//@ts-ignore
