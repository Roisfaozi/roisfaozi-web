const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')
module.exports = withPWA({
  content: [
    './pages/**/*.tsx',
    './pages/**/*.js',
    './pages/**/*.ts',
    './components/**/*.tsx',
    './components/**/*.js',
    './components/**/*.ts',
  ],

  images: {
    formats: ['image/avif', 'image/webp'],
    unoptimized: true,
  },

  pwa: {
    dest: 'public',
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
    runtimeCaching,
    dynamicStartUrl: false,
  },
  reactStrictMode: true,
  distDir: 'out',
  target: 'serverless',
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    return {
      '/': { page: '/' },
    }
  },
})
