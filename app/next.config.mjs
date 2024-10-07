/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  env: {
    API_URL: 'http://localhost:8000/api/v1',
  },
};

export default nextConfig;
