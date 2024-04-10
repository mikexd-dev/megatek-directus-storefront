import siteConfig from "@/config/site";
import { getDictionary } from "@/lib/getDictionary";
import Link from "next/link";
import SocialLink from "../elements/social-link";
import PaddingContainer from "../layout/padding-container";

const Footer = async ({ locale }: { locale: string }) => {
  const dictionary = await getDictionary(locale);
  return (
    <div className="py-8 mt-10 border-t">
      <PaddingContainer>
        <div>
          <h2 className="text-xl font-bold">{siteConfig.siteName}</h2>
          <p className="max-w-md mt-2 text-sm text-neutral-700">
            {dictionary.footer.description}
          </p>
        </div>
        {/* Social and Currently At */}
        <div className="flex flex-wrap justify-between gap-4 mt-6">
          <div>
            <div className="text-sm font-medium">
              Megatek Enterprises (S) Pte Ltd.
            </div>
            <div className="flex items-center gap-3 mt-2 text-neutral-600">
              <SocialLink
                platform="youtube"
                link={siteConfig.socialLinks.youtube}
              />
            </div>
          </div>
          <div>
            <div className="text-xs text-neutral-400">
              {dictionary.footer.currentlyAtText}
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-md shadow-md text-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              {siteConfig.currentlyAt}
            </div>
          </div>
        </div>
        {/* Bottom Section */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-3 mt-16 border-t">
          <div className="text-sm text-neutral-400">
            {dictionary.footer.rightsText} {new Date().getFullYear()}
          </div>
          {/* <div className="text-sm">
            {dictionary.footer.creatorText}{" "}
            <Link
              className="underline underline-offset-4"
              href="https://twitter.com/makrdev"
            >
              @makrdev
            </Link>
          </div> */}
        </div>
      </PaddingContainer>
    </div>
  );
};

export default Footer;
