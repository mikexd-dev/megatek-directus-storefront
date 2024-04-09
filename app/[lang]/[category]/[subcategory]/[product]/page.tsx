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
    console.log(productSlug, "productslug");
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
        ],
      });

      const productData = product?.data?.[0];
      console.log(productData, "productData");
      let product_selection;
      if (productData.selections.length > 0) {
        product_selection = await directus
          .items("product_selection")
          .readByQuery({
            filter: {
              product_id: {
                _eq: productData.selections[0].product_id,
              },
            },
            fields: ["*", "selection_id.*", "selection_id.selction_options.*"],
          });
      }

      console.log(product_selection, "product_selection");
      // const variant = await getVariantData(productData?.variants[0]?.slug);

      // console.log(productData.variants[0].selections[0], "product data");
      if (locale === "en") {
        return productData;
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
  console.log(product, "generatemetadata");
  // Get Post Data from Directus
  const productData = await getProductData(product, lang);

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
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/${category}/${subcategory}/${product}`, //TODO:
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

  const productData = await getProductData(productSlug, locale);

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

  const dictionary = await getDictionary(locale);

  return (
    <PaddingContainer>
      {/* Add JSON-LD to your page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Container */}
      <div className="space-y-10">
        <ProductLayout product={productData} />
        {/* CTA Card */}
        {/* ---@ts-expect-error Async Server Component */}
        {/* <CTACard dictionary={dictionary} /> */}
      </div>
    </PaddingContainer>
  );
};

export default Page;
