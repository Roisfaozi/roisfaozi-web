import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const ROOT = process.cwd()
const failures = []

function walk(dir, extensions) {
  const results = []
  if (!fs.existsSync(dir)) return results
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...walk(full, extensions))
    } else if (
      !extensions ||
      extensions.some((ext) => entry.name.endsWith(ext))
    ) {
      results.push(full)
    }
  }
  return results
}

function rel(filePath) {
  return path.relative(ROOT, filePath)
}

function isDraftPost(markdown) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return false
  return /^draft:\s*true\s*$/m.test(match[1])
}

// 1. Zero literal em-dash (\u2014) or en-dash (\u2013) across authored files
const dashRegex = /[\u2013\u2014]/g
const dashFiles = [
  ...walk(path.join(ROOT, 'src'), ['.astro', '.ts', '.md', '.css']),
  ...walk(path.join(ROOT, 'public'), ['.txt']),
  ...walk(path.join(ROOT, 'netlify'), ['.ts']),
  ...walk(path.join(ROOT, '.agents/skills/publish-blog-post'), ['.md', '.mjs']),
  ...walk(path.join(ROOT, '.agents/skills/site-quality-gate'), ['.md', '.mjs']),
  path.join(ROOT, 'AGENTS.md'),
  path.join(ROOT, 'CLAUDE.md'),
].filter((p) => fs.existsSync(p))

for (const file of dashFiles) {
  const text = fs.readFileSync(file, 'utf8')
  if (dashRegex.test(text)) {
    failures.push(`Em/en dash detected in ${rel(file)}`)
  }
}

// 2. Contrast & anti-slop guard inside src/
const srcFiles = walk(path.join(ROOT, 'src'), ['.astro', '.ts', '.md', '.css'])
const slopRegex = /\b(?:UI Engineer|Nexus)\b/i
for (const file of srcFiles) {
  const text = fs.readFileSync(file, 'utf8')
  if (text.includes('text-zinc-500')) {
    failures.push(`Low-contrast text-zinc-500 found in ${rel(file)}`)
  }
  const m = text.match(slopRegex)
  if (m) {
    failures.push(`Forbidden placeholder term "${m[0]}" in ${rel(file)}`)
  }
}

// 3. NDA & private codebase firewall on blog content and GEO discovery files
const ndaFiles = [
  ...walk(path.join(ROOT, 'src/content/blog'), ['.md']),
  path.join(ROOT, 'public/llms.txt'),
  path.join(ROOT, 'public/llms-full.txt'),
].filter((p) => fs.existsSync(p))

const ndaPatterns = [
  /\bListAccessibleByUser\b/i,
  /\bCountAccessibleStatusSummary\b/i,
  /\bcountAccessibleByUser\b/i,
  /\bresolveUserScope\b/i,
  /\buserScopeCondition\b/i,
  /\baccessibleDeviceCondition\b/i,
  /\bdeviceListSelectQuery\b/i,
  /\bdeviceSelectQuery\b/i,
  /\bscanDeviceListRows\b/i,
  /\bdevice_specs\b/i,
  /\bdevice_health_snapshots\b/i,
  /\buser_org_bindings\b/i,
  /\/api\/v1\/devices/i,
  /\bstatus-summary\b/i,
  /\brole_id\b/i,
  /\bRoleID\b/,
  /\bhq_id\b/i,
  /\bregion_id\b/i,
  /\bbranch_id\b/i,
  /\bsub_branch_id\b/i,
  /\bkp_id\b/i,
  /\bkanwil(?:_id|s)?\b/i,
  /\bkcu(?:_id|s)?\b/i,
  /\bkcp(?:_id|s)?\b/i,
  /\bbni\b/i,
]

for (const file of ndaFiles) {
  const text = fs.readFileSync(file, 'utf8')
  for (const pat of ndaPatterns) {
    if (pat.test(text)) {
      failures.push(`Private/NDA pattern ${pat} matched in ${rel(file)}`)
    }
  }
}

// 4. Static sitemap.xml conflict check + dynamic dist XML checks
const staleStaticSitemap = path.join(ROOT, 'public/sitemap.xml')
if (fs.existsSync(staleStaticSitemap)) {
  failures.push('Stale public/sitemap.xml exists; remove it so src/pages/sitemap.xml.ts serves /sitemap.xml')
}

const enBlogDir = path.join(ROOT, 'src/content/blog/en')
const idBlogDir = path.join(ROOT, 'src/content/blog/id')
const enSlugs = walk(enBlogDir, ['.md'])
  .filter((f) => !isDraftPost(fs.readFileSync(f, 'utf8')))
  .map((f) => path.basename(f, '.md'))
  .sort()
