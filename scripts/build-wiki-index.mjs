// Snapshots every wiki page into public/_wiki/pages.json so the AI routes can
// search the wiki without a filesystem. Cloudflare Workers have no access to the
// repo's content/ folder at runtime; the snapshot ships as a static asset and
// lib/wiki-context.js loads it through the ASSETS binding.
//
// Runs automatically before `npm run dev` and `npm run build`.
import fs from 'fs'
import path from 'path'
import { readWikiPagesFromDisk } from '../lib/wiki-pages.mjs'

const root = process.cwd()
const pages = readWikiPagesFromDisk(path.join(root, 'content'))
const outFile = path.join(root, 'public', '_wiki', 'pages.json')

fs.mkdirSync(path.dirname(outFile), { recursive: true })
fs.writeFileSync(outFile, JSON.stringify(pages))

console.log(`[build-wiki-index] Wrote ${pages.length} pages to ${path.relative(root, outFile)}`)
