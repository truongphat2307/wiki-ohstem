import fs from 'fs'
import path from 'path'

/**
 * Turns one raw .md/.mdx file into the { path, title, content } record the AI
 * search works on. Pure string work, so the build script and the dev-time
 * filesystem reader produce exactly the same records.
 */
export function parseWikiPage(raw, relativePath) {
    const fileName = path.basename(relativePath)

    // Extract title from frontmatter or first heading
    let title = fileName.replace(/\.(mdx?|MDX?)$/, '')
    const frontmatterMatch = raw.match(/^---\s*\n[\s\S]*?title:\s*(.+)\n[\s\S]*?---/)
    if (frontmatterMatch) {
        title = frontmatterMatch[1].trim().replace(/^['"]|['"]$/g, '')
    } else {
        const headingMatch = raw.match(/^#\s+(.+)/m)
        if (headingMatch) title = headingMatch[1].trim()
    }

    // Clean content: remove frontmatter, import statements, JSX components
    const content = raw
        .replace(/^---\s*\n[\s\S]*?---\s*\n/, '') // Remove frontmatter
        .replace(/^import\s+.*$/gm, '') // Remove imports
        .replace(/<[A-Z][^>]*>[\s\S]*?<\/[A-Z][^>]*>/g, '') // Remove JSX blocks
        .replace(/<[A-Z][^/>]*\/>/g, '') // Remove self-closing JSX
        .trim()

    // Convert file path to wiki URL
    const urlPath =
        '/' +
        relativePath
            .replace(/\\/g, '/')
            .replace(/\.(mdx?|MDX?)$/, '')
            .replace(/\/index$/, '')

    return { path: urlPath, title, content }
}

/**
 * Recursively reads every .md/.mdx page (skipping _meta and other _ files)
 * under contentDir.
 */
export function readWikiPagesFromDisk(contentDir) {
    const files = []

    function walkDir(dir, basePath = '') {
        if (!fs.existsSync(dir)) return

        const entries = fs.readdirSync(dir, { withFileTypes: true })

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name)
            const relativePath = path.join(basePath, entry.name)

            if (entry.isDirectory()) {
                walkDir(fullPath, relativePath)
            } else if (/\.(mdx?|MDX?)$/.test(entry.name)) {
                if (entry.name.startsWith('_')) continue
                const raw = fs.readFileSync(fullPath, 'utf-8')
                files.push(parseWikiPage(raw, relativePath))
            }
        }
    }

    walkDir(contentDir)
    return files
}
