import { useEffect } from 'react'
import { SITE_URL } from '../data/calculators.js'

export default function Seo({ title, description, slug, faq }) {
  useEffect(() => {
    const fullTitle = title ? `${title} | SP Calculator` : 'SP Calculator – Online Calculator in Bangla | GPA, CGPA & More'
    document.title = fullTitle
    const setMeta = (attr, name, content) => {
      let el = document.querySelector(`meta[${attr}="${name}"]`)
      if (!el) { el = document.createElement('meta'); el.setAttribute(attr, name); document.head.appendChild(el) }
      el.setAttribute('content', content)
    }
    if (description) setMeta('name', 'description', description)
    setMeta('property', 'og:title', fullTitle)
    if (description) setMeta('property', 'og:description', description)
    let link = document.querySelector('link[rel="canonical"]')
    if (!link) { link = document.createElement('link'); link.setAttribute('rel', 'canonical'); document.head.appendChild(link) }
    link.setAttribute('href', slug ? `${SITE_URL}/${slug}` : SITE_URL + '/')
    // JSON-LD WebPage + BreadcrumbList
    let ld = document.querySelector('#seo-jsonld')
    if (!ld) { ld = document.createElement('script'); ld.id = 'seo-jsonld'; ld.type = 'application/ld+json'; document.head.appendChild(ld) }
    const data = {
      '@context': 'https://schema.org', '@type': 'WebPage',
      name: fullTitle, description: description || '',
      url: slug ? `${SITE_URL}/${slug}` : SITE_URL + '/',
      inLanguage: 'bn',
      breadcrumb: { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'হোম', item: SITE_URL + '/' },
        ...(slug ? [{ '@type': 'ListItem', position: 2, name: title, item: `${SITE_URL}/${slug}` }] : []),
      ] },
    }
    if (faq && faq.length) {
      data.mainEntity = { '@type': 'FAQPage', mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
    }
    ld.textContent = JSON.stringify(data)
  }, [title, description, slug, faq])
  return null
}
