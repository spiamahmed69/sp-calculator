// Geometry & basic maths.
export const r2 = (n) => Math.round(n * 100) / 100
export const triangleArea = (b, h) => r2((Number(b) * Number(h)) / 2)
export const circleArea = (r) => r2(Math.PI * Number(r) ** 2)
export const circleCircumference = (r) => r2(2 * Math.PI * Number(r))
export const rectangleArea = (l, w) => r2(Number(l) * Number(w))
export const rectanglePerimeter = (l, w) => r2(2 * (Number(l) + Number(w)))
export const squareArea = (s) => r2(Number(s) ** 2)
export const pythagHypotenuse = (a, b) => r2(Math.sqrt(Number(a) ** 2 + Number(b) ** 2))
export const pythagLeg = (hyp, leg) => {
  if (Number(hyp) <= Number(leg)) throw new Error('অতিভুজ বাহুর চেয়ে বড় হতে হবে')
  return r2(Math.sqrt(Number(hyp) ** 2 - Number(leg) ** 2))
}
export function boxVolume(l, w, h) { return r2(Number(l) * Number(w) * Number(h)) }
export function cylinderVolume(r, h) { return r2(Math.PI * Number(r) ** 2 * Number(h)) }
export function sphereVolume(r) { return r2((4 / 3) * Math.PI * Number(r) ** 3) }
export const average = (nums) => {
  const arr = nums.map(Number).filter(Number.isFinite)
  if (!arr.length) throw new Error('কমপক্ষে একটি সংখ্যা দিন')
  return r2(arr.reduce((a, b) => a + b, 0) / arr.length)
}
export function ratioSimplify(a, b) {
  const x = Math.abs(Number(a)); const y = Math.abs(Number(b))
  if (!x || !y) throw new Error('দুটোই ০ এর বেশি হতে হবে')
  const gcd = (p, q) => (q === 0 ? p : gcd(q, p % q))
  const g = gcd(x, y)
  return `${x / g} : ${y / g}`
}
export function fractionCalc(aNum, aDen, bNum, bDen, op) {
  if ([aNum, aDen, bNum, bDen].some((x) => !Number.isFinite(Number(x))) || Number(aDen) === 0 || Number(bDen) === 0) throw new Error('হর ০ হতে পারবে না')
  let n; let d
  if (op === '+') { n = aNum * bDen + bNum * aDen; d = aDen * bDen }
  else if (op === '-') { n = aNum * bDen - bNum * aDen; d = aDen * bDen }
  else if (op === '*') { n = aNum * bNum; d = aDen * bDen }
  else { if (Number(bNum) === 0) throw new Error('শূন্য দিয়ে ভাগ করা যায় না'); n = aNum * bDen; d = aDen * bNum }
  const gcd = (p, q) => (q === 0 ? p : gcd(q, p % q))
  const g = gcd(Math.abs(n), Math.abs(d))
  return { numerator: n / g, denominator: d / g, decimal: r2(n / d) }
}
