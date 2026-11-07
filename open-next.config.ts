import { defineCloudflareConfig } from '@opennextjs/cloudflare'
import staticAssetsIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache'

// Every docs page is prerendered at build time (dynamicParams = false), and the
// content only changes on deploy. So the prerendered pages are served straight
// from Workers static assets: no R2 bucket, no revalidation.
export default defineCloudflareConfig({
    incrementalCache: staticAssetsIncrementalCache,
    enableCacheInterception: true,
})
