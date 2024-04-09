import { useState } from "react";
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
const ProductDrawerPage = ({
  setOpenDrawer,
  openDrawer,
  customisedProduct,
  hasVariants,
  variant,
}: any) => {
  return (
    <>
      <Drawer onOpenChange={setOpenDrawer} open={openDrawer}>
        <DrawerContent className="bg-black border-none text-white">
          <div className="mx-auto w-full sm:max-w-md md:max-w-lg lg:max-w-xl">
            <DrawerHeader>
              <DrawerTitle>Are you absolutely sure?</DrawerTitle>
              <DrawerDescription>
                {hasVariants && variant.title}
                {Object.entries(customisedProduct).map(([key, value]: any) => (
                  <div key={key} className="flex justify-between">
                    <span>{key}:</span>
                    <span>{value}</span>
                  </div>
                ))}
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <Button>Submit</Button>
              <DrawerClose>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ProductDrawerPage;