const idFiles = walk(idBlogDir, ['.md'])
const idSlugs = idFiles
  .filter((f) => !isDraftPost(fs.readFileSync(f, 'utf8')))
  .map((f) => path.basename(f, '.md'))
  .sort()

if (JSON.stringify(enSlugs) !== JSON.stringify(idSlugs)) {
  failures.push(
    `Blog EN/ID slug mismatch: en=[${enSlugs.join(', ')}] vs id=[${idSlugs.join(', ')}]`,
  )
}

const distSitemapPath = path.join(ROOT, 'dist/sitemap.xml')
const distRssPath = path.join(ROOT, 'dist/rss.xml')
if (!fs.existsSync(distSitemapPath)) {
  failures.push('Missing built dist/sitemap.xml')
} else {
  const sitemapXml = fs.readFileSync(distSitemapPath, 'utf8')
  if (!sitemapXml.includes('<urlset') || !sitemapXml.includes('</urlset>')) {
    failures.push('Malformed dist/sitemap.xml (missing <urlset> envelope)')
  }
  for (const requiredLoc of ['https://roisfaozi.com/blog', 'https://roisfaozi.com/id/blog']) {
    if (!sitemapXml.includes(requiredLoc)) {
      failures.push(`Missing ${requiredLoc} in dist/sitemap.xml`)
    }
  }
  for (const slug of enSlugs) {
    if (!sitemapXml.includes(`/blog/${slug}`) || !sitemapXml.includes(`/id/blog/${slug}`)) {
      failures.push(`Missing EN/ID URLs for "${slug}" in dist/sitemap.xml`)
    }
  }
}

if (!fs.existsSync(distRssPath)) {
  failures.push('Missing built dist/rss.xml')
} else {
  const rssXml = fs.readFileSync(distRssPath, 'utf8')
  if (!rssXml.includes('<rss ') || !rssXml.includes('</rss>') || !rssXml.includes('<channel>')) {
    failures.push('Malformed dist/rss.xml')
  }
  for (const slug of enSlugs) {
    if (!rssXml.includes(`/blog/${slug}`)) {
      failures.push(`Missing blog entry "${slug}" in dist/rss.xml`)
    }
  }
}

// 5. Built HTML JSON-LD integrity check
const htmlFiles = walk(path.join(ROOT, 'dist'), ['.html'])
if (htmlFiles.length === 0) {
  failures.push('No built HTML files found under dist/')
}
for (const htmlFile of htmlFiles) {
  const html = fs.readFileSync(htmlFile, 'utf8')
  const matches = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
  if (matches.length !== 1) {
    failures.push(`Expected 1 JSON-LD block in ${rel(htmlFile)}, found ${matches.length}`)
    continue
  }
  try {
    const parsed = JSON.parse(matches[0][1])
    if (!Array.isArray(parsed['@graph']) || parsed['@graph'].length === 0) {
      failures.push(`Empty or missing @graph in JSON-LD of ${rel(htmlFile)}`)
    }
  } catch (err) {
    failures.push(`Invalid JSON-LD in ${rel(htmlFile)}: ${err.message}`)
  }
}

// 6. Indonesian blog metrik.py verification (adhiprib/humanizer-indonesia)
const metrikScript = '/home/user/.agents/skills/humanizer-indonesia/scripts/metrik.py'
if (fs.existsSync(metrikScript)) {
  for (const idFile of idFiles) {
    const raw = fs.readFileSync(idFile, 'utf8')
    if (isDraftPost(raw)) continue
    const parts = raw.split('---')
    const body = parts.length >= 3 ? parts.slice(2).join('---').trim() : raw
    const proseOnly = body
      .replace(/```[\s\S]*?```/g, '')
      .replace(/^---+\s*$/gm, '')
      .replace(/^#{1,6}\s+.*$/gm, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim()

    const res = spawnSync('python3', [metrikScript, '-', '--preset', 'semiformal'], {
      input: proseOnly,
      encoding: 'utf8',
    })
    if (res.status !== 0) {
      failures.push(`metrik.py failed on ${rel(idFile)}: ${res.stderr || res.stdout}`)
      continue
    }
    const periksaLines = res.stdout
      .split('\n')
      .filter((line) => /\bPERIKSA\b/.test(line))
    if (periksaLines.length > 0) {
      failures.push(
        `humanizer-indonesia metrik.py (--preset semiformal) flagged PERIKSA in ${rel(idFile)}:\n${periksaLines.join('\n')}`,
      )
    }
  }
}

if (failures.length > 0) {
  console.error('Site quality gate FAILED:\n- ' + failures.join('\n- '))
  process.exit(1)
}

console.log(
  `Site quality gate PASSED: ${htmlFiles.length} HTML pages, ${enSlugs.length} bilingual blog post(s), XML feeds, JSON-LD, NDA firewall, dashes, and Indonesian metrics verified.`,
)
