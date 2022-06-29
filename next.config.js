const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')

module.exports = withPWA({
  purge: [
    './pages/**/*.tsx',
    './pages/**/*.js',
    './pages/**/*.ts',
    './components/**/*.tsx',
    './components/**/*.js',
    './components/**/*.ts',
  ],

  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
  images: {
    domains: ['image.tmdb.org'],
    formats: ['image/avif', 'image/webp'],
  },
  pwa: {
    dest: 'public',
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
    runtimeCaching,
    dynamicStartUrl: false,
  },
  reactStrictMode: true,
})
