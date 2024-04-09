"use client";
import { cache, useState } from "react"; // Import useState hook
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import { ArrowLeft, CheckIcon } from "lucide-react";
import HtmlParser from "../ui/html-parser";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProductDrawerPage from "./product-drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import ImageGallery from "../ui/image-gallery";

interface ProductLayoutProps {
  product: any;
}

interface SelectionOption {
  title: string;
  status: string;
}

interface Selection {
  title: string;
  status: string;
  selection_options: SelectionOption[];
}

type SelectedOptions = Record<string, string>;

const ProductLayout = ({ product }: ProductLayoutProps) => {
  // for product tier
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});

  // for variant tier
  const [selectedVariantOption, setSelectedVariantOption] = useState<any>({});

  const [selectedDisplayProduct, setSelectedDisplayProduct] =
    useState<any>(product);

  const [selectedAccordionItem, setAccordionItem] = useState<string>(
    product?.selections[0]?.title
  );

  const [selectedTab, setSelectedTab] = useState("description");

  const [hasVariants, setHasVariants] = useState<boolean>(
    product?.variants?.length > 0
  );

  // variant => Tier 0
  // product => Tier 1
  const [productTier, setProductTier] = useState(
    product?.variants?.length > 0 ? 0 : 1
  );

  const [openDrawer, setOpenDrawer] = useState(false);

  // Handler to update the selected options
  const handleSelectOption = (
    selectionTitle: string,
    optionTitle: string,
    nextSelectionTitle: string
  ) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [selectionTitle]: optionTitle,
    }));

    console.log(nextSelectionTitle, "title");
    if (nextSelectionTitle !== "-1") setAccordionItem(nextSelectionTitle);

    console.log(selectedOptions, "selectedOptions");
  };

  const handleVariantSelectOption = (
    selectionTitle: string,
    option: any,
    nextSelectionTitle: string
  ) => {
    setSelectedVariantOption(option);
    setSelectedDisplayProduct(option);

    if (nextSelectionTitle !== "-1") setAccordionItem(nextSelectionTitle);
  };

  const incrementProductTier = async (variantTitle: string) => {
    // await getVariantData(variantId, "en-US");
    setAccordionItem(variantTitle);
    setProductTier(1);
  };

  const decrementProductTier = async (variantTitle: string) => {
    // await getVariantData(variantId, "en-US");
    setAccordionItem("");
    setProductTier(0);
  };

  const reviewAndRequest = () => {
    const allSelectionsMade = product.selections.every(
      (selection: Selection) => selectedOptions[selection.title]
    );

    if (allSelectionsMade) {
      console.log("All selections made:", selectedOptions);
      setOpenDrawer(true);
    } else {
      console.log("Not all selections are made.");
    }
  };

  const renderVariantTier = () => {
    if (hasVariants && productTier === 0) {
      return (
        <Accordion
          type="single"
          collapsible
          value={selectedAccordionItem}
          onValueChange={setAccordionItem}
          className="border-none"
        >
          <div
            className="flex flex-wrap gap-x-5 gap-y-5 text-lg"
            style={{
              maxWidth: "calc(100% - 10px)",
              justifyContent: "flex-start",
            }}
          >
            {product.variants.map(
              (selection: any, index: number) =>
                selection.status === "published" && (
                  <div
                    className={`border-2 rounded-xl p-2 px-4 shadow-md ${
                      selectedVariantOption["title"] === selection.title
                        ? "border-orange-500 text-orange-500"
                        : "border-gray-500 text-black"
                    } hover:border-orange-500 hover:text-orange-500 font-semibold`}
                    key={index}
                    onClick={() =>
                      handleVariantSelectOption(
                        product.title,
                        selection,
                        index + 1 < product.variants.length
                          ? product.variants[index + 1]?.title
                          : "-1"
                      )
                    }
                    style={{ cursor: "pointer" }}
                  >
                    {selection.title}
                  </div>
                )
            )}
          </div>
        </Accordion>
      );
    }
    return null;
  };

  const renderSubVariantTier = () => {
    if (hasVariants && productTier === 1) {
      return (
        <Accordion
          type="single"
          collapsible
          value={selectedAccordionItem}
          onValueChange={setAccordionItem}
          className="border-none"
        >
          {/* @ts-ignore */}
          {selectedVariantOption?.selections.map(
            (selection: any, index: number) =>
              selection.status === "published" && (
                <AccordionItem
                  key={index}
                  value={selection.title}
                  className="border-none"
                >
                  <AccordionTrigger
                    className={`${
                      selectedOptions[selection.title] ? "text-orange-500" : ""
                    } no-underline border-none`}
                  >
                    <div className="flex flex-row items-center justify-between text-xl w-full">
                      <div className="flex items-center no-underline">
                        {selectedOptions[selection.title] ? (
                          <>
                            <CheckIcon className="w-5 h-5 mr-2 text-orange-500" />
                            {selection.title}
                          </>
                        ) : (
                          selection.title
                        )}
                      </div>
                      <div>
                        {selectedOptions[selection.title] && (
                          <Badge
                            variant="outline"
                            className="text-green-600 text-sm"
                          >
                            {selectedOptions[selection.title]}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent
                    className="flex flex-wrap gap-x-5 gap-y-5 text-lg"
                    style={{
                      maxWidth: "calc(100% - 10px)",
                      justifyContent: "flex-start",
                    }}
                  >
                    {selection["selection_options"].map(
                      (option: any, optionIndex: number) =>
                        option.status === "published" && (
                          <div
                            className={`border-2 rounded-xl p-2 px-4 shadow-md ${
                              selectedOptions[selection.title] === option.title
                                ? "border-orange-500 text-orange-500"
                                : "border-gray-500 text-black"
                            } hover:border-orange-500 hover:text-orange-500 font-semibold`}
                            key={optionIndex}
                            onClick={() =>
                              handleSelectOption(
                                selection.title,
                                option.title,
                                index + 1 < product.selections.length
                                  ? product.selections[index + 1]?.title
                                  : "-1"
                              )
                            }
                            style={{ cursor: "pointer" }}
                          >
                            {option.title}
                          </div>
                        )
                    )}
                  </AccordionContent>
                </AccordionItem>
              )
          )}
        </Accordion>
      );
    }
  };

  const renderProductTier = () => {
    if (!hasVariants && productTier === 1) {
      return (
        <Accordion
          type="single"
          collapsible
          value={selectedAccordionItem}
          onValueChange={setAccordionItem}
          className="border-none"
        >
          {product.selections.map(
            (selection: any, index: number) =>
              selection.status === "published" && (
                <AccordionItem
                  key={index}
                  value={selection.title}
                  className="border-none"
                >
                  <AccordionTrigger
                    className={`${
                      selectedOptions[selection.title] ? "text-orange-500" : ""
                    } no-underline border-none`}
                  >
                    <div className="flex flex-row items-center justify-between text-xl w-full">
                      <div className="flex items-center">
                        {selectedOptions[selection.title] ? (
                          <>
                            <CheckIcon className="w-5 h-5 mr-2 text-orange-500" />
                            {selection.title}
                          </>
                        ) : (
                          selection.title
                        )}
                      </div>
                      <div>
                        {selectedOptions[selection.title] && (
                          <Badge
                            variant="outline"
                            className="text-green-600 text-sm"
                          >
                            {selectedOptions[selection.title]}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent
                    className="flex flex-wrap gap-x-5 gap-y-5 text-lg"
                    style={{
                      maxWidth: "calc(100% - 10px)",
                      justifyContent: "flex-start",
                    }}
                  >
                    {selection["selection_options"].map(
                      (option: any, optionIndex: number) =>
                        option.status === "published" && (
                          <div
                            className={`border-2 rounded-xl p-2 px-4 shadow-md ${
                              selectedOptions[selection.title] === option.title
                                ? "border-orange-500 text-orange-500"
                                : "border-gray-500 text-black"
                            } hover:border-orange-500 hover:text-orange-500 font-semibold`}
                            key={optionIndex}
                            onClick={() =>
                              handleSelectOption(
                                selection.title,
                                option.title,
                                index + 1 < product.selections.length
                                  ? product.selections[index + 1]?.title
                                  : "-1"
                              )
                            }
                            style={{ cursor: "pointer" }}
                          >
                            {option.title}
                          </div>
                        )
                    )}
                  </AccordionContent>
                </AccordionItem>
              )
          )}
        </Accordion>
      );
    }
  };

  console.log(product, "product");
  console.log(product?.variants[0], "helo");
  return (
    <div className="space-y-2">
      <h2 className="text-center text-3xl font-bold">{product.title}</h2>
      <div className="flex flex-col md:flex-row gap-x-6">
        <div className="flex-1">
          <ImageGallery images={product.images} />
          {/* <Image
            priority
            className="rounded-md object-cover object-center"
            src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${product.image}?key=optimised`}
            width={450} // Adjusted width for 4:3 aspect ratio
            height={300} // Adjusted height for 4:3 aspect ratio
            alt={product.title}
          /> */}
          <div>
            <Tabs
              defaultValue="description"
              className="w-[550px]"
              onValueChange={setSelectedTab}
            >
              <TabsList className="space-x-2">
                {selectedDisplayProduct.description &&
                  selectedDisplayProduct.description.trim() !== "" && (
                    <TabsTrigger
                      value="description"
                      className={cn(
                        selectedTab === "description" &&
                          "bg-orange-500 text-white",
                        "rounded-lg font-semibold text-md hover:text-black hover:bg-orange-500"
                      )}
                    >
                      Description
                    </TabsTrigger>
                  )}
                {selectedDisplayProduct.features &&
                  selectedDisplayProduct.features.trim() !== "" && (
                    <TabsTrigger
                      value="features"
                      className={cn(
                        selectedTab === "features" &&
                          "bg-orange-500 text-white",
                        "rounded-lg font-semibold text-md hover:text-black hover:bg-orange-500"
                      )}
                    >
                      Features
                    </TabsTrigger>
                  )}
                {selectedDisplayProduct.specifications &&
                  selectedDisplayProduct.specifications.trim() !== "" && (
                    <TabsTrigger
                      value="specifications"
                      className={cn(
                        selectedTab === "specifications" &&
                          "bg-orange-500 text-white",
                        "rounded-lg font-semibold text-md hover:text-black hover:bg-orange-500"
                      )}
                    >
                      Specifications
                    </TabsTrigger>
                  )}
                {selectedDisplayProduct?.youtube_embed &&
                  selectedDisplayProduct?.youtube_embed.trim() !== "" && (
                    <TabsTrigger
                      value="youtube_embed"
                      className={cn(
                        selectedTab === "youtube_embed" &&
                          "bg-orange-500 text-white",
                        "rounded-lg font-semibold text-md hover:text-black hover:bg-orange-500"
                      )}
                    >
                      Video
                    </TabsTrigger>
                  )}
              </TabsList>
              <TabsContent
                value="description"
                className="border-2 border-orange-500 p-6 rounded-lg"
              >
                <HtmlParser body={selectedDisplayProduct.description} />
              </TabsContent>
              <TabsContent
                value="features"
                className="border-2 border-orange-500 p-6 rounded-lg"
              >
                <HtmlParser body={selectedDisplayProduct.features} />
              </TabsContent>
              <TabsContent
                value="specifications"
                className="border-2 border-orange-500 p-6 rounded-lg"
              >
                <HtmlParser body={selectedDisplayProduct.specifications} />
              </TabsContent>
              <TabsContent
                value="youtube_embed"
                className="border-2 border-orange-500 p-6 rounded-lg"
              >
                <HtmlParser body={selectedDisplayProduct?.youtube_embed} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="flex-1">
          <div className="text-xl font-semibold pt-10 pb-4 text-orange-500">
            {productTier === 0
              ? "Choose your product variant"
              : "Customise your product"}
          </div>
          {renderVariantTier()}
          {renderSubVariantTier()}
          {renderProductTier()}
          <div className="flex justify-between pt-10">
            {hasVariants && productTier === 1 && (
              <Button
                className="rounded-xl p-6 text-xl text-black border-none hover:border-orange-500 hover:text-orange-500"
                variant={"outline"}
                //@ts-ignore
                onClick={() =>
                  //@ts-ignore
                  decrementProductTier(selectedVariantOption?.title)
                }
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
            )}
            {productTier === 0 ? (
              <Button
                className="rounded-xl p-6 bg-orange-500 text-xl text-white hover:bg-transparent hover:border hover:border-orange-500 hover:text-orange-500"
                //@ts-ignore
                onClick={() =>
                  //@ts-ignore
                  incrementProductTier(selectedVariantOption?.title)
                }
              >
                Customise the variant
              </Button>
            ) : (
              <Button
                className="rounded-xl p-6 bg-orange-500 text-xl text-white hover:bg-transparent hover:border hover:border-orange-500 hover:text-orange-500"
                onClick={reviewAndRequest}
              >
                Review & Request
              </Button>
            )}
          </div>
          <ProductDrawerPage
            openDrawer={openDrawer}
            setOpenDrawer={setOpenDrawer}
            customisedProduct={selectedOptions}
            hasVariants={hasVariants}
            variant={selectedVariantOption}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductLayout;
