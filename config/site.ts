export interface SiteConfig {
  siteName: string;
  description: string;
  currentlyAt: string;
  socialLinks: {
    // twitter: string;
    youtube: string;
    // github: string;
    // linkedin: string;
    // instagram: string;
  };
}

const siteConfig: SiteConfig = {
  siteName: "Megatek Configurator",
  description:
    "A minimal and lovely travel blog which shares experiences and citiest around the world!",
  currentlyAt: "Singapore",
  socialLinks: {
    // twitter: "https://twitter.com/makrdev",
    youtube: "https://www.youtube.com/@megatekenterprises7257",
    // github: "https://github.com/batuhanbilginn",
    // linkedin: "https://linkedin.com/in/batuhanbilgin",
    // instagram: "https://instagram.com/batuhanbilginn",
  },
};

export default siteConfig;
