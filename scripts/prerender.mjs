// Build-time prerendering: renders every public route to static HTML so that
// crawlers and link-preview bots see full page content without running JS.
// Runs AFTER `vite build` (see package.json build script) and reads the built
// shell from dist/index.html as its template — so the favicon, manifest, Google
// site-verification meta tag, WebSite/Organization JSON-LD and all other <head>
// content are preserved, and only the per-route title/meta/canonical/JSON-LD
// are swapped in (mirroring what the Seo component does at runtime).
//
// Per-route render is wrapped in try/catch: a route that fails to prerender
// keeps the plain shell (Vercel's SPA rewrite serves dist/index.html for it)
// and is listed at the end — the build still succeeds.
//
// How to add a route: add it to src/App.jsx routes AND to the route list below
// (static pages: STATIC_SEO; calculator pages are generated from the registry).
// Keep STATIC_SEO in sync with the title/description props passed to <Seo />
// in src/pages/ListPages.jsx and src/pages/Static.jsx.
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { calculators, staticPages, SITE_URL } from '../src/data/calculators.js'

const root = fileURLToPath(new URL('..', import.meta.url))
const dist = join(root, 'dist')
const template = readFileSync(join(dist, 'index.html'), 'utf8')

const HOME_TITLE = 'SP Calculator – Online Calculator in Bangla | GPA, CGPA & More'
const HOME_DESC = 'SP Calculator হলো বাংলা ভাষার All-in-One Online Calculator Platform। এখানে GPA, CGPA, Scientific, Age, EMI, Percentage ও Unit Converterসহ প্রয়োজনীয় হিসাব করুন বিনামূল্যে।'

const STATIC_SEO = {
  '/calculators': {
    title: 'সব ক্যালকুলেটর',
    description: `SP Calculator-এর সব ${calculators.length}টি ক্যালকুলেটর — GPA, CGPA, Scientific, Age, EMI, Percentage, Unit Converter ও আরও অনেক।`,
  },
  '/categories': {
    title: 'ক্যালকুলেটর ক্যাটাগরি',
    description: 'SP Calculator-এর সব ক্যাটাগরি — শিক্ষা, বিশ্ববিদ্যালয়, বিটিইবি, ক্যারিয়ার, বৈজ্ঞানিক, আর্থিক, তারিখ ও সময়, একক রূপান্তর, বাংলাদেশ বিশেষ, স্বাস্থ্য, গণিত ও জ্যামিতি।',
  },
  '/favorites': {
    title: 'প্রিয় ক্যালকুলেটর',
    description: 'আপনার প্রিয় ক্যালকুলেটরগুলো — শুধু আপনার ডিভাইসে সংরক্ষিত।',
  },
  '/history': {
    title: 'সাম্প্রতিক হিসাব',
    description: 'আপনার সাম্প্রতিক হিসাবের ইতিহাস — শুধু আপনার ডিভাইসে সংরক্ষিত।',
  },
  '/about': {
    title: 'আমাদের সম্পর্কে',
    description: 'SP Calculator — বাংলা ভাষার All-in-One অনলাইন ক্যালকুলেটর প্ল্যাটফর্ম সম্পর্কে জানুন।',
  },
  '/privacy': {
    title: 'গোপনীয়তা নীতি',
    description: 'SP Calculator-এর গোপনীয়তা নীতি — আপনার তথ্য কীভাবে ব্যবহৃত হয়।',
  },
  '/terms': {
    title: 'শর্তাবলি',
    description: 'SP Calculator ব্যবহারের শর্তাবলি।',
  },
  '/contact': {
    title: 'যোগাযোগ',
    description: 'SP Calculator-এর সঙ্গে যোগাযোগ করুন — মতামত, ভুলের তথ্য বা নতুন ক্যালকুলেটরের অনুরোধ পাঠান।',
  },
}

