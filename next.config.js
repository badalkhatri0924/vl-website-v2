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
    }
    
    // Replace react imports in sanity modules with our polyfilled version
    // This fixes the useEffectEvent import error in React 19
    // TODO: Remove this polyfill once Sanity releases a version fully compatible with React 19.2+
    // or when React stabilizes the useEffectEvent API export
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /^react$/,
        (resource) => {
          // Only replace for sanity modules to avoid affecting other code
          if (resource.context && resource.context.includes('node_modules/sanity')) {
            const path = require('path')
            const polyfillPath = path.resolve(__dirname, 'lib/polyfills/react-with-useeffectevent.js')
            resource.request = polyfillPath
          }
        }
      )
    )
    
    return config
  },
}

module.exports = nextConfig

