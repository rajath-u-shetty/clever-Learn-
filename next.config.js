/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "https://zgnqetqkxxsiswtrgcgd.supabase.co",
      "images.unsplash.com",
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ["pdf-parse"],
    serverActions: true,
  },
  api: {
    bodyParser: true,
  },
};

module.exports = nextConfig;

