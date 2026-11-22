// Unit conversions. Base unit per group; factors are to the base unit.
export const UNIT_GROUPS = {
  length: { label: 'দৈর্ঘ্য', base: 'মিটার', units: { মিটার: 1, কিলোমিটার: 1000, সেন্টিমিটার: 0.01, মিলিমিটার: 0.001, মাইল: 1609.344, গজ: 0.9144, ফুট: 0.3048, ইঞ্চি: 0.0254 } },
  weight: { label: 'ওজন', base: 'কিলোগ্রাম', units: { কিলোগ্রাম: 1, গ্রাম: 0.001, মিলিগ্রাম: 0.000001, টন: 1000, পাউন্ড: 0.45359237, আউন্স: 0.0283495231, মণ: 37.3242, সের: 0.9331 } },
  temperature: { label: 'তাপমাত্রা', base: 'সেলসিয়াস', units: { সেলসিয়াস: 'C', ফারেনহাইট: 'F', কেলভিন: 'K' } },
  area: { label: 'ক্ষেত্রফল', base: 'বর্গমিটার', units: { 'বর্গমিটার': 1, 'বর্গকিলোমিটার': 1e6, 'বর্গফুট': 0.09290304, 'বর্গগজ': 0.83612736, একর: 4046.8564224, হেক্টর: 10000, শতাংশ: 40.468564224, বিঘা: 1337.8037 } },
  volume: { label: 'আয়তন', base: 'লিটার', units: { লিটার: 1, মিলিলিটার: 0.001, 'ঘনমিটার': 1000, গ্যালন: 3.785411784, কাপ: 0.2365882365 } },
  speed: { label: 'গতি', base: 'কিমি/ঘণ্টা', units: { 'কিমি/ঘণ্টা': 1, 'মিটার/সেকেন্ড': 3.6, 'মাইল/ঘণ্টা': 1.609344, নট: 1.852 } },
  time: { label: 'সময়', base: 'সেকেন্ড', units: { সেকেন্ড: 1, মিনিট: 60, ঘণ্টা: 3600, দিন: 86400, সপ্তাহ: 604800 } },
  storage: { label: 'ডিজিটাল স্টোরেজ', base: 'মেগাবাইট', units: { বাইট: 1 / 1048576, কিলোবাইট: 1 / 1024, মেগাবাইট: 1, গিগাবাইট: 1024, টেরাবাইট: 1048576 } },
}
export function convertUnit(group, value, from, to) {
  const g = UNIT_GROUPS[group]
  if (!g) throw new Error('অজানা এককের গ্রুপ')
  const v = Number(value)
  if (!Number.isFinite(v)) throw new Error('সঠিক সংখ্যা দিন')
  if (group === 'temperature') {
    let c
    if (from === 'সেলসিয়াস') c = v
    else if (from === 'ফারেনহাইট') c = (v - 32) * 5 / 9
    else c = v - 273.15
    if (to === 'সেলসিয়াস') return Math.round(c * 100) / 100
    if (to === 'ফারেনহাইট') return Math.round((c * 9 / 5 + 32) * 100) / 100
    return Math.round((c + 273.15) * 100) / 100
  }
  if (g.units[from] == null || g.units[to] == null) throw new Error('অজানা একক')
  return Math.round((v * g.units[from] / g.units[to]) * 1e6) / 1e6
}
