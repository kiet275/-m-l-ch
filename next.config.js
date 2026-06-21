/** @type {import('next').NextConfig} */
const nextConfig = {
  // Không dùng static export vì có Server Actions/genkit
  // Thay vào đó sử dụng default SSR
  experimental: {
    optimizePackageImports: ["@radix-ui"],
  },
}

module.exports = nextConfig
