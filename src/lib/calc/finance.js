// Finance: EMI, interest, discount, profit/loss, savings. All rates are user-entered;
// no tax/VAT rate is presented as official anywhere.
export const round2 = (n) => Math.round(n * 100) / 100

export function emi(principal, annualRatePct, months) {
  const P = Number(principal); const r = Number(annualRatePct) / 100 / 12; const n = Number(months)
  if (![P, r, n].every(Number.isFinite) || P <= 0 || n <= 0) throw new Error('আসল ও মেয়াদ সঠিকভাবে দিন')
  if (r === 0) return { emi: round2(P / n), totalPayment: round2(P), totalInterest: 0, principal: P, months: n }
  const e = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
  const total = e * n
  return { emi: round2(e), totalPayment: round2(total), totalInterest: round2(total - P), principal: P, months: n }
}

export function simpleInterest(principal, ratePct, years) {
  const P = Number(principal); const r = Number(ratePct); const t = Number(years)
  if (![P, r, t].every(Number.isFinite) || P < 0 || t < 0) throw new Error('সঠিক সংখ্যা দিন')
  const interest = (P * r * t) / 100
  return { interest: round2(interest), total: round2(P + interest) }
}

export function compoundInterest(principal, ratePct, years, compoundsPerYear = 1) {
  const P = Number(principal); const r = Number(ratePct) / 100; const t = Number(years); const n = Number(compoundsPerYear)
  if (![P, r, t, n].every(Number.isFinite) || P < 0 || t < 0 || n <= 0) throw new Error('সঠিক সংখ্যা দিন')
  const total = P * Math.pow(1 + r / n, n * t)
  return { interest: round2(total - P), total: round2(total) }
}

export function discountCalc(price, discountPct) {
  const p = Number(price); const d = Number(discountPct)
  if (![p, d].every(Number.isFinite) || p < 0 || d < 0 || d > 100) throw new Error('মূল্য ও ছাড় সঠিকভাবে দিন')
  const off = (p * d) / 100
  return { discountAmount: round2(off), finalPrice: round2(p - off) }
}

export function profitLoss(cost, selling) {
  const c = Number(cost); const s = Number(selling)
  if (![c, s].every(Number.isFinite) || c <= 0) throw new Error('ক্রয়মূল্য ০ এর বেশি হতে হবে')
  const diff = s - c
  return { amount: round2(Math.abs(diff)), percent: round2((Math.abs(diff) / c) * 100), isProfit: diff >= 0 }
}

export function vatCalc(amount, ratePct, inclusive = false) {
  const a = Number(amount); const r = Number(ratePct)
  if (![a, r].every(Number.isFinite) || a < 0 || r < 0) throw new Error('সঠিক সংখ্যা দিন')
  if (inclusive) {
    const base = a / (1 + r / 100)
    return { base: round2(base), tax: round2(a - base), total: round2(a) }
  }
  const tax = (a * r) / 100
  return { base: round2(a), tax: round2(tax), total: round2(a + tax) }
}

export function savingsFutureValue(monthly, ratePct, months) {
  const m = Number(monthly); const r = Number(ratePct) / 100 / 12; const n = Number(months)
  if (![m, r, n].every(Number.isFinite) || m < 0 || n <= 0) throw new Error('সঠিক সংখ্যা দিন')
  const fv = r === 0 ? m * n : m * ((Math.pow(1 + r, n) - 1) / r) * (1 + r)
  return { futureValue: round2(fv), totalDeposit: round2(m * n), interest: round2(fv - m * n) }
}
