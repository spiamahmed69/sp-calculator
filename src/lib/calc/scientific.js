// SAFE mathematical expression parser (shunting-yard). NEVER eval() / Function().
// Supports + - * / % ^, parentheses, unary minus, sqrt(), log() (base 10), ln(), sin(), cos(), tan(), pi, e.
const FUNCS = {
  sqrt: (x) => { if (x < 0) throw new Error('ঋণাত্মক সংখ্যার বর্গমূল হয় না'); return Math.sqrt(x) },
  log: (x) => { if (x <= 0) throw new Error('লগের জন্য ধনাত্মক সংখ্যা দিন'); return Math.log10(x) },
  ln: (x) => { if (x <= 0) throw new Error('লগের জন্য ধনাত্মক সংখ্যা দিন'); return Math.log(x) },
  sin: (x) => Math.sin(x), cos: (x) => Math.cos(x), tan: (x) => Math.tan(x),
  abs: (x) => Math.abs(x),
}
const CONSTS = { pi: Math.PI, e: Math.E }

function tokenize(expr) {
  const tokens = []
  let i = 0
  const s = String(expr).replace(/\s+/g, '').replace(/÷/g, '/').replace(/×/g, '*').replace(/√/g, 'sqrt')
  while (i < s.length) {
    const ch = s[i]
    if (/[0-9.]/.test(ch)) {
      let num = ''
      while (i < s.length && /[0-9.]/.test(s[i])) num += s[i++]
      if ((num.match(/\./g) || []).length > 1 || num === '.') throw new Error('অবৈধ সংখ্যা')
      tokens.push({ type: 'num', value: parseFloat(num) })
    } else if (/[a-zA-Z]/.test(ch)) {
      let name = ''
      while (i < s.length && /[a-zA-Z]/.test(s[i])) name += s[i++]
      name = name.toLowerCase()
      if (FUNCS[name]) tokens.push({ type: 'func', value: name })
      else if (CONSTS[name] != null) tokens.push({ type: 'num', value: CONSTS[name] })
      else throw new Error(`অজানা ফাংশন বা ধ্রুবক: ${name}`)
    } else if ('+-*/%^(),'.includes(ch)) {
      tokens.push({ type: 'op', value: ch }); i++
    } else throw new Error(`অবৈধ অক্ষর: ${ch}`)
  }
  return tokens
}

const PREC = { '+': 1, '-': 1, '*': 2, '/': 2, '%': 2, '^': 3 }
const RIGHT = { '^': true }

export function evaluate(expr) {
  const tokens = tokenize(expr)
  if (!tokens.length) throw new Error('খালি এক্সপ্রেশন')
  const out = []; const ops = []
  let prev = null
  for (const t of tokens) {
    if (t.type === 'num') out.push(t)
    else if (t.type === 'func') ops.push(t)
    else if (t.value === '(') ops.push(t)
    else if (t.value === ')') {
      while (ops.length && ops[ops.length - 1].value !== '(') out.push(ops.pop())
      if (!ops.length) throw new Error('বন্ধনী মিলছে না')
      ops.pop()
      if (ops.length && ops[ops.length - 1].type === 'func') out.push(ops.pop())
    } else if (t.value === ',') {
      while (ops.length && ops[ops.length - 1].value !== '(') out.push(ops.pop())
    } else {
      // unary minus: treat as 0 - x
      if (t.value === '-' && (!prev || (prev.type === 'op' && prev.value !== ')'))) out.push({ type: 'num', value: 0 })
      while (ops.length && ops[ops.length - 1].type === 'op' && ops[ops.length - 1].value !== '(' &&
        (PREC[ops[ops.length - 1].value] > PREC[t.value] || (PREC[ops[ops.length - 1].value] === PREC[t.value] && !RIGHT[t.value]))) {
        out.push(ops.pop())
      }
      ops.push(t)
    }
    prev = t
  }
  while (ops.length) {
    const o = ops.pop()
    if (o.value === '(') throw new Error('বন্ধনী মিলছে না')
    out.push(o)
  }
  const stack = []
  for (const t of out) {
    if (t.type === 'num') stack.push(t.value)
    else if (t.type === 'func') {
      if (!stack.length) throw new Error('ফাংশনের আর্গুমেন্ট নেই')
      stack.push(FUNCS[t.value](stack.pop()))
    } else {
      const b = stack.pop(); const a = stack.pop()
      if (a == null || b == null) throw new Error('অসম্পূর্ণ এক্সপ্রেশন')
      if (t.value === '+') stack.push(a + b)
      if (t.value === '-') stack.push(a - b)
      if (t.value === '*') stack.push(a * b)
      if (t.value === '/') { if (b === 0) throw new Error('শূন্য দিয়ে ভাগ করা যায় না'); stack.push(a / b) }
      if (t.value === '%') { if (b === 0) throw new Error('শূন্য দিয়ে ভাগ করা যায় না'); stack.push(a % b) }
      if (t.value === '^') stack.push(Math.pow(a, b))
    }
  }
  if (stack.length !== 1 || !Number.isFinite(stack[0])) throw new Error('হিসাব করা যায়নি')
  return Math.round(stack[0] * 1e10) / 1e10
}

export const percentageOf = (part, total) => {
  if (Number(total) === 0) throw new Error('মোট ০ হতে পারবে না')
  return Math.round((Number(part) / Number(total)) * 10000) / 100
}
export const percentChange = (oldV, newV) => {
  if (Number(oldV) === 0) throw new Error('আগের মান ০ হতে পারবে না')
  return Math.round(((Number(newV) - Number(oldV)) / Math.abs(Number(oldV))) * 10000) / 100
}
export function solveLinear(a, b) {
  if (Number(a) === 0) throw new Error('a = 0 হলে এটি রৈখিক সমীকরণ নয়')
  return { x: Math.round((-Number(b) / Number(a)) * 1e10) / 1e10 }
}
export function solveQuadratic(a, b, c) {
  const A = Number(a); const B = Number(b); const C = Number(c)
  if (A === 0) return { ...solveLinear(B, C), type: 'linear' }
  const d = B * B - 4 * A * C
  if (d < 0) return { type: 'complex', discriminant: Math.round(d * 100) / 100, note: 'বাস্তব সমাধান নেই (বৈষম্যকারী ঋণাত্মক)' }
  const sq = Math.sqrt(d)
  return { type: 'real', discriminant: Math.round(d * 100) / 100, x1: Math.round(((-B + sq) / (2 * A)) * 1e10) / 1e10, x2: Math.round(((-B - sq) / (2 * A)) * 1e10) / 1e10 }
}
export function matrix2x2(op, A, B) {
  if (op === 'det') return { determinant: A[0][0] * A[1][1] - A[0][1] * A[1][0] }
  if (op === 'add') return { result: [[A[0][0] + B[0][0], A[0][1] + B[0][1]], [A[1][0] + B[1][0], A[1][1] + B[1][1]]] }
  if (op === 'multiply') return { result: [[A[0][0] * B[0][0] + A[0][1] * B[1][0], A[0][0] * B[0][1] + A[0][1] * B[1][1]], [A[1][0] * B[0][0] + A[1][1] * B[1][0], A[1][0] * B[0][1] + A[1][1] * B[1][1]]] }
  throw new Error('অজানা ম্যাট্রিক্স অপারেশন')
}
