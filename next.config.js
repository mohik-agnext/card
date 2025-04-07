/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['dl.airtable.com'], // Allow images from Airtable
  },
}

module.exports = nextConfig 