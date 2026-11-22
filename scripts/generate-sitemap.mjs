// Generates public/sitemap.xml from the calculator registry (single source of truth).
import { writeFileSync } from 'node:fs'
import { calculators, staticPages } from '../src/data/calculators.js'

const BASE = 'https://sp-calculator-ten.vercel.app'
const urls = [
  { loc: `${BASE}/`, priority: '1.0', changefreq: 'weekly' },
  ...staticPages.map((p) => ({ loc: `${BASE}${p.path}`, priority: '0.7', changefreq: 'monthly' })),
  ...calculators.map((c) => ({ loc: `${BASE}/${c.slug}`, priority: '0.8', changefreq: 'monthly' })),
]
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${u.loc}</loc><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`).join('\n')}\n</urlset>\n`
writeFileSync(new URL('../public/sitemap.xml', import.meta.url), xml)
console.log(`sitemap.xml generated: ${urls.length} URLs`)
