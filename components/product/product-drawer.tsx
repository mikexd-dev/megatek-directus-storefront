import { useEffect, useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { CheckCircle2, SparkleIcon } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { useWindowSize } from "@react-hook/window-size";
import { cn } from "@/lib/utils";
const ProductDrawerPage = ({
  setOpenDrawer,
  openDrawer,
  customisedProduct,
  hasVariants,
  variant,
  product,
}: any) => {
  const [width, height] = useWindowSize();
  // Breakpoint checks
  const isXs = width < 640;
  const isSm = width >= 640;
  const isMd = width >= 768;
  const isLg = width >= 1024;
  const isXl = width >= 1280;
  const is2Xl = width >= 1536;

  const [userInput, setUserInput] = useState({
    subject: `Request for Quotation: ${product?.title}`,
    product: product?.title,
  });

  const [loading, setLoading] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);

  const handleInputChange = (key: string, value: any) => {
    setUserInput((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const requestQuotation = async () => {
    const requestBody = {
      ...userInput,
      ...customisedProduct,
    };
    try {
      setLoading(true);
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      const data = await response.json();
      // setLoading(false);

      setTimeout(() => {
        setEmailSuccess(true);
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      {!emailSuccess && (
        <Drawer onOpenChange={setOpenDrawer} open={openDrawer}>
          <DrawerContent className="bg-black border-none text-white">
            <ScrollArea
              className={cn(
                "w-full rounded-md",
                `h-[${height - 400}px] h-[800px]`
              )}
            >
              <div className="mx-auto w-full sm:max-w-md md:max-w-lg lg:max-w-xl">
                <DrawerHeader>
                  <DrawerTitle className="text-xl text-center pb-6 sticky">
                    Review & Request
                  </DrawerTitle>
                  <DrawerDescription>
                    <div className="text-center text-md pb-4">
                      {hasVariants && variant.title}
                    </div>
                    {Object.entries(customisedProduct).map(
                      ([key, value]: any) => (
                        <div
                          key={key}
                          className="flex justify-between items-center"
                        >
                          <span className="text-md pb-2">
                            {key.replace("Select", "")}
                          </span>
                          <span className="text-md text-orange-500 pb-2">
                            {isMd
                              ? value
                              : value.length > 30
                              ? `${value.substring(0, 30)}...`
                              : value}
                          </span>
                        </div>
                      )
                    )}

                    <div className="w-full flex flex-row space-x-2 pt-4 items-center justify-between">
                      <Label htmlFor="quantity" className="font-semibold ">
                        Quantity
                      </Label>
                      <Input
                        type="number"
                        min="1"
                        defaultValue={1}
                        className="bg-black border-gray-500 w-40"
                        placeholder="Quantity"
                        onChange={(e) =>
                          handleInputChange(
                            "quantity",
                            e.currentTarget.value.replace(/\D/g, "")
                          )
                        }
                      />
                    </div>

                    <div className="text-xs text-slate-400 py-10">
                      Shipping: The products will be shipped assembled for
                      deliveries within Singapore. For overseas customers,
                      products will be shipped dis-assembled unless upon
                      request. Products assembly instructions can be found at{" "}
                      <a
                        className="text-orange-100"
                        href="https://megatek.org/help-and-support/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Product Video
                      </a>{" "}
                      section.
                    </div>

                    <div>
                      <div className="space-y-4">
                        <div className="w-full flex flex-row space-x-8 items-center justify-between">
                          <div className="flex flex-col space-y-2 flex-1 items-start">
                            <Label htmlFor="name" className="font-semibold">
                              Name
                            </Label>
                            <Input
                              id="name"
                              type="text"
                              className="bg-black border-gray-500"
                              placeholder="Name"
                              onChange={(e) =>
                                handleInputChange("name", e.currentTarget.value)
                              }
                            />
                          </div>
                          <div className="flex flex-col space-y-2 flex-1 items-start">
                            <Label
                              htmlFor="company"
                              className="font-semibold w-20"
                            >
                              Company
                            </Label>
                            <Input
                              id="company"
                              type="text"
                              className="bg-black border-gray-500"
                              placeholder="Company"
                              onChange={(e) =>
                                handleInputChange(
                                  "company",
                                  e.currentTarget.value
                                )
                              }
                            />
                          </div>
                        </div>
                        <div className="flex flex-row w-full justify-between space-x-8">
                          <div className="flex flex-col space-y-2 flex-1 items-start">
                            <Label htmlFor="email" className="font-semibold">
                              Email
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              className="bg-black border-gray-500"
                              placeholder="Email"
                              title="Please enter a valid email address."
                              onChange={(e) =>
                                handleInputChange(
                                  "email",
                                  e.currentTarget.value
                                )
                              }
                            />
                          </div>
                          <div className="flex flex-col space-y-2 flex-1 items-start">
                            <Label htmlFor="phone" className="font-semibold">
                              Phone Number
                            </Label>
                            <Input
                              id="phone"
                              type="number"
                              className="bg-black border-gray-500"
                              placeholder="Phone Number"
                              pattern="\d*"
                              title="Please enter a valid phone number."
                              onChange={(e) =>
                                handleInputChange(
                                  "phone",
                                  e.currentTarget.value
                                )
                              }
                            />
                          </div>
                        </div>

                        <div className="flex flex-col space-y-2 flex-1 justify-start items-start">
                          <Label
                            htmlFor="company"
                            className="font-semibold w-20"
                          >
                            Message
                          </Label>
                          <Textarea
                            placeholder="Additional Information"
                            className="bg-black border-gray-500"
                            onChange={(e) =>
                              handleInputChange(
                                "message",
                                e.currentTarget.value
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </DrawerDescription>
                </DrawerHeader>
                <DrawerFooter className="pb-10">
                  <Button
                    className="rounded-xl p-4 bg-orange-500 text-mmd text-white hover:bg-transparent hover:border hover:border-orange-500 hover:text-orange-500"
                    onClick={requestQuotation}
                    disabled={loading}
                  >
                    {loading && (
                      <SparkleIcon className="animate-spin h-5 w-5 mr-2 text-white" />
                    )}
                    Request Quotation
                  </Button>
                </DrawerFooter>
              </div>
            </ScrollArea>
          </DrawerContent>
        </Drawer>
      )}
      {emailSuccess && (
        <Drawer onOpenChange={setOpenDrawer} open={openDrawer}>
          <DrawerContent className="bg-black border-none text-white">
            <div className="mx-auto w-full sm:max-w-md md:max-w-lg lg:max-w-xl">
              <DrawerHeader>
                <DrawerTitle className="text-xl text-center pb-10">
                  <div className="flex flex-row items-center justify-center text-md">
                    <CheckCircle2 className="mr-1 w-4 h-4" />
                    <p className="text-sm">Request Submitted Successfully</p>
                  </div>
                </DrawerTitle>
                <DrawerDescription>
                  <div className="text-center text-md pb-4">
                    {hasVariants && variant.title}
                  </div>
                  {Object.entries(customisedProduct).map(
                    ([key, value]: any) => (
                      <div
                        key={key}
                        className="flex justify-between items-center space-y-2"
                      >
                        <span className="text-md">
                          {key.replace("Select", "")}
                        </span>
                        <span className="text-md text-orange-500">{value}</span>
                      </div>
                    )
                  )}

                  <div className="text-md text-slate-400 py-10">
                    {/* @ts-ignore */}A confirmation Email has been sent to{" "}
                    {userInput?.email}, we will get in touch with you upon
                    reviewing your request.
                  </div>
                </DrawerDescription>
              </DrawerHeader>
              <DrawerFooter className="pb-10">
                <Button
                  className="rounded-xl p-4 bg-orange-500 text-md text-white hover:bg-transparent hover:border hover:border-orange-500 hover:text-orange-500"
                  onClick={() => window.open("https://megatek.org", "_blank")}
                  disabled={loading}
                >
                  Back to main website
                </Button>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};

export default ProductDrawerPage;
