export function loadJSON(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback } catch { return fallback }
}
export function saveJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* storage unavailable */ }
}
export const FAV_KEY = 'spcalc:favorites'
export const HIST_KEY = 'spcalc:history'
export const THEME_KEY = 'spcalc:theme'
export function getFavorites() { return loadJSON(FAV_KEY, []) }
export function toggleFavorite(slug) {
  const f = getFavorites()
  const next = f.includes(slug) ? f.filter((s) => s !== slug) : [...f, slug]
  saveJSON(FAV_KEY, next); return next
}
export function addHistory(entry) {
  const h = loadJSON(HIST_KEY, [])
  const next = [{ ...entry, at: new Date().toISOString() }, ...h.filter((x) => x.slug !== entry.slug || x.summary !== entry.summary)].slice(0, 10)
  saveJSON(HIST_KEY, next); return next
}
export function getHistory() { return loadJSON(HIST_KEY, []) }
export function clearHistory() { saveJSON(HIST_KEY, []) }
export function fmtNum(n) {
  if (n == null || n === '') return '—'
  return Number(n).toLocaleString('en-US', { maximumFractionDigits: 2 })
}
export function bnDigits(s) {
  return String(s).replace(/[0-9]/g, (d) => '০১২৩৪৫৬৭৮৯'[Number(d)])
}
