"use client";
import { cache, useState } from "react"; // Import useState hook
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import {
  ArrowDown,
  ArrowDownCircle,
  ArrowLeft,
  ArrowRight,
  CheckIcon,
} from "lucide-react";
import HtmlParser from "../ui/html-parser";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProductDrawerPage from "./product-drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import ImageGallery from "../ui/image-gallery";
import {
  useWindowSize,
  useWindowWidth,
  useWindowHeight,
} from "@react-hook/window-size";

interface ProductLayoutProps {
  product: any;
  product_selection: any;
  variant_selection: any;
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

const ProductLayout = ({
  product,
  product_selection,
  variant_selection,
}: ProductLayoutProps) => {
  const [width, height] = useWindowSize();
  // Breakpoint checks
  const isXs = width < 640;
  const isSm = width >= 640;
  const isMd = width >= 768;
  const isLg = width >= 1024;
  const isXl = width >= 1280;
  const is2Xl = width >= 1536;

  // for product tier
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});
  const [productSelections, setProductSelections] = useState(product_selection);

  // for variant tier
  const [variantSelections, setVariantSelections] = useState(variant_selection);
  const [selectedVariantOption, setSelectedVariantOption] = useState<any>({});
  const [hasVariants, setHasVariants] = useState<boolean>(
    product?.hasVariant && product?.variants?.length > 0
  );

  // both
  const [selectedDisplayProduct, setSelectedDisplayProduct] =
    useState<any>(product);
  const [selectedAccordionItem, setAccordionItem] = useState<string>(
    product?.selections[0]?.title
  );
  const [selectedTab, setSelectedTab] = useState("description");

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
            className="flex flex-wrap gap-x-5 gap-y-5"
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
                    } hover:border-orange-500 hover:text-orange-500 font-semibold text-sm w-full`}
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
    console.log(
      variantSelections,
      selectedVariantOption,
      "mala",
      variantSelections[selectedVariantOption?.id]?.length
    );
    if (hasVariants && productTier === 1) {
      console.log("subvariant");
      return (
        // <div>hello</div>
        <Accordion
          type="single"
          collapsible
          value={selectedAccordionItem}
          onValueChange={setAccordionItem}
          className="border-none"
        >
          {/* @ts-ignore */}
          {variantSelections[selectedVariantOption?.id].map(
            (selection: any, index: number) => {
              const singleVariant = selection.selection_id;
              return (
                singleVariant.status === "published" && (
                  <AccordionItem
                    key={index}
                    value={selection.title}
                    className="border-none"
                  >
                    <AccordionTrigger
                      className={`${
                        selectedOptions[singleVariant.title]
                          ? "text-orange-500"
                          : ""
                      } no-underline border-none`}
                    >
                      <div className="flex flex-row items-center justify-between text-xs w-full">
                        <div className="flex items-center no-underline">
                          {selectedOptions[singleVariant.title] ? (
                            <>
                              <CheckIcon className="w-4 h-4 mr-2 text-orange-500" />
                              {singleVariant.title.replace("Select", "")}
                            </>
                          ) : (
                            singleVariant.title
                          )}
                        </div>
                        <div>
                          {selectedOptions[singleVariant.title] && (
                            <Badge
                              variant="outline"
                              className="text-green-600 text-xs"
                            >
                              {selectedOptions[singleVariant.title]}
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
                      {singleVariant["selection_options"].map(
                        (option: any, optionIndex: number) =>
                          option.status === "published" && (
                            <div
                              className={`border-[1.5px] rounded-xl p-2 px-4 shadow-md ${
                                selectedOptions[singleVariant.title] ===
                                option.title
                                  ? "border-orange-500 text-orange-500"
                                  : "border-gray-500 text-black"
                              } hover:border-orange-500 hover:text-orange-500 font-semibold text-xs w-full`}
                              key={optionIndex}
                              onClick={() =>
                                handleSelectOption(
                                  singleVariant.title,
                                  option.title,
                                  index + 1 <
                                    Object.keys(
                                      variantSelections[
                                        selectedVariantOption?.id
                                      ]
                                    ).length
                                    ? variantSelections[
                                        selectedVariantOption?.id
                                      ][index + 1]?.title
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
              );
            }
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
          {productSelections.data.map(
            (selection: any, index: number) =>
              selection?.selection_id?.status === "published" && (
                <AccordionItem
                  key={index}
                  value={selection?.selection_id?.title}
                  className="border-none"
                >
                  <AccordionTrigger
                    className={`${
                      selectedOptions[selection?.selection_id?.title]
                        ? "text-orange-500"
                        : ""
                    } no-underline border-none py-2`}
                  >
                    <div className="flex flex-row items-center justify-between text-sm w-full">
                      <div className="flex items-center">
                        {selectedOptions[selection?.selection_id?.title] ? (
                          <>
                            <CheckIcon className="w-5 h-5 mr-2 text-orange-500" />
                            {selection?.selection_id?.title.replace(
                              "Select",
                              ""
                            )}
                          </>
                        ) : (
                          selection?.selection_id?.title
                        )}
                      </div>
                      <div>
                        {selectedOptions[selection?.selection_id?.title] && (
                          <Badge
                            variant="outline"
                            className="text-green-600 text-xs"
                          >
                            {selectedOptions[selection?.selection_id?.title]
                              .length > 20
                              ? `${selectedOptions[
                                  selection?.selection_id?.title
                                ].substring(0, 20)}...`
                              : selectedOptions[selection?.selection_id?.title]}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent
                    className={cn(
                      "flex flex-wrap gap-x-5 gap-y-4 pt-2",
                      selectedOptions[selection?.selection_id?.title] && "pl-6"
                    )}
                    style={{
                      maxWidth: "calc(100% - 10px)",
                      justifyContent: "flex-start",
                    }}
                  >
                    {selection.selection_id["selection_options"].map(
                      (option: any, optionIndex: number) =>
                        option.status === "published" && (
                          <div
                            className={`border-[1.7px] rounded-xl p-2 px-4  ${
                              selectedOptions[
                                selection?.selection_id?.title
                              ] === option.title
                                ? "border-orange-500 text-orange-500 font-semibold"
                                : "border-gray-500 text-black font-normal"
                            } hover:border-orange-500 hover:text-orange-500 text-sm w-full`}
                            key={optionIndex}
                            onClick={() =>
                              handleSelectOption(
                                selection?.selection_id?.title,
                                option.title,
                                index + 1 < productSelections.data.length
                                  ? productSelections.data[index + 1]?.title
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
      <h2 className="text-center text-xl sm:text-2xl md:text-3xl font-bold">
        {product.title}
      </h2>
      <div className="flex flex-col-reverse md:flex-row gap-x-6">
        <div className="flex-1">
          {isXs && (
            <div className="text-center font-semibold py-6 text-gray-500">
              Product Details{" "}
              <div className="text-center text-gray-500 pt-2">
                <ArrowDownCircle className="mx-auto" />
              </div>
            </div>
          )}

          <ImageGallery images={product.images} />
          <div>
            <Tabs
              defaultValue="description"
              className="w-full"
              onValueChange={setSelectedTab}
            >
              <TabsList
                className={cn(
                  {
                    "mb-10":
                      [
                        selectedDisplayProduct.description,
                        selectedDisplayProduct.features,
                        selectedDisplayProduct.specifications,
                        selectedDisplayProduct.youtube_embed,
                      ].filter(Boolean).length > 3,
                  },
                  "flex flex-wrap justify-between space-x-2"
                )}
              >
                {selectedDisplayProduct.description &&
                  selectedDisplayProduct.description.trim() !== "" && (
                    <TabsTrigger
                      value="description"
                      className={cn(
                        selectedTab === "description" &&
                          "bg-orange-500 text-white",
                        "flex-1 rounded-lg font-semibold text-sm hover:text-black hover:bg-orange-500"
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
                        "flex-1 rounded-lg font-semibold text-sm hover:text-black hover:bg-orange-500"
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
                        "flex-1 rounded-lg font-semibold text-sm hover:text-black hover:bg-orange-500"
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
                        "flex-1 rounded-lg font-semibold text-sm hover:text-black hover:bg-orange-500"
                      )}
                    >
                      Video
                    </TabsTrigger>
                  )}
              </TabsList>
              <TabsContent
                value="description"
                className="border-2 border-orange-500 p-4 rounded-lg text-sm"
              >
                <HtmlParser body={selectedDisplayProduct.description} />
              </TabsContent>
              <TabsContent
                value="features"
                className="border-2 border-orange-500 p-6 rounded-lg text-sm"
              >
                <HtmlParser body={selectedDisplayProduct.features} />
              </TabsContent>
              <TabsContent
                value="specifications"
                className="border-2 border-orange-500 p-6 rounded-lg text-sm"
              >
                <HtmlParser body={selectedDisplayProduct.specifications} />
              </TabsContent>
              <TabsContent
                value="youtube_embed"
                className="border-2 border-orange-500 p-6 rounded-lg text-sm"
              >
                <HtmlParser
                  body={selectedDisplayProduct?.youtube_embed?.replace(
                    'width="500"',
                    isXs
                      ? 'width="300"'
                      : isSm
                      ? 'width="300"'
                      : isMd
                      ? 'width="300"'
                      : isLg
                      ? 'width="200"'
                      : isXl
                      ? 'width="200"'
                      : 'width="200"'
                  )}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="flex-1">
          <div className="text-md font-semibold pt-10 pb-4 text-orange-500">
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
                className="flex-1 rounded-xl p-6 text-sm text-black border-none hover:border-orange-500 hover:text-orange-500"
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
                className="w-full rounded-xl p-4 bg-orange-500 text-sm text-white hover:bg-transparent hover:border hover:border-orange-500 hover:text-orange-500"
                //@ts-ignore
                onClick={() =>
                  //@ts-ignore
                  incrementProductTier(selectedVariantOption?.title)
                }
              >
                Customise the variant
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            ) : (
              <Button
                className="flex-1 rounded-xl p-6 bg-orange-500 text-sm text-white hover:bg-transparent hover:border hover:border-orange-500 hover:text-orange-500"
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
            product={selectedDisplayProduct}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductLayout;
