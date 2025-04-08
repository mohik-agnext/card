/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('puppeteer');
    }
    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ['puppeteer-core', 'puppeteer']
  },
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    domains: ['api.dicebear.com'],
  }
};

module.exports = nextConfig; 