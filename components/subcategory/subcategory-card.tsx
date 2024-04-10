import { Post } from "@/types/collection";
import Image from "next/image";
import Link from "next/link";
import SubcategoryContent from "./subcategory-content";

interface PostProps {
  post: Post;
  layout?: "vertical" | "horizontal";
  reverse?: boolean;
  locale: string;
}

const PostCard = ({
  subcategory,
  layout = "horizontal",
  reverse = false,
  locale,
}: any) => {
  return (
    <>
      {subcategory ? (
        <Link
          className={`@container ${
            layout === "horizontal"
              ? "grid items-center grid-cols-1 md:grid-cols-2 gap-10"
              : "space-y-10"
          } `}
          href={`/${locale}/subcategory/${subcategory.slug}`}
        >
          {/* Post Image */}
          <Image
            className={`rounded-md w-full object-cover object-center h-full max-h-[300px] ${
              reverse ? "md:order-last" : ""
            }`}
            alt={subcategory.title}
            src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${subcategory.image}?key=optimised`}
            width={600}
            height={300}
          />
          <>{subcategory.title}</>
        </Link>
      ) : (
        <></>
      )}
    </>
  );
};

export default PostCard;
