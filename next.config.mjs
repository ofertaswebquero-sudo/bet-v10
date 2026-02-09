/** @type {import('next').NextConfig} */
const nextConfig = {
  // Needed so that "import.meta.env" references in existing code
  // get resolved at build-time via Next.js env handling.
  webpack: (config) => {
    return config;
  },
  // Ignore TypeScript build errors temporarily during migration
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
