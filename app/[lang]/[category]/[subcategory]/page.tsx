import CategoryBody from "@/components/category/category-body";
import PaddingContainer from "@/components/layout/padding-container";
import PostList from "@/components/post/post-lists";
import SubcategoryList from "@/components/subcategory/subcategory-lists";
import directus from "@/lib/directus";
import { Post, Subcategory } from "@/types/collection";
import { notFound } from "next/navigation";
import { cache } from "react";

export const getSubCategoryData = cache(
  async (subcategorySlug: string, locale: string) => {
    try {
      const subcategory = await directus.items("subcategory").readByQuery({
        filter: {
          slug: {
            _eq: subcategorySlug,
          },
        },
        fields: ["*"],
      });

      return subcategory?.data?.[0];
    } catch (error) {
      console.log(error);
      throw new Error("Error fetching category");
    }
  }
);

// Generate Metadata Function
export const generateMetadata = async ({
  params: { subcategory, lang },
}: {
  params: {
    subcategory: string;
    lang: string;
  };
}) => {
  // Get Data from Directus
  const subcategoryData = await getSubCategoryData(subcategory, lang);

  return {
    title: subcategoryData?.title,
    description: subcategoryData?.description,
    openGraph: {
      title: subcategoryData?.title,
      description: subcategoryData?.description,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${lang}/${subcategory}`,
      siteName: subcategoryData?.title,
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/${lang}/${subcategory}/opengraph-image.png`,
          width: 1200,
          height: 628,
        },
      ],
      locale: lang,
      type: "website",
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/${subcategory}`,
      languages: {
        "en-US": `${process.env.NEXT_PUBLIC_SITE_URL}/en/${subcategory}`,
      },
    },
  };
};

export const generateStaticParams = async () => {
  try {
    const subcategories = await directus.items("subcategory").readByQuery({
      filter: {
        status: {
          _eq: "published",
        },
      },
      fields: ["slug"],
    });

    const params = subcategories?.data?.map((category) => {
      return {
        category: category.slug as string,
        lang: "en",
      };
    });

    const localisedParams = subcategories?.data?.map((category) => {
      return {
        category: category.slug as string,
        lang: "de",
      };
    });

    const allParams = params?.concat(localisedParams ?? []);
    return allParams || [];
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching categories");
  }
};

const Page = async ({
  params,
}: {
  params: {
    subcategory: string;
    lang: string;
  };
}) => {
  const locale = params.lang;
  const subcategorySlug = params.subcategory;

  const subcategory: any = await getSubCategoryData(subcategorySlug, locale);

  if (!subcategory) {
    notFound();
  }

  //   const typeCorrectedCategory = subcategory as unknown as {
  //     id: string;
  //     title: string;
  //     description: string;
  //     slug: string;
  //     subcategory: Subcategory[];
  //   };

  return (
    <PaddingContainer>
      <div className="mb-10">
        <h1 className="text-4xl font-semibold">{subcategory?.title}</h1>
        {/* <SubcategoryList
          locale={locale}
          subcategory={typeCorrectedCategory.subcategory}
        />
        <CategoryBody body={typeCorrectedCategory?.description} /> */}
      </div>
    </PaddingContainer>
  );
};

export default Page;
