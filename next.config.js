/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['dl.airtable.com'], // Add Airtable domain for profile images
  },
  // Enable static exports for Vercel
  output: 'standalone'
}

module.exports = nextConfig 