/* eslint-disable @next/next/no-img-element */

import { getReadingTime, getRelativeDate } from "@/lib/helpers";
import { ImageResponse } from "next/server";
import { getProductData } from "./page";
export const size = {
  width: 1200,
  height: 630,
};
export const alt = "Megatek | Products";
export const contentType = "image/png";

export default async function og({
  params: { slug, lang },
}: {
  params: { slug: string; lang: string };
}) {
  // Get Data from CMS
  const product: any = await getProductData(slug, lang);

  return new ImageResponse(
    (
      <div tw="relative flex w-full h-full flex items-center justify-center">
        {/* Background */}
        <div tw="absolute flex inset-0">
          <img
            tw="flex flex-1 object-cover w-full h-full object-center"
            src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${product.images[0]?.directus_files_id}?key=optimised`}
            alt={product?.title!!}
          />
          {/* Overlay */}
          <div tw="absolute flex inset-0 bg-black bg-opacity-50" />
        </div>
        <div tw="flex flex-col text-neutral-50 ">
          {/* Title */}
          <div tw="text-[60px]">{product?.title}</div>
          {/* Description */}
          <div tw="text-2xl max-w-4xl">{product?.description}</div>
          {/* Tags */}
          <div tw="flex mt-6 flex-wrap items-center text-3xl text-neutral-200">
            <div
              tw={`font-medium ${
                product?.subcategory.title === "Cities"
                  ? "text-emerald-600"
                  : "text-indigo-600"
              }`}
            >
              {product?.subcategory.title}
            </div>
            <div tw="w-4 h-4 mx-6 rounded-full bg-neutral-300" />
            <div>{getReadingTime(product?.description!!, lang)}</div>
            <div tw="w-4 h-4 mx-6 rounded-full bg-neutral-300" />
            <div>{getRelativeDate(product?.date_created!!, lang)}</div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
