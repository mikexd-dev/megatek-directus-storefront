import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { Card, CardContent } from "./card";
import { useState } from "react";

const ImageGallery = ({ images }: any) => {
  console.log(images, "immages");
  const [selectedImage, setSelectedImage] = useState(
    images[0] ? images[0] : {}
  );
  return (
    <div>
      <Image
        priority
        className="rounded-md object-cover object-center"
        src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${selectedImage.directus_files_id}?key=optimised`}
        width={350} // Adjusted width for 4:3 aspect ratio
        height={300} // Adjusted height for 4:3 aspect ratio
        alt={""}
        style={{
          objectFit: "cover",
        }}
      />
      <Carousel>
        <CarouselContent className="ml-2 md:-ml-4">
          {images.map((image: any, index: number) => {
            console.log(
              `${process.env.NEXT_PUBLIC_ASSETS_URL}${image.directus_files_id}?key=optimised`
            );
            return (
              <CarouselItem
                key={index}
                className="pl-1 md:basis-1/2 lg:basis-1/3"
                onClick={() => setSelectedImage(image)}
              >
                <Card className="border-none">
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${image.directus_files_id}?key=optimised`}
                      priority={index <= 2 ? true : false}
                      className="rounded-rounded aspect-square"
                      alt={`Product image ${index + 1}`}
                      width={300}
                      height={300}
                    />
                  </CardContent>
                </Card>
              </CarouselItem>
              // <CarouselItem className="pl-2 md:pl-4" key={index}>

              // </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default ImageGallery;
