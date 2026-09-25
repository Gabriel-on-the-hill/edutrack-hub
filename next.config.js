/**
 * NEXT.JS CONFIGURATION
 * 
 * SECURITY & PERFORMANCE IMPROVEMENTS:
 * ✅ Restricted image domains (security)
 * ✅ SWC minification (performance)
 * ✅ Cache optimization (performance)
 * ✅ Security headers
 * ✅ Powered-by header hidden (security)
 * ✅ Sentry error tracking (monitoring)
 * 
 * EDIT INSTRUCTIONS:
 * - Update image domains to your actual domains
 * - Adjust ISR revalidation times based on your content update frequency
 * - Add your Sentry DSN in environment variables
 */

const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ========================================================================
  // REACT & OPTIMIZATION
  // ========================================================================
  reactStrictMode: true,
  productionBrowserSourceMaps: false,

  // ========================================================================
  // IMAGE OPTIMIZATION - SECURITY: Restrict to trusted domains only
  // ========================================================================
  images: {
    // Production image sources only (replaces the deprecated `domains` option)
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: 'edutrackhub.com' },
      { protocol: 'https', hostname: 'www.edutrackhub.com' },
      { protocol: 'https', hostname: 'cdn.edutrackhub.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],

    // Image optimization
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year cache for optimized images
  },

  // ========================================================================
  // HEADERS - SECURITY & CACHING
  // ========================================================================
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Security headers
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      // Cache static assets
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Don't cache API responses
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
        ],
      },
    ];
  },

  // ========================================================================
  // REDIRECTS - EDIT AS NEEDED
  // ========================================================================
  async redirects() {
    return [
      // EDIT: Add your URL redirects here
      // Example: redirect old URLs to new ones
      // {
      //   source: '/old-page',
      //   destination: '/new-page',
      //   permanent: true, // 301 redirect
      // },
    ];
  },

  // ========================================================================
  // ENVIRONMENT VARIABLES
  // ========================================================================
  env: {
    // EDIT HERE: Add public environment variables
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  },

  // ========================================================================
  // SECURITY: Hide Next.js version
  // ========================================================================
  poweredByHeader: false,

  // ========================================================================
  // COMPRESSION
  // ========================================================================
  compress: true,

};

// ============================================================================
// SENTRY CONFIGURATION
// ============================================================================
const sentryWebpackPluginOptions = {
  // Suppresses source map uploading logs during build
  silent: true,

  // Project identifiers - configure in Sentry dashboard
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Auth token for source map upload
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Disables the Sentry SDK when no DSN is provided
  disableLogger: true,
};

// Wrap with Sentry only if SENTRY_DSN is configured
module.exports = process.env.NEXT_PUBLIC_SENTRY_DSN
  ? withSentryConfig(nextConfig, sentryWebpackPluginOptions)
  : nextConfig;
