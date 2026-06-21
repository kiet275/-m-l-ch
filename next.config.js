/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'out',
  experimental: {
    optimizePackageImports: ["@radix-ui"],
  },
}

module.exports = nextConfig
