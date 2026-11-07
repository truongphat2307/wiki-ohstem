import nextra from 'nextra'
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js'

const withNextra = nextra({
  // Use content directory convention for MDX files
  // Files in /content will be served at the root

  // Keep MDX image paths as plain strings instead of webpack static imports.
  // With staticImage enabled, Nextra turns every `![](/images/...)` into a static
  // import, which makes it render through next/image — that needs an image
  // optimization service and duplicates ~485MB of images into
  // .next/static/media. Images are served straight from /public instead.
  staticImage: false,
})

// Files under /public (images, 3D models) are served by Cloudflare Workers
// static assets and get their cache headers from public/_headers. The headers
// below only apply to responses the Worker renders (the docs pages).
// Pages only change on deploy, so Cloudflare's edge may hold them for a day;
// browsers always revalidate.
const EDGE_CACHED_PAGE = 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800'

// The admin UI, its APIs, Keystatic and the middleware guarding them edit files
// on disk, so they only work on a local `npm run dev`. Their route files use the
// `.admin.js` / `.admin.jsx` extension and are only picked up by the dev server;
// production builds (Cloudflare) leave them out entirely.
const BASE_PAGE_EXTENSIONS = ['tsx', 'ts', 'jsx', 'js']
const ADMIN_PAGE_EXTENSIONS = ['admin.jsx', 'admin.js']

export default (phase) => withNextra({
  reactStrictMode: true,
  pageExtensions:
    phase === PHASE_DEVELOPMENT_SERVER
      ? [...BASE_PAGE_EXTENSIONS, ...ADMIN_PAGE_EXTENSIONS]
      : BASE_PAGE_EXTENSIONS,
  outputFileTracingExcludes: {
    '*': ['public/**/*'],
  },
  async headers() {
    return [
      {
        // Docs pages and their RSC payloads. Excludes the API, the admin UI,
        // the CMS and the asset folders handled by public/_headers.
        source: '/((?!api/|admin|keystatic|images/|models/|_next/).*)',
        headers: [{ key: 'Cache-Control', value: EDGE_CACHED_PAGE }],
      },
    ]
  },
  webpack: (config, { dev }) => {
    if (dev) {
      // Avoid noisy filesystem-cache serialization warnings during local development.
      config.cache = { type: 'memory' }
    }

    return config
  },
})
