/** @type {import('next').NextConfig} */
  const nextConfig = {
  images: {
    domains: [ "res.cloudinary.com","hebbkx1anhila5yf.public.blob.vercel-storage.com"],
  },
  //experimental: {
   // appDir: true,
 // },
 eslint: {
  // Warning: This allows production builds to successfully complete even if
  // your project has ESLint errors.
  ignoreDuringBuilds: true,
}
};


module.exports = nextConfig;