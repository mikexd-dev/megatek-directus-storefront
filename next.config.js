/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "images.unsplash.com",
        protocol: "https",
      },
      {
        hostname: "megatek-directus-admin-yuj9u.ondigitalocean.app",
        protocol: "https",
      },
    ],
  },
  /*  experimental: {
    serverActions: true,
  }, */
};

module.exports = nextConfig;
