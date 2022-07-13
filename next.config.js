const withPWA = require('next-pwa')
const withImages = require('next-images')
const runtimeCaching = require('next-pwa/cache')
module.exports = withImages(
  withPWA({
    purge: [
      './pages/**/*.tsx',
      './pages/**/*.js',
      './pages/**/*.ts',
      './components/**/*.tsx',
      './components/**/*.js',
      './components/**/*.ts',
    ],
    fileExtensions: [
      'jpg',
      'jpeg',
      'png',
      'svg',
      'gif',
      'ico',
      'webp',
      'jp2',
      'avif',
      'avifs',
    ],
    webpack(config, options) {
      return config
    },
    pwa: {
      dest: 'public',
      skipWaiting: true,
      disable: process.env.NODE_ENV === 'development',
      runtimeCaching,
      dynamicStartUrl: false,
    },
    compress: true,
    reactStrictMode: true,
    target: 'serverless',
    exportPathMap: async function (
      defaultPathMap,
      { dev, dir, outDir, distDir, buildId }
    ) {
      return {
        '/': { page: '/' },
      }
    },

    purge: [
      './pages/**/*.tsx',
      './pages/**/*.js',
      './pages/**/*.ts',
      './components/**/*.tsx',
      './components/**/*.js',
      './components/**/*.ts',
    ],

    pwa: {
      dest: 'public',
      skipWaiting: true,
      disable: process.env.NODE_ENV === 'development',
      runtimeCaching,
      dynamicStartUrl: false,
    },
    reactStrictMode: true,
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
)
