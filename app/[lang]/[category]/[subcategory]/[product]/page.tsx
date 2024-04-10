import CTACard from "@/components/elements/cta-card";
import SocialLink from "@/components/elements/social-link";
import PaddingContainer from "@/components/layout/padding-container";
import PostBody from "@/components/post/post-body";
import PostHero from "@/components/post/post-hero";
import ProductLayout from "@/components/product/product-layout";
import siteConfig from "@/config/site";
import directus from "@/lib/directus";
import { getDictionary } from "@/lib/getDictionary";
import { notFound } from "next/navigation";
import { cache } from "react";

// Get Post Data
export const getProductData = cache(
  async (productSlug: string, locale: string) => {
    try {
      const product = await directus.items("product").readByQuery({
        filter: {
          slug: {
            _eq: productSlug,
          },
        },
        fields: [
          "*",
          "images.*",
          "variants.*",
          "variants.selections.*",
          "variants.selections.selection_options.*",
          "subcategory.title",
          "selections.*",
          "selections.selectionId.*",
          "selections.title",
          "selections.status",
          "selections.description",
          "selections.selection_options",
          "selections.selection_options.*",
          "selections.selection_options.shouldHide.*",
        ],
      });

      const productData = product?.data?.[0];
      let product_selection = null;
      if (!productData.hasVariant && productData.selections.length > 0) {
        product_selection = await directus
          .items("product_selection")
          .readByQuery({
            filter: {
              product_id: {
                _eq: productData.selections[0].product_id,
              },
            },
            fields: [
              "*",
              "selection_id.*",
              "selection_id.selection_options.*",
              "selection_id.selection_options.shouldHide.*",
            ],
          });
      }

      let variant_selection: any = {};
      if (productData.hasVariant && productData.variants.length > 0) {
        for (const variant of productData.variants) {
          const selectionPromises = variant.selections.map(
            async (selection: any) =>
              directus.items("variant_selection").readByQuery({
                filter: {
                  variant_id: {
                    _eq: selection.variant_id,
                  },
                },
                fields: [
                  "*",
                  "selection_id.*",
                  "selection_id.selection_options.*",
                  "selection_id.selection_options.shouldHide.*",
                ],
              })
          );
          const selectionResults = await Promise.all(selectionPromises);

          variant_selection[variant.id] = selectionResults[0]?.data;
        }
      }

      if (locale === "en") {
        return { productData, product_selection, variant_selection };
      }
    } catch (error) {
      console.log(JSON.stringify(error));
      throw new Error("Error fetching product");
    }
  }
);

