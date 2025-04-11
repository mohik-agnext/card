/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['dl.airtable.com'], // Add Airtable domain for profile images
  },
  // Enable static exports for Vercel
  output: 'standalone',
  // Configure allowed development origins
  experimental: {
    allowedDevOrigins: ['localhost:3000', 'localhost:3001'],
  },
}

module.exports = nextConfig 