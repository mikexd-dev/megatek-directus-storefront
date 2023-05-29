import CTACard from "@/components/elements/cta-card";
import SocialLink from "@/components/elements/social-link";
import PaddingContainer from "@/components/layout/padding-container";
import PostBody from "@/components/post/post-body";
import PostHero from "@/components/post/post-hero";
import directus from "@/lib/directus";
import { notFound } from "next/navigation";
import { cache } from "react";

// Get Post Data
const getPostData = cache(async (postSlug: string, locale: string) => {
  try {
    const post = await directus.items("post").readByQuery({
      filter: {
        slug: {
          _eq: postSlug,
        },
      },
      fields: [
        "*",
        "category.id",
        "category.title",
        "auhtor.id",
        "author.first_name",
        "author.last_name",
        "translations.*",
        "category.translations.*",
      ],
    });

    const postData = post?.data?.[0];

    if (locale === "en") {
      return postData;
    } else {
      const localisedPostData = {
        ...postData,
        title: postData?.translations?.[0]?.title,
        description: postData?.translations?.[0]?.description,
        body: postData?.translations?.[0]?.body,
        category: {
          ...postData?.category,
          title: postData?.category?.translations?.[0]?.title,
        },
      };

      return localisedPostData;
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching post");
  }
});

// Generate Metadata Function
export const generateMetadata = async ({
  params: { slug, lang },
}: {
  params: {
    slug: string;
    lang: string;
  };
}) => {
  // Get Post Data from Directus
  const post = await getPostData(slug, lang);

  return {
    title: post?.title,
    description: post?.description,
  };
};

// Generate Static Params Function
export const generateStaticParams = async () => {
  /* return DUMMY_POSTS.map((post) => {
    return {
      slug: post.slug,
    };
  }); */
  try {
    const posts = await directus.items("post").readByQuery({
      filter: {
        status: {
          _eq: "published",
        },
      },
      fields: ["slug"],
    });

    const params = posts?.data?.map((post) => {
      return {
        slug: post.slug as string,
        lang: "en",
      };
    });

    const localisedParams = posts?.data?.map((post) => {
      return {
        slug: post.slug as string,
        lang: "de",
      };
    });

    // Concat Localised and Regular Params
    const allParams = params?.concat(localisedParams ?? []);

    return allParams || [];
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching posts");
  }
};

const Page = async ({
  params,
}: {
  params: {
    slug: string;
    lang: string;
  };
}) => {
  /*   const post = DUMMY_POSTS.find((post) => post.slug === params.slug); */

  const locale = params.lang;
  const postSlug = params.slug;

  const post = await getPostData(postSlug, locale);

  if (!post) {
    notFound();
  }

  return (
    <PaddingContainer>
      {/* Container */}
      <div className="space-y-10">
        {/* Post Hero */}
        <PostHero locale={locale} post={post} />
        {/* Post Body and Social Share */}
        <div className="flex flex-col gap-10 md:flex-row">
          <div className="relative">
            <div className="sticky flex items-center gap-5 md:flex-col top-20">
              <div className="font-medium md:hidden">Share this content:</div>
              <SocialLink
                isShareURL
                platform="facebook"
                link={`https://www.facebook.com/sharer/sharer.php?u=${`${process.env.NEXT_PUBLIC_SITE_URL}/post/${post.slug}`}`}
              />
              <SocialLink
                isShareURL
                platform="twitter"
                link={`https://twitter.com/intent/tweet?url=${`${process.env.NEXT_PUBLIC_SITE_URL}/post/${post.slug}`}`}
              />
              <SocialLink
                isShareURL
                platform="linkedin"
                link={`https://www.linkedin.com/shareArticle?mini=true&url=${`${process.env.NEXT_PUBLIC_SITE_URL}/post/${post.slug}`}`}
              />
            </div>
          </div>
          <PostBody body={post.body} />
        </div>
        {/* CTA Card */}
        {/* @ts-expect-error Async Server Component */}
        <CTACard locale={locale} />
      </div>
    </PaddingContainer>
  );
};

export default Page;
