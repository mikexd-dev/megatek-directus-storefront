import siteConfig from "@/config/site";
import { getDictionary } from "@/lib/getDictionary";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import PaddingContainer from "../layout/padding-container";
import LangSwitcher from "./lang-switcher";

const Navigation = async ({ locale }: { locale: string }) => {
  const dictionary = await getDictionary(locale);
  return (
    <div className="sticky top-0 left-0 right-0 bg-white bg-opacity-50 border-b backdrop-blur-md">
      <PaddingContainer>
        <div className="flex items-center justify-between py-5">
          <a className="text-lg font-bold" href={siteConfig.mainSiteUrl}>
            <Image
              src={`${process.env.NEXT_PUBLIC_ASSETS_URL}/4fcfc410-5d70-4c86-a720-dbb163cdd83d`}
              alt="Megatek Logo"
              width={150}
              height={60}
            />
          </a>

          {/* Category Links */}
          <nav>
            <ul className="flex items-center gap-4 text-neutral-600">
              <li>
                <a
                  className="flex items-center gap-1 text-sm font-medium hover:text-orange-500"
                  href={siteConfig.mainSiteUrl}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to megatek.org
                </a>
              </li>
              {/* <li>
                <LangSwitcher locale={locale} />
              </li> */}
              {/* <li>
                <Link href={`/${locale}/cities`}>
                  {dictionary.navigation.links.cities}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/experiences`}>
                  {dictionary.navigation.links.experience}
                </Link>
              </li> */}
            </ul>
          </nav>
        </div>
      </PaddingContainer>
    </div>
  );
};

export default Navigation;