const routes = [
  { path: '/', title: HOME_TITLE, description: HOME_DESC, faq: null },
  ...staticPages.map((p) => ({ path: p.path, ...STATIC_SEO[p.path], faq: null })),
  ...calculators.map((c) => ({
    path: `/${c.slug}`,
    title: c.titleBn,
    description: c.descriptionBn,
    faq: c.faq || null,
  })),
]

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

// Replace one <meta ... content="..."> tag's content, matched by attribute.
function setMeta(head, attr, name, content) {
  const re = new RegExp(`(<meta ${attr}="${name}" content=")[^"]*(")`)
  if (re.test(head)) return head.replace(re, `$1${esc(content)}$2`)
  return head.replace('</head>', `    <meta ${attr}="${name}" content="${esc(content)}" />\n  </head>`)
}

function buildHead(route) {
  const url = route.path === '/' ? `${SITE_URL}/` : `${SITE_URL}${route.path}`
  const fullTitle = route.path === '/' ? route.title : `${route.title} | SP Calculator`
  let head = template.slice(0, template.indexOf('</head>'))
  head = head.replace(/<title>[^<]*<\/title>/, `<title>${esc(fullTitle)}</title>`)
  head = setMeta(head, 'name', 'description', route.description)
  head = setMeta(head, 'property', 'og:title', fullTitle)
  head = setMeta(head, 'property', 'og:description', route.description)
  head = setMeta(head, 'property', 'og:url', url)
  head = setMeta(head, 'name', 'twitter:title', fullTitle)
  head = setMeta(head, 'name', 'twitter:description', route.description)
  head = head.replace(
    /(<link rel="canonical" href=")[^"]*(")/,
    `$1${url}$2`,
  )
  // Per-route JSON-LD (WebPage + BreadcrumbList, FAQPage when the page has a
  // visible FAQ) — same shape the Seo component writes at runtime.
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: fullTitle,
    description: route.description || '',
    url,
    inLanguage: 'bn',
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'হোম', item: `${SITE_URL}/` },
        ...(route.path === '/'
          ? []
          : [{ '@type': 'ListItem', position: 2, name: route.title, item: url }]),
      ],
    },
  }
  if (route.faq && route.faq.length) {
    data.mainEntity = {
      '@type': 'FAQPage',
      mainEntity: route.faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    }
  }
  head += `    <script id="seo-jsonld" type="application/ld+json">${JSON.stringify(data)}</script>\n  `
  return head
}

function buildPage(route, html) {
  const head = buildHead(route)
  const body = template.slice(template.indexOf('</head>'))
  return head + body.replace('<div id="root"></div>', `<div id="root">${html}</div>`)
}

// The SSR bundle is built by `vite build --ssr` into dist-server/.
// If it cannot even be imported (e.g. a dependency touches window at module
// scope), prerendering is skipped entirely and the plain shell stays live.
let render
try {
  const serverDir = join(root, 'dist-server')
  const entry = readdirSync(serverDir).find((f) => f.startsWith('entry-server.') && f.endsWith('.js'))
  if (!entry) throw new Error(`no entry-server bundle in ${serverDir}`)
  ;({ render } = await import(join(serverDir, entry)))
} catch (err) {
  console.error(`prerender: SSR bundle unavailable (${err.message}) — keeping the client shell for all routes`)
  process.exit(0)
}

let ok = 0
const failed = []
for (const route of routes) {
  try {
    const html = render(route.path)
    if (!html || html.length < 1000) throw new Error(`rendered HTML suspiciously short (${html?.length ?? 0} chars)`)
    const out = route.path === '/' ? join(dist, 'index.html') : join(dist, route.path, 'index.html')
    mkdirSync(dirname(out), { recursive: true })
    writeFileSync(out, buildPage(route, html))
    ok++
  } catch (err) {
    failed.push(route.path)
    console.error(`prerender FAIL ${route.path}: ${err.message}`)
  }
}
console.log(`prerender: ${ok}/${routes.length} routes prerendered`)
if (failed.length) console.log(`prerender: fell back to shell for: ${failed.join(', ')}`)
