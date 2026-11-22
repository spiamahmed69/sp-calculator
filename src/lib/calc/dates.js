// Date & time calculations (Asia/Dhaka context; plain calendar math).
export function parseDate(v) {
  const d = new Date(v)
  if (Number.isNaN(d.getTime())) throw new Error('সঠিক তারিখ দিন')
  return d
}
export function ageCalc(birthStr, asOfStr = new Date().toISOString().slice(0, 10)) {
  const birth = parseDate(birthStr); const asOf = parseDate(asOfStr)
  if (birth > asOf) throw new Error('জন্মতারিখ ভবিষ্যতের হতে পারবে না')
  let years = asOf.getFullYear() - birth.getFullYear()
  let months = asOf.getMonth() - birth.getMonth()
  let days = asOf.getDate() - birth.getDate()
  if (days < 0) { months -= 1; const prev = new Date(asOf.getFullYear(), asOf.getMonth(), 0); days += prev.getDate() }
  if (months < 0) { years -= 1; months += 12 }
  const totalDays = Math.floor((asOf - birth) / 86400000)
  return { years, months, days, totalDays, totalMonths: years * 12 + months, totalWeeks: Math.floor(totalDays / 7) }
}
export function dateDiff(aStr, bStr) {
  const a = parseDate(aStr); const b = parseDate(bStr)
  const days = Math.round(Math.abs(b - a) / 86400000)
  return { days, weeks: Math.floor(days / 7), monthsApprox: Math.round((days / 30.44) * 100) / 100, yearsApprox: Math.round((days / 365.25) * 100) / 100, direction: b >= a ? 'after' : 'before' }
}
export function addDays(dateStr, days) {
  const d = parseDate(dateStr); d.setDate(d.getDate() + Number(days))
  return d.toISOString().slice(0, 10)
}
export function workingDays(startStr, endStr, includeSaturday = false) {
  let a = parseDate(startStr); let b = parseDate(endStr)
  if (a > b) [a, b] = [b, a]
  let count = 0; const cur = new Date(a)
  while (cur <= b) {
    const day = cur.getDay() // 0 Sun, 5 Fri, 6 Sat — Bangladesh weekend: Fri (+Sat if not included)
    if (day !== 5 && (includeSaturday || day !== 6)) count++
    cur.setDate(cur.getDate() + 1)
  }
  return { workingDays: count, totalDays: Math.round((b - a) / 86400000) + 1 }
}
export function timeDiff(h1, m1, h2, m2) {
  const t1 = Number(h1) * 60 + Number(m1); const t2 = Number(h2) * 60 + Number(m2)
  const diff = Math.abs(t2 - t1)
  return { hours: Math.floor(diff / 60), minutes: diff % 60, totalMinutes: diff }
}