// Generate Metadata Function
export const generateMetadata = async ({
  params: { category, subcategory, product, lang },
}: {
  params: {
    category: string;
    subcategory: string;
    product: string;
    lang: string;
  };
}) => {
  // Get Post Data from Directus
  //@ts-ignore
  const { productData, product_selection, variant_selection } =
    await getProductData(product, lang);

  let canonicalPath = "";
  if (product === "9s-series-cleanroom-esd-chair") {
    canonicalPath = "industrial-seating/9S-Series-Cleanroom-ESD-Chair";
  } else if (product === "9g-series-cleanroom-esd-chair") {
    canonicalPath = "industrial-seating/9G-Series-Cleanroom-ESD-Chair";
  } else if (product === "9p-series-cleanroom-esd-chair") {
    canonicalPath = "industrial-seating/9P-Series-Cleanroom-ESD-Chair";
  } else if (product === "5p-series-cleanroom-esd-chair") {
    canonicalPath = "industrial-seating/5P-Series-Cleanroom-ESD-Chair";
  } else if (product === "7p-series-cleanroom-esd-chair") {
    canonicalPath = "industrial-seating/7P-Series-Cleanroom-ESD-Chair";
  } else if (product === "p8-series-cleanroom-esd-pu-chair") {
    canonicalPath = "industrial-seating/P8-Series-Cleanroom-ESD-PU-Chair";
  } else if (product === "pu-moulded-laboratory-chair") {
    canonicalPath = "industrial-seating/PU-Moulded-Laboratory-Chair";
  } else if (product === "technical-s1-cleanroom-esd-stool") {
    canonicalPath = "industrial-seating/technical-s1-cleanroom-esd-stool/";
  } else if (product === "technical-s2-stainless-steel-stool") {
    canonicalPath = "industrial-seating/Technical-S2-Stainless-Steel-Stool";
  } else if (product === "technical-s3-cleanroom-esd-pu-stool") {
    canonicalPath = "industrial-seating/Technical-S3-Cleanroom-ESD-PU-Stool";
  } else if (product === "technical-s4-pu-sit-stand-stool") {
    canonicalPath = "industrial-seating/Technical-S4-PU-Sit-Stand-Stool";
  } else if (product === "technical-s5-cleanroom-esd-saddle-stool") {
    canonicalPath =
      "industrial-seating/Technical-S5-Cleanroom-ESD-Saddle-Stool";
  } else if (product === "chair-base") {
    canonicalPath = "Industrial-Seating-components/Chair-base";
  } else if (product === "chair-gas-lift") {
    canonicalPath = "Industrial-Seating-components/Chair-Gas-Lift";
  } else if (product === "chair-foot-ring") {
    canonicalPath = "Industrial-Seating-components/Chair-Footring";
  } else if (product === "chair-castors") {
    canonicalPath = "Industrial-Seating-components/Chair-Castor";
  } else if (product === "wire-shelving-rack") {
    canonicalPath = "industrial-wire-shelving-rack";
  }

  return {
    title: productData?.title,
    description: productData?.description,
    openGraph: {
      title: productData?.title,
      description: productData?.description,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${lang}/${category}/${subcategory}/${product}`,
      siteName: productData?.title,
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/${lang}/${category}/${subcategory}/${product}/opengraph-image.png`,
          width: 1200,
          height: 628,
        },
      ],
      locale: lang,
      type: "website",
    },
    alternates: {
      canonical: `https://www.megatek.org/${canonicalPath}`,
      languages: {
        "en-US": `${process.env.NEXT_PUBLIC_SITE_URL}/en/${category}/${subcategory}/${product}`,
      },
    },
  };
};

// Generate Static Params Function
export const generateStaticParams = async () => {
  try {
    const products = await directus.items("product").readByQuery({
      filter: {
        status: {
          _eq: "published",
        },
      },
      fields: ["slug"],
    });

    const params = products?.data?.map((product) => {
      return {
        slug: product.slug as string,
        lang: "en",
      };
    });

    const localisedParams = products?.data?.map((product) => {
      return {
        slug: product.slug as string,
        lang: "de",
      };
    });

    // Concat Localised and Regular Params
    const allParams = params?.concat(localisedParams ?? []);

    return allParams || [];
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching products");
  }
};

const Page = async ({
  params: { category, subcategory, product, lang },
}: {
  params: {
    category: string;
    subcategory: string;
    product: string;
    lang: string;
  };
}) => {
  const locale = lang;
  const productSlug = product;

  //@ts-ignore
  const { productData, product_selection, variant_selection } =
    await getProductData(productSlug, locale);

  /* Structured Data for Google */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productData.title,
    image: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/${category}/${subcategory}/${productData.slug}/opengraph-image.png`,
    description: productData.description,
    category: `${category}/${subcategory}`,
    brand: {
      "@type": "Brand",
      name: "Megatek", // Replace with actual brand name
    },
  };

  //   console.log(productData, "productdata");
  // If there is no post found, return 404
  if (!productData || productData.status !== "published") {
    notFound();
  }

  // const dictionary = await getDictionary(locale);

  return (
    <PaddingContainer>
      {/* Add JSON-LD to your page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Container */}
      <div className="space-y-10">
        <ProductLayout
          product={productData}
          product_selection={product_selection}
          variant_selection={variant_selection}
        />
        {/* CTA Card */}
        {/* ---@ts-expect-error Async Server Component */}
        {/* <CTACard dictionary={dictionary} /> */}
      </div>
    </PaddingContainer>
  );
};

export default Page;
