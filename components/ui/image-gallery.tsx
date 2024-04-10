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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

const ImageGallery = ({ images }: any) => {
  const [selectedImage, setSelectedImage] = useState(
    images[0] ? images[0] : {}
  );
  return (
    <div className="w-full">
      <Dialog>
        <DialogTrigger className="w-full">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              width: "100%",
            }}
          >
            <Image
              priority
              className="rounded-md object-cover object-center cursor-pointer"
              src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${selectedImage.directus_files_id}?key=optimised`}
              alt={""}
              width={350} // Adjusted width for 4:3 aspect ratio
              height={250} // Adjusted height for 4:3 aspect ratio
              style={{
                objectFit: "cover",
              }}
            />
          </div>
        </DialogTrigger>

        <DialogContent className="bg-white flex justify-center items-center">
          <Image
            priority
            className="rounded-md object-cover object-center cursor-pointer"
            src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${selectedImage.directus_files_id}?key=optimised`}
            alt={""}
            width={500} // Adjusted width for 4:3 aspect ratio
            height={350} // Adjusted height for 4:3 aspect ratio
            style={{
              objectFit: "cover",
            }}
          />
        </DialogContent>
      </Dialog>

      <div className="hidden sm:block">
        <Carousel>
          <CarouselContent className="ml-2 md:-ml-4">
            {images.map((image: any, index: number) => {
              return (
                <CarouselItem
                  key={index}
                  className="pl-1 md:basis-1/2 lg:basis-1/3"
                  onClick={() => setSelectedImage(image)}
                >
                  <Card className="border-none cursor-pointer">
                    <CardContent className="flex aspect-square items-center justify-center p-8">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${image.directus_files_id}?key=optimised`}
                        priority={index <= 2 ? true : false}
                        className="rounded-rounded aspect-square"
                        alt={`Product image ${index + 1}`}
                        width={200}
                        height={150}
                        style={{
                          objectFit: "cover",
                        }}
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
    </div>
  );
};

export default ImageGallery;
