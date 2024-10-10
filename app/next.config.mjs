/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  env: {
    API_URL: 'http://localhost:8000/api/v1',
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  distDir: 'dist',
  trailingSlash: true,
};

export default nextConfig;
