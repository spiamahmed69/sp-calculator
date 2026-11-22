// Bangladesh land measurement.
// Standards used: 1 acre = 100 shotangsho; 1 bigha = 33 shotangsho (Dhaka standard —
// regional bigha varies, commonly 33–33.06 shotangsho, and some regions differ);
// 1 katha = 1.65 shotangsho; 1 shotangsho = 435.6 sq ft.
export const LAND_UNITS = {
  শতাংশ: 1, কাঠা: 1.65, বিঘা: 33, একর: 100, 'বর্গফুট': 1 / 435.6, 'বর্গমিটার': 1 / 40.468564224, হেক্টর: 247.105381,
}
export const LAND_NOTE = 'ঢাকা মান অনুযায়ী ১ বিঘা = ৩৩ শতাংশ। বাংলাদেশের বিভিন্ন অঞ্চলে বিঘার মাপ ভিন্ন হতে পারে (সাধারণত ৩৩–৩৩.০৬ শতাংশ); জমি কেনাবেচার আগে স্থানীয় মাপ যাচাই করুন।'

export function convertLand(value, from, to) {
  const v = Number(value)
  if (!Number.isFinite(v) || v < 0) throw new Error('সঠিক সংখ্যা দিন')
  if (LAND_UNITS[from] == null || LAND_UNITS[to] == null) throw new Error('অজানা একক')
  return Math.round((v * LAND_UNITS[from] / LAND_UNITS[to]) * 10000) / 10000
}
export function bhoriToGram(bhori) {
  const v = Number(bhori)
  if (!Number.isFinite(v) || v < 0) throw new Error('সঠিক সংখ্যা দিন')
  return { gram: Math.round(v * 11.664 * 1000) / 1000, tola: v }
}
export function gramToBhori(gram) {
  const v = Number(gram)
  if (!Number.isFinite(v) || v < 0) throw new Error('সঠিক সংখ্যা দিন')
  return Math.round((v / 11.664) * 10000) / 10000
}
export function takaToPoisha(taka) {
  const v = Number(taka)
  if (!Number.isFinite(v) || v < 0) throw new Error('সঠিক সংখ্যা দিন')
  return Math.round(v * 100 * 100) / 100
}
