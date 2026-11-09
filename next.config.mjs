/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    return [{ source: "/pricing", destination: "/#pilot", permanent: true }];
  },
};
export default nextConfig;
