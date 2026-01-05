/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    unoptimized: false,
  },
  // Transpile Sanity packages for compatibility
  transpilePackages: ['next-sanity', 'sanity'],
  // Enable experimental features if needed
  experimental: {
    // Add any experimental features here
  },
  webpack: (config, { isServer, webpack }) => {
    // Fix for Sanity Studio compatibility with React 19
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      }
      
      // Provide useEffectEvent polyfill for Sanity Studio
      config.plugins.push(
        new webpack.ProvidePlugin({
          'react': ['react', 'default'],
        })
      )
    }
    
    return config
  },
}

module.exports = nextConfig

