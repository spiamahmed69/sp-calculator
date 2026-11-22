// SINGLE SOURCE OF TRUTH: every calculator, its fields, formula, FAQ and compute logic.
// Sitemap, navigation, search and all calculator pages are generated FROM this registry.
import { gpaFromMarks, gpaFromPoints, cgpaFromCourses, cgpaToPercentage, percentageToCgpa, targetCgpa, marksToGrade, nuPoint } from '../lib/calc/gpa.js'
import { emi, simpleInterest, compoundInterest, discountCalc, profitLoss, vatCalc, savingsFutureValue } from '../lib/calc/finance.js'
import { percentageOf, percentChange, solveLinear, solveQuadratic } from '../lib/calc/scientific.js'
import { ageCalc, dateDiff, addDays, workingDays, timeDiff } from '../lib/calc/dates.js'
import { convertLand, bhoriToGram, gramToBhori, takaToPoisha, LAND_NOTE } from '../lib/calc/land.js'
import { bmi, bmr, calorieEstimate, waterIntake } from '../lib/calc/health.js'
import { triangleArea, circleArea, circleCircumference, rectangleArea, rectanglePerimeter, squareArea, pythagHypotenuse, pythagLeg, boxVolume, cylinderVolume, sphereVolume, average, ratioSimplify, fractionCalc } from '../lib/calc/geometry.js'
import { evaluate } from '../lib/calc/scientific.js'

export const SITE_URL = 'https://sp-calculator.vercel.app'

export const CATEGORIES = [
  { id: 'education', name: 'শিক্ষা', desc: 'SSC, HSC, JSC, দাখিল, আলিম — GPA ও গ্রেড হিসাব', icon: 'GraduationCap' },
  { id: 'university', name: 'বিশ্ববিদ্যালয়', desc: 'জাতীয় বিশ্ববিদ্যালয়, অনার্স, ডিগ্রি, মাস্টার্স — CGPA হিসাব', icon: 'BookOpen' },
  { id: 'bteb', name: 'বিটিইবি ও ডিপ্লোমা', desc: 'ডিপ্লোমা ইঞ্জিনিয়ারিং ও ভোকেশনাল CGPA', icon: 'Wrench' },
  { id: 'career', name: 'ক্যারিয়ার', desc: 'BCS ও সরকারি চাকরির বয়স যাচাই', icon: 'Briefcase' },
  { id: 'scientific', name: 'বৈজ্ঞানিক', desc: 'সায়েন্টিফিক, শতাংশ, ভগ্নাংশ, সমীকরণ', icon: 'FlaskConical' },
  { id: 'finance', name: 'আর্থিক', desc: 'EMI, ঋণ, সুদ, ডিসকাউন্ট, ভ্যাট, ট্যাক্স', icon: 'Wallet' },
  { id: 'date-time', name: 'তারিখ ও সময়', desc: 'বয়স, তারিখের পার্থক্য, কর্মদিবস, কাউন্টডাউন', icon: 'CalendarDays' },
  { id: 'converters', name: 'একক রূপান্তর', desc: 'দৈর্ঘ্য, ওজন, তাপমাত্রা, আয়তনসহ ৮ ধরনের রূপান্তর', icon: 'ArrowLeftRight' },
  { id: 'bangladesh', name: 'বাংলাদেশ বিশেষ', desc: 'জমির মাপ, ভরি, টাকা-পয়সা', icon: 'MapPin' },
  { id: 'health', name: 'স্বাস্থ্য', desc: 'BMI, BMR, ক্যালরি ও পানির হিসাব (শিক্ষামূলক অনুমান)', icon: 'HeartPulse' },
  { id: 'mathematics', name: 'গণিত ও জ্যামিতি', desc: 'ক্ষেত্রফল, আয়তন, পরিসীমা, পিথাগোরাস', icon: 'Shapes' },
]

export const staticPages = [
  { path: '/calculators', title: 'সব ক্যালকুলেটর' },
  { path: '/categories', title: 'ক্যাটাগরি' },
  { path: '/favorites', title: 'প্রিয় ক্যালকুলেটর' },
  { path: '/history', title: 'সাম্প্রতিক হিসাব' },
  { path: '/about', title: 'আমাদের সম্পর্কে' },
  { path: '/privacy', title: 'গোপনীয়তা নীতি' },
  { path: '/terms', title: 'শর্তাবলি' },
  { path: '/contact', title: 'যোগাযোগ' },
]

// Career eligibility rules — configurable, with effective dates shown on the page.
// Default BCS limit 32 years is labelled "বর্তমান নিয়ম অনুযায়ী" — verify against the
// latest government circular before relying on it for an application.
export const CAREER_RULES = {
  bcs: { name: 'বিসিএস', limit: 32, effective: '২০২৪ সালের সংশোধিত নিয়ম অনুযায়ী', note: 'সাধারণ প্রার্থীদের জন্য সর্বোচ্চ বয়স ৩২ বছর (বর্তমান নিয়ম অনুযায়ী)। মুক্তিযোদ্ধা কোটাসহ বিশেষ ক্ষেত্রে ভিন্ন সীমা প্রযোজ্য হতে পারে — আবেদনের আগে সর্বশেষ সার্কুলার দেখুন।' },
  govt: { name: 'সরকারি চাকরি', limit: 32, effective: '২০২৪ সালের সংশোধিত নিয়ম অনুযায়ী', note: 'সাধারণ সরকারি চাকরিতে সর্বোচ্চ বয়স ৩২ বছর (বর্তমান নিয়ম অনুযায়ী)। বিভাগভেদে সীমা ভিন্ন হতে পারে।' },
  general: { name: 'চাকরির যোগ্যতা', limit: 32, effective: 'বর্তমান নিয়ম অনুযায়ী', note: 'আপনার পদের সার্কুলারে উল্লেখিত বয়সসীমার সঙ্গে মিলিয়ে নিন।' },
}

const N = (key, label, opts = {}) => ({ key, label, type: 'number', ...opts })
const S = (key, label, options, opts = {}) => ({ key, label, type: 'select', options, ...opts })
const D = (key, label, opts = {}) => ({ key, label, type: 'date', ...opts })
const GR = (key, label, mode, opts = {}) => ({ key, label, type: 'gradeRows', mode, ...opts })
const D2 = (label, value) => ({ label, value })
const res = (headline, details, steps, sub) => ({ headline, details, steps, sub })
const faqGpa = [
  { q: 'GPA কীভাবে হিসাব করা হয়?', a: 'প্রতিটি বিষয়ের নম্বর থেকে গ্রেড পয়েন্ট বের করে সব বিষয়ের গড় নেওয়া হয়। কোনো বিষয়ে F থাকলে GPA ০ ধরা হয়।' },
  { q: '৪র্থ (ঐচ্ছিক) বিষয়ের নিয়ম কী?', a: 'ঐচ্ছিক বিষয়ে ২.০ এর বেশি পয়েন্ট পেলে শুধু অতিরিক্ত অংশ যোগ হয়, আর ভাগের সময় ঐচ্ছিক বিষয়টি বাদ যায়। এটি বোর্ডের প্রচলিত নিয়ম।' },
  { q: 'এই ফলাফল কি অফিসিয়াল?', a: 'এটি প্রচলিত বোর্ড গ্রেডিং নিয়ম অনুযায়ী হিসাব। চূড়ান্ত ফলাফলের জন্য বোর্ডের প্রকাশিত ফলাফলই চূড়ান্ত।' },
]
const faqCgpa = [
  { q: 'CGPA কীভাবে হিসাব করা হয়?', a: 'প্রতিটি কোর্সের গ্রেড পয়েন্টকে তার ক্রেডিট দিয়ে গুণ করে যোগফলকে মোট ক্রেডিট দিয়ে ভাগ করা হয়।' },
  { q: 'কোন স্কেল ব্যবহার করা হয়েছে?', a: 'জাতীয় বিশ্ববিদ্যালয়ের প্রচলিত ৪.০ স্কেল (A+ = ৪.০, A = ৩.৭৫, A- = ৩.৫, B+ = ৩.২৫, B = ৩.০)। আপনার বিশ্ববিদ্যালয়ের স্কেল ভিন্ন হলে ফলাফল ভিন্ন হতে পারে।' },
]
const GRADE_FORMULA = 'প্রতি বিষয়ের নম্বর → গ্রেড পয়েন্ট (A+ ৫.০, A ৪.০, A- ৩.৫, B ৩.০, C ২.০, D ১.০, F ০) → GPA = মোট গ্রেড পয়েন্ট ÷ বিষয়ের সংখ্যা। ঐচ্ছিক বিষয়ে ২.০ এর বেশি পয়েন্টের অতিরিক্ত অংশই শুধু যোগ হয়।'
const CGPA_FORMULA = 'CGPA = Σ(গ্রেড পয়েন্ট × ক্রেডিট) ÷ মোট ক্রেডিট। স্কেল: A+ ৪.০, A ৩.৭৫, A- ৩.৫, B+ ৩.২৫, B ৩.০, B- ২.৭৫, C+ ২.৫, C ২.২৫, D ২.০, F ০।'

function gradeRowsCompute(inputs, mode) {
  const rows = inputs.rows || []
  if (!rows.length) throw new Error('কমপক্ষে একটি বিষয় যোগ করুন')
  if (mode === 'marks') {
    const marks = rows.map((r) => Number(r.marks))
    const optIdx = rows.findIndex((r) => r.optional)
    const r = gpaFromMarks(marks, optIdx)
    return res(`GPA ${r.gpa.toFixed(2)} (${r.grade})`, [
      D2('মোট বিষয়', String(rows.length)), D2('মোট গ্রেড পয়েন্ট', String(r.total)),
      D2('গ্রেড', r.grades.join(', ')), D2('ফলাফল', r.failed ? 'অকৃতকার্য (কোনো বিষয়ে F)' : 'কৃতকার্য'),
    ], [`প্রতিটি বিষয়ের নম্বর থেকে গ্রেড পয়েন্ট বের করা হয়েছে`, `মোট গ্রেড পয়েন্ট ${r.total} কে ${r.count} দিয়ে ভাগ করা হয়েছে`, optIdx >= 0 ? 'ঐচ্ছিক বিষয়ের ২.০ এর বেশি অংশই শুধু যোগ হয়েছে' : 'কোনো ঐচ্ছিক বিষয় ছিল না'], r.failed ? 'কোনো বিষয়ে F থাকায় GPA ০' : undefined)
  }
  if (mode === 'points') {
    const pts = rows.map((r) => Number(r.point))
    const optIdx = rows.findIndex((r) => r.optional)
    const r = gpaFromPoints(pts, optIdx)
    return res(`GPA ${r.gpa.toFixed(2)} (${r.grade})`, [D2('মোট বিষয়', String(rows.length)), D2('মোট গ্রেড পয়েন্ট', String(r.total))], [`গ্রেড পয়েন্টগুলোর গড় নেওয়া হয়েছে`])
  }
  // credit mode (CGPA)
  const courses = rows.map((r) => ({ grade: r.grade, credit: Number(r.credit) }))
  const r = cgpaFromCourses(courses)
  return res(`CGPA ${r.cgpa.toFixed(2)}`, [D2('মোট ক্রেডিট', String(r.totalCredits)), D2('ওজনযুক্ত যোগফল', String(r.weighted))], [`প্রতিটি কোর্সের গ্রেড পয়েন্ট × ক্রেডিট যোগ করা হয়েছে`, `যোগফলকে মোট ক্রেডিট ${r.totalCredits} দিয়ে ভাগ করা হয়েছে`])
}

function careerCompute(ruleKey) {
  return (inputs) => {
    const rule = CAREER_RULES[ruleKey]
    const a = ageCalc(inputs.birth, inputs.asOf || new Date().toISOString().slice(0, 10))
    const eligible = a.years < rule.limit || (a.years === rule.limit && a.months === 0 && a.days === 0)
    const remainingYears = rule.limit - a.years
    return res(eligible ? `যোগ্য — বয়স ${a.years} বছর ${a.months} মাস` : `বয়সসীমা অতিক্রম — বয়স ${a.years} বছর ${a.months} মাস`,
      [D2('বর্তমান বয়স', `${a.years} বছর ${a.months} মাস ${a.days} দিন`), D2('বয়সসীমা', `${rule.limit} বছর`), D2('কার্যকর নিয়ম', rule.effective), D2('অবশিষ্ট সময়', eligible ? `${remainingYears} বছর (প্রায়)` : '০')],
      [`জন্মতারিখ থেকে বর্তমান বয়স হিসাব করা হয়েছে`, `${rule.name} এর সর্বোচ্চ বয়সসীমা ${rule.limit} বছরের সঙ্গে তুলনা করা হয়েছে`], rule.note)
  }
}

export const calculators = [
  // ---------- EDUCATION ----------
  ...['SSC', 'HSC', 'JSC', 'দাখিল', 'আলিম'].map((level, i) => ({
    slug: `${['ssc', 'hsc', 'jsc', 'dakhil', 'alim'][i]}-gpa-calculator`,
    titleBn: `${level} GPA ক্যালকুলেটর`,
    titleEn: `${level} GPA Calculator`,
    descriptionBn: `${level} পরীক্ষার প্রতিটি বিষয়ের নম্বর দিয়ে GPA হিসাব করুন। ঐচ্ছিক (৪র্থ) বিষয়ের নিয়মসহ সঠিক গ্রেডিং।`,
    category: 'education', keywords: `${level} GPA, ${level} GPA Calculator, GPA হিসাব, গ্রেড পয়েন্ট`,
    popular: i < 2, kind: 'generic',
    formula: GRADE_FORMULA,
    example: 'বাংলা ৮৫ (A+), ইংরেজি ৭৫ (A), গণিত ৬৫ (A-) হলে GPA = (৫+৪+৩.৫) ÷ ৩ = ৪.১৭',
    faq: faqGpa,
    fields: [GR('rows', 'বিষয়সমূহ (নম্বর দিন)', 'marks')],
    compute: (inp) => gradeRowsCompute(inp, 'marks'),
  })),
  {
    slug: 'ssc-grade-calculator', titleBn: 'SSC গ্রেড ক্যালকুলেটর', titleEn: 'SSC Grade Calculator',
    descriptionBn: 'একটি নম্বর দিলেই তার গ্রেড ও গ্রেড পয়েন্ট জানুন — SSC গ্রেডিং স্কেল অনুযায়ী।',
    category: 'education', keywords: 'SSC Grade, গ্রেড ক্যালকুলেটর, নম্বর থেকে গ্রেড',
    kind: 'generic', formula: '৮০–১০০: A+ (৫.০), ৭০–৭৯: A (৪.০), ৬০–৬৯: A- (৩.৫), ৫০–৫৯: B (৩.০), ৪০–৪৯: C (২.০), ৩৩–৩৯: D (১.০), ০–৩২: F (০)',
    example: '৭২ নম্বর = A গ্রেড, গ্রেড পয়েন্ট ৪.০', faq: faqGpa,
    fields: [N('marks', 'নম্বর (০–১০০)', { min: 0, max: 100, placeholder: 'যেমন: ৭২' })],
    compute: (inp) => { const g = marksToGrade(inp.marks); return res(`গ্রেড ${g.letter} — পয়েন্ট ${g.point.toFixed(1)}`, [D2('নম্বর', String(inp.marks)), D2('গ্রেড', g.letter), D2('গ্রেড পয়েন্ট', g.point.toFixed(1))], [`${inp.marks} নম্বর ${g.min}–${g.max} সীমায় পড়ে, তাই গ্রেড ${g.letter}`]) },
  },
  {
    slug: 'hsc-grade-calculator', titleBn: 'HSC গ্রেড ক্যালকুলেটর', titleEn: 'HSC Grade Calculator',
    descriptionBn: 'HSC নম্বর থেকে গ্রেড ও গ্রেড পয়েন্ট বের করুন।',
    category: 'education', keywords: 'HSC Grade, গ্রেড ক্যালকুলেটর, নম্বর থেকে গ্রেড',
    kind: 'generic', formula: '৮০–১০০: A+ (৫.০), ৭০–৭৯: A (৪.০), ৬০–৬৯: A- (৩.৫), ৫০–৫৯: B (৩.০), ৪০–৪৯: C (২.০), ৩৩–৩৯: D (১.০), ০–৩২: F (০)',
    example: '৮৮ নম্বর = A+ গ্রেড, গ্রেড পয়েন্ট ৫.০', faq: faqGpa,
    fields: [N('marks', 'নম্বর (০–১০০)', { min: 0, max: 100, placeholder: 'যেমন: ৮৮' })],
    compute: (inp) => { const g = marksToGrade(inp.marks); return res(`গ্রেড ${g.letter} — পয়েন্ট ${g.point.toFixed(1)}`, [D2('নম্বর', String(inp.marks)), D2('গ্রেড', g.letter), D2('গ্রেড পয়েন্ট', g.point.toFixed(1))], [`${inp.marks} নম্বর ${g.min}–${g.max} সীমায় পড়ে, তাই গ্রেড ${g.letter}`]) },
  },
  {
    slug: 'vocational-gpa-calculator', titleBn: 'ভোকেশনাল GPA ক্যালকুলেটর', titleEn: 'Vocational GPA Calculator',
    descriptionBn: 'ভোকেশনাল (SSC Vocational) পরীক্ষার GPA হিসাব করুন নম্বর দিয়ে।',
    category: 'education', keywords: 'Vocational GPA, ভোকেশনাল GPA, SSC Vocational',
    kind: 'generic', formula: GRADE_FORMULA, example: '৫টি বিষয়ে গড় গ্রেড পয়েন্ট ৪.০ হলে GPA ৪.০০', faq: faqGpa,
    fields: [GR('rows', 'বিষয়সমূহ (নম্বর দিন)', 'marks')],
    compute: (inp) => gradeRowsCompute(inp, 'marks'),
  },
  {
    slug: 'marks-to-gpa-converter', titleBn: 'নম্বর থেকে GPA কনভার্টার', titleEn: 'Marks to GPA Converter',
    descriptionBn: 'মোট নম্বর ও বিষয়সংখ্যা থেকে গড় GPA বের করুন, অথবা প্রতিটি বিষয়ের নম্বর দিয়ে বিস্তারিত GPA হিসাব করুন।',
    category: 'education', keywords: 'Marks to GPA, নম্বর থেকে GPA, GPA কনভার্টার',
    kind: 'generic', formula: GRADE_FORMULA, example: '৬টি বিষয়ে মোট গ্রেড পয়েন্ট ২৪ হলে GPA = ২৪ ÷ ৬ = ৪.০০', faq: faqGpa,
    fields: [GR('rows', 'বিষয়সমূহ (নম্বর দিন)', 'marks')],
    compute: (inp) => gradeRowsCompute(inp, 'marks'),
  },
  {
    slug: 'grade-to-gpa-converter', titleBn: 'গ্রেড থেকে GPA কনভার্টার', titleEn: 'Grade to GPA Converter',
    descriptionBn: 'প্রতিটি বিষয়ের গ্রেড পয়েন্ট দিয়ে GPA হিসাব করুন — ঐচ্ছিক বিষয়ের নিয়মসহ।',
    category: 'education', keywords: 'Grade to GPA, গ্রেড থেকে GPA, GPA হিসাব',
    kind: 'generic', formula: GRADE_FORMULA, example: 'গ্রেড পয়েন্ট ৫, ৪, ৩.৫ হলে GPA = ১২.৫ ÷ ৩ = ৪.১৭', faq: faqGpa,
    fields: [GR('rows', 'বিষয়সমূহ (গ্রেড পয়েন্ট দিন)', 'points')],
    compute: (inp) => gradeRowsCompute(inp, 'points'),
  },

  // ---------- UNIVERSITY ----------
  ...[
    ['nu-cgpa-calculator', 'জাতীয় বিশ্ববিদ্যালয় CGPA ক্যালকুলেটর', 'National University CGPA Calculator', 'জাতীয় বিশ্ববিদ্যালয়ের (NU) ৪.০ স্কেলে CGPA হিসাব করুন।', true],
    ['honours-cgpa-calculator', 'অনার্স CGPA ক্যালকুলেটর', 'Honours CGPA Calculator', 'অনার্স কোর্সের সব সেমিস্টারের CGPA হিসাব করুন ক্রেডিটসহ।', true],
    ['degree-cgpa-calculator', 'ডিগ্রি CGPA ক্যালকুলেটর', 'Degree CGPA Calculator', 'ডিগ্রি (পাস) কোর্সের CGPA হিসাব করুন।', false],
    ['masters-cgpa-calculator', 'মাস্টার্স CGPA ক্যালকুলেটর', 'Masters CGPA Calculator', 'মাস্টার্স কোর্সের CGPA হিসাব করুন।', false],
    ['diploma-cgpa-calculator', 'ডিপ্লোমা ইঞ্জিনিয়ারিং CGPA ক্যালকুলেটর', 'Diploma Engineering CGPA Calculator', 'ডিপ্লোমা ইঞ্জিনিয়ারিং (BTEB) CGPA হিসাব করুন ৪.০ স্কেলে।', true],
    ['diploma-semester-gpa-calculator', 'ডিপ্লোমা সেমিস্টার GPA ক্যালকুলেটর', 'Diploma Semester GPA Calculator', 'এক সেমিস্টারের GPA হিসাব করুন।', false],
    ['hsc-vocational-gpa-calculator', 'HSC ভোকেশনাল GPA ক্যালকুলেটর', 'HSC Vocational GPA Calculator', 'HSC (ভোকেশনাল) পরীক্ষার GPA নম্বর দিয়ে হিসাব করুন।', false],
    ['bteb-grade-calculator', 'BTEB গ্রেড ক্যালকুলেটর', 'BTEB Grade Calculator', 'BTEB নম্বর থেকে গ্রেড ও পয়েন্ট বের করুন।', false],
  ].map(([slug, titleBn, titleEn, desc, popular]) => ({
    slug, titleBn, titleEn, descriptionBn: desc,
    category: slug.startsWith('diploma') || slug.startsWith('hsc-voc') || slug.startsWith('bteb') ? 'bteb' : 'university',
    keywords: `${titleEn}, ${titleBn}, CGPA হিসাব`, popular, kind: 'generic',
    formula: slug.includes('vocational') || slug === 'bteb-grade-calculator' ? GRADE_FORMULA : CGPA_FORMULA,
    example: slug.includes('vocational') ? 'প্রতি বিষয়ের নম্বর থেকে গ্রেড পয়েন্টের গড়ই GPA' : '৩ ক্রেডিটে A+ (৪.০) ও ৩ ক্রেডিটে A (৩.৭৫) হলে CGPA = (১২+১১.২৫) ÷ ৬ = ৩.৮৮',
    faq: slug.includes('vocational') ? faqGpa : faqCgpa,
    fields: slug.includes('vocational') ? [GR('rows', 'বিষয়সমূহ (নম্বর দিন)', 'marks')]
      : slug === 'bteb-grade-calculator' ? [N('marks', 'নম্বর (০–১০০)', { min: 0, max: 100 })]
      : [GR('rows', 'কোর্সসমূহ (গ্রেড ও ক্রেডিট দিন)', 'credit')],
    compute: slug.includes('vocational') ? (inp) => gradeRowsCompute(inp, 'marks')
      : slug === 'bteb-grade-calculator' ? (inp) => { const g = marksToGrade(inp.marks); return res(`গ্রেড ${g.letter} — পয়েন্ট ${g.point.toFixed(1)}`, [D2('নম্বর', String(inp.marks)), D2('গ্রেড', g.letter)], [`${inp.marks} নম্বর অনুযায়ী গ্রেড ${g.letter}`]) }
      : (inp) => gradeRowsCompute(inp, 'credit'),
  })),
  {
    slug: 'semester-gpa-calculator', titleBn: 'সেমিস্টার GPA ক্যালকুলেটর', titleEn: 'Semester GPA Calculator',
    descriptionBn: 'এক সেমিস্টারের সব কোর্সের গ্রেড ও ক্রেডিট দিয়ে সেমিস্টার GPA হিসাব করুন।',
    category: 'university', keywords: 'Semester GPA, সেমিস্টার GPA, CGPA',
    kind: 'generic', formula: CGPA_FORMULA, example: '৪টি কোর্সে মোট ওজন ৪৫, মোট ক্রেডিট ১২ হলে GPA = ৩.৭৫', faq: faqCgpa,
    fields: [GR('rows', 'কোর্সসমূহ (গ্রেড ও ক্রেডিট দিন)', 'credit')],
    compute: (inp) => gradeRowsCompute(inp, 'credit'),
  },
  {
    slug: 'credit-based-cgpa-calculator', titleBn: 'ক্রেডিটভিত্তিক CGPA ক্যালকুলেটর', titleEn: 'Credit-Based CGPA Calculator',
    descriptionBn: 'ক্রেডিট অনুযায়ী ওজন দিয়ে CGPA হিসাব করুন — যেকোনো বিশ্ববিদ্যালয়ের জন্য।',
    category: 'university', keywords: 'Credit CGPA, ক্রেডিট CGPA, CGPA হিসাব',
    kind: 'generic', formula: CGPA_FORMULA, example: 'ক্রেডিট ৩, ৩, ২ — পয়েন্ট ৪.০, ৩.৫, ৩.০ হলে CGPA = (১২+১০.৫+৬) ÷ ৮ = ৩.৫৬', faq: faqCgpa,
    fields: [GR('rows', 'কোর্সসমূহ (গ্রেড ও ক্রেডিট দিন)', 'credit')],
    compute: (inp) => gradeRowsCompute(inp, 'credit'),
  },
  {
    slug: 'cgpa-calculator', titleBn: 'ইউনিভার্সাল CGPA ক্যালকুলেটর', titleEn: 'Universal CGPA Calculator',
    descriptionBn: 'যেকোনো বিশ্ববিদ্যালয় বা কোর্সের CGPA হিসাব করুন — গ্রেড ও ক্রেডিট দিয়ে।',
    category: 'university', keywords: 'CGPA Calculator, CGPA হিসাব, সিজিপিএ ক্যালকুলেটর',
    popular: true, kind: 'generic', formula: CGPA_FORMULA, example: '৩টি কোর্সে CGPA ৩.৬৬', faq: faqCgpa,
    fields: [GR('rows', 'কোর্সসমূহ (গ্রেড ও ক্রেডিট দিন)', 'credit')],
    compute: (inp) => gradeRowsCompute(inp, 'credit'),
  },
  {
    slug: 'target-cgpa-calculator', titleBn: 'টার্গেট CGPA ক্যালকুলেটর', titleEn: 'Target CGPA Calculator',
    descriptionBn: 'লক্ষ্য CGPA পেতে বাকি সেমিস্টারে কত গড় গ্রেড পয়েন্ট দরকার, তা বের করুন।',
    category: 'university', keywords: 'Target CGPA, টার্গেট CGPA, CGPA লক্ষ্য',
    kind: 'generic', formula: 'প্রয়োজনীয় গড় = (লক্ষ্য CGPA × মোট ক্রেডিট − বর্তমান CGPA × সম্পন্ন ক্রেডিট) ÷ অবশিষ্ট ক্রেডিট',
    example: 'বর্তমান CGPA ৩.০ (৬০ ক্রেডিট), লক্ষ্য ৩.৫, বাকি ৬০ ক্রেডিট হলে প্রয়োজনীয় গড় ৪.০০',
    faq: faqCgpa,
    fields: [N('currentCgpa', 'বর্তমান CGPA', { step: 0.01, min: 0, max: 4 }), N('completedCredits', 'সম্পন্ন ক্রেডিট', { min: 1 }), N('targetCgpa', 'লক্ষ্য CGPA', { step: 0.01, min: 0, max: 4 }), N('remainingCredits', 'অবশিষ্ট ক্রেডিট', { min: 1 })],
    compute: (inp) => { const r = targetCgpa(inp); return res(r.possible ? `প্রয়োজনীয় গড় গ্রেড পয়েন্ট ${r.required.toFixed(2)}` : `লক্ষ্য অসম্ভব — দরকার ${r.required.toFixed(2)} (সর্বোচ্চ ৪.০)`, [D2('প্রয়োজনীয় গড়', r.required.toFixed(2)), D2('মোট ক্রেডিট', String(r.totalCredits)), D2('সম্ভব কি না', r.possible ? 'হ্যাঁ' : 'না')], [`বাকি ${inp.remainingCredits} ক্রেডিটে গড় ${r.required.toFixed(2)} পেলে লক্ষ্য পূরণ হবে`]) },
  },
  {
    slug: 'gpa-to-cgpa-converter', titleBn: 'GPA থেকে CGPA কনভার্টার', titleEn: 'GPA to CGPA Converter',
    descriptionBn: '৫.০ স্কেলের GPA কে ৪.০ স্কেলের CGPA তে রূপান্তর করুন (আনুমানিক)।',
    category: 'university', keywords: 'GPA to CGPA, GPA CGPA রূপান্তর',
    kind: 'generic', formula: 'CGPA (৪.০ স্কেল) = GPA (৫.০ স্কেল) ÷ ৫ × ৪',
    example: 'GPA ৪.৫০ হলে CGPA ≈ ৩.৬০',
    faq: [{ q: 'এই রূপান্তর কি অফিসিয়াল?', a: 'না, এটি স্কেলের আনুপাতিক রূপান্তর মাত্র। বিশ্ববিদ্যালয়ভেদে রূপান্তর নিয়ম ভিন্ন হতে পারে।' }],
    fields: [N('gpa', 'GPA (৫.০ স্কেল)', { step: 0.01, min: 0, max: 5 })],
    compute: (inp) => { const v = Math.round((Number(inp.gpa) / 5 * 4) * 100) / 100; return res(`CGPA ≈ ${v.toFixed(2)}`, [D2('GPA (৫.০)', String(inp.gpa)), D2('CGPA (৪.০)', v.toFixed(2))], [`${inp.gpa} ÷ ৫ × ৪ = ${v.toFixed(2)}`], 'আনুমানিক রূপান্তর; অফিসিয়াল নিয়ম নয়') },
  },
  {
    slug: 'cgpa-to-percentage-converter', titleBn: 'CGPA থেকে শতাংশ কনভার্টার', titleEn: 'CGPA to Percentage Converter',
    descriptionBn: 'CGPA কে শতাংশে রূপান্তর করুন এবং উল্টোটাও দেখুন।',
    category: 'university', keywords: 'CGPA to Percentage, CGPA শতাংশ, Percentage to CGPA',
    kind: 'generic', formula: 'শতাংশ = (CGPA ÷ ৪) × ১০০',
    example: 'CGPA ৩.৫০ হলে শতাংশ ৮৭.৫%',
    faq: [{ q: 'এই রূপান্তর কি অফিসিয়াল?', a: 'না, এটি সরল আনুপাতিক রূপান্তর। অনেক প্রতিষ্ঠান নিজস্ব সূত্র ব্যবহার করে।' }],
    fields: [N('cgpa', 'CGPA (৪.০ স্কেল)', { step: 0.01, min: 0, max: 4 })],
    compute: (inp) => { const p = cgpaToPercentage(inp.cgpa); return res(`শতাংশ ${p.toFixed(2)}%`, [D2('CGPA', String(inp.cgpa)), D2('শতাংশ', `${p.toFixed(2)}%`)], [`${inp.cgpa} ÷ ৪ × ১০০ = ${p.toFixed(2)}%`], 'আনুমানিক রূপান্তর') },
  },

  // ---------- CAREER ----------
  ...[
    ['bcs-age-calculator', 'BCS বয়স ক্যালকুলেটর', 'BCS Age Calculator', 'bcs'],
    ['govt-job-age-calculator', 'সরকারি চাকরির বয়স ক্যালকুলেটর', 'Government Job Age Calculator', 'govt'],
    ['job-eligibility-age-calculator', 'চাকরির যোগ্যতা বয়স ক্যালকুলেটর', 'Job Eligibility Age Calculator', 'general'],
  ].map(([slug, titleBn, titleEn, ruleKey]) => ({
    slug, titleBn, titleEn,
    descriptionBn: `${CAREER_RULES[ruleKey].name} আবেদনের জন্য আপনার বয়সসীমা যাচাই করুন। ${CAREER_RULES[ruleKey].note}`,
    category: 'career', keywords: `${titleEn}, ${titleBn}, চাকরির বয়স, বয়সসীমা`,
    popular: ruleKey === 'bcs', kind: 'generic',
    formula: `বয়স = আবেদনের তারিখ − জন্মতারিখ; সর্বোচ্চ সীমা ${CAREER_RULES[ruleKey].limit} বছর (${CAREER_RULES[ruleKey].effective})`,
    example: 'জন্ম ১ জানুয়ারি ১৯৯৫, আবেদন ১ জানুয়ারি ২০২৬ হলে বয়স ৩১ বছর — সীমার মধ্যে',
    faq: [{ q: 'বয়সসীমা কি নিশ্চিত?', a: 'না — এটি বর্তমান নিয়ম অনুযায়ী দেওয়া। আবেদনের আগে সর্বশেষ সার্কুলার অবশ্যই দেখুন।' }, { q: 'কোন তারিখে বয়স ধরা হয়?', a: 'সার্কুলারে উল্লেখিত তারিখে (সাধারণত আবেদনের শেষ তারিখ)। সেই তারিখটি এখানে বসান।' }],
    fields: [D('birth', 'জন্মতারিখ'), D('asOf', 'যে তারিখে বয়স ধরবেন (সার্কুলারের তারিখ)')],
    compute: careerCompute(ruleKey),
  })),

  // ---------- SCIENTIFIC ----------
  {
    slug: 'scientific-calculator', titleBn: 'সায়েন্টিফিক ক্যালকুলেটর', titleEn: 'Scientific Calculator',
    descriptionBn: 'বৈজ্ঞানিক হিসাব করুন — ত্রিকোণমিতি, লগ, বর্গমূল, ঘাতসহ। নিরাপদ এক্সপ্রেশন পার্সার ব্যবহার করা হয়; eval() ব্যবহার করা হয় না।',
    category: 'scientific', keywords: 'Scientific Calculator, সায়েন্টিফিক ক্যালকুলেটর, বৈজ্ঞানিক হিসাব',
    popular: true, kind: 'scientific',
    formula: 'উদাহরণ: 2+3*4 = 14, sqrt(16) = 4, log(100) = 2, sin(30°) — কোণ রেডিয়ানে হিসাব হয়',
    example: '2+3*4 = 14; (2+3)*4 = 20; 2^10 = 1024',
    faq: [{ q: 'কোণ কি ডিগ্রিতে না রেডিয়ানে?', a: 'sin/cos/tan রেডিয়ানে হিসাব করে। ৩০° এর জন্য sin(0.5236) লিখুন।' }],
    fields: [], compute: null,
  },
  {
    slug: 'basic-calculator', titleBn: 'বেসিক ক্যালকুলেটর', titleEn: 'Basic Calculator',
    descriptionBn: 'যোগ, বিয়োগ, গুণ, ভাগ — দৈনন্দিন হিসাবের সহজ ক্যালকুলেটর।',
    category: 'scientific', keywords: 'Basic Calculator, সাধারণ ক্যালকুলেটর, যোগ বিয়োগ',
    kind: 'basic', formula: 'যোগ, বিয়োগ, গুণ, ভাগ, শতাংশ', example: '১২৫০ + ৩৭৫ = ১৬২৫',
    faq: [{ q: 'শতাংশ কীভাবে?', a: 'সংখ্যার পর % চাপলে তার শতাংশ বের হয়।' }],
    fields: [], compute: null,
  },
  {
    slug: 'percentage-calculator', titleBn: 'শতাংশ ক্যালকুলেটর', titleEn: 'Percentage Calculator',
    descriptionBn: 'শতাংশ বের করুন, শতাংশ বৃদ্ধি/হ্রাস হিসাব করুন, সংখ্যার শতাংশ মান জানুন।',
    category: 'scientific', keywords: 'Percentage Calculator, শতাংশ ক্যালকুলেটর, শতকরা',
    popular: true, kind: 'generic',
    formula: 'শতাংশ = (অংশ ÷ মোট) × ১০০; পরিবর্তন% = (নতুন − পুরাতন) ÷ পুরাতন × ১০০',
    example: '৮০ এর মধ্যে ৬৪ পেলে শতাংশ ৮০%; ১০০০ থেকে ১২০০ হলে বৃদ্ধি ২০%',
    faq: [{ q: 'শতাংশ বৃদ্ধি কীভাবে বের করব?', a: 'পুরাতন ও নতুন মান বসান — ক্যালকুলেটর পরিবর্তনের শতাংশ দেখাবে।' }],
    fields: [N('part', 'অংশ / নতুন মান', { placeholder: 'যেমন: ৬৪' }), N('total', 'মোট / পুরাতন মান', { placeholder: 'যেমন: ৮০' })],
    compute: (inp) => { const p = percentageOf(inp.part, inp.total); const ch = percentChange(inp.total, inp.part); return res(`${inp.part} হলো ${inp.total} এর ${p.toFixed(2)}%`, [D2('শতাংশ', `${p.toFixed(2)}%`), D2('পরিবর্তন', `${ch >= 0 ? '+' : ''}${ch.toFixed(2)}%`)], [`${inp.part} ÷ ${inp.total} × ১০০ = ${p.toFixed(2)}%`]) },
  },
  {
    slug: 'fraction-calculator', titleBn: 'ভগ্নাংশ ক্যালকুলেটর', titleEn: 'Fraction Calculator',
    descriptionBn: 'ভগ্নাংশের যোগ, বিয়োগ, গুণ, ভাগ করুন — লঘিষ্ঠ আকারে ফলাফলসহ।',
    category: 'scientific', keywords: 'Fraction Calculator, ভগ্নাংশ ক্যালকুলেটর',
    kind: 'generic', formula: 'a/b + c/d = (ad+bc)/bd — তারপর লঘিষ্ঠ করা হয়',
    example: '১/২ + ১/৩ = ৫/৬',
    faq: [{ q: 'ফলাফল কি লঘিষ্ঠ আকারে আসে?', a: 'হ্যাঁ, সব ফলাফল গসাগু দিয়ে লঘিষ্ঠ করা হয়।' }],
    fields: [N('aNum', 'প্রথম ভগ্নাংশের লব', {}), N('aDen', 'প্রথম ভগ্নাংশের হর', {}), S('op', 'অপারেশন', ['+', '-', '*', '/']), N('bNum', 'দ্বিতীয় ভগ্নাংশের লব', {}), N('bDen', 'দ্বিতীয় ভগ্নাংশের হর', {})],
    compute: (inp) => { const r = fractionCalc(inp.aNum, inp.aDen, inp.bNum, inp.bDen, inp.op); return res(`ফলাফল ${r.numerator}/${r.denominator} (≈ ${r.decimal})`, [D2('ভগ্নাংশ', `${r.numerator}/${r.denominator}`), D2('দশমিক', String(r.decimal))], [`${inp.aNum}/${inp.aDen} ${inp.op} ${inp.bNum}/${inp.bDen} = ${r.numerator}/${r.denominator}`]) },
  },
  {
    slug: 'square-root-calculator', titleBn: 'বর্গমূল ক্যালকুলেটর', titleEn: 'Square Root Calculator',
    descriptionBn: 'যেকোনো সংখ্যার বর্গমূল বের করুন।',
    category: 'scientific', keywords: 'Square Root, বর্গমূল, sqrt',
    kind: 'generic', formula: '√x — যে সংখ্যাকে নিজে দিয়ে গুণ করলে x পাওয়া যায়',
    example: '√১৪৪ = ১২',
    faq: [{ q: 'ঋণাত্মক সংখ্যার বর্গমূল?', a: 'বাস্তব সংখ্যায় হয় না — ক্যালকুলেটর ত্রুটি দেখাবে।' }],
    fields: [N('value', 'সংখ্যা', { min: 0, placeholder: 'যেমন: ১৪৪' })],
    compute: (inp) => { const v = Math.round(Math.sqrt(Number(inp.value)) * 10000) / 10000; return res(`√${inp.value} = ${v}`, [D2('বর্গমূল', String(v)), D2('যাচাই', `${v} × ${v} ≈ ${inp.value}`)], [`${inp.value} এর বর্গমূল ${v}`]) },
  },
  {
    slug: 'power-calculator', titleBn: 'ঘাত (পাওয়ার) ক্যালকুলেটর', titleEn: 'Power Calculator',
    descriptionBn: 'ঘাত ও সূচক হিসাব করুন — x এর y ঘাত।',
    category: 'scientific', keywords: 'Power Calculator, ঘাত, সূচক',
    kind: 'generic', formula: 'x^y — x কে y বার গুণ',
    example: '২^১০ = ১০২৪',
    faq: [{ q: 'ঋণাত্মক ঘাত?', a: 'হ্যাঁ, যেমন ২^-২ = ০.২৫।' }],
    fields: [N('base', 'ভিত্তি (x)', { placeholder: 'যেমন: ২' }), N('exp', 'ঘাত (y)', { placeholder: 'যেমন: ১০' })],
    compute: (inp) => { const v = Math.round(Math.pow(Number(inp.base), Number(inp.exp)) * 1e10) / 1e10; return res(`${inp.base}^${inp.exp} = ${v}`, [D2('ফলাফল', String(v))], [`${inp.base} কে ${inp.exp} বার গুণ করা হয়েছে`]) },
  },
  {
    slug: 'logarithm-calculator', titleBn: 'লগারিদম ক্যালকুলেটর', titleEn: 'Logarithm Calculator',
    descriptionBn: 'log (ভিত্তি ১০) ও ln (স্বাভাবিক লগ) হিসাব করুন।',
    category: 'scientific', keywords: 'Logarithm, লগ, ln, log calculator',
    kind: 'generic', formula: 'log₁₀(x) ও ln(x) = logₑ(x)',
    example: 'log(১০০০) = ৩; ln(e) = ১',
    faq: [{ q: 'শূন্য বা ঋণাত্মক সংখ্যার লগ?', a: 'লগ শুধু ধনাত্মক সংখ্যার জন্য সংজ্ঞায়িত।' }],
    fields: [N('value', 'সংখ্যা', { min: 0.000001, placeholder: 'যেমন: ১০০০' })],
    compute: (inp) => { const v = Number(inp.value); return res(`log₁₀(${v}) = ${(Math.round(Math.log10(v) * 10000) / 10000)}`, [D2('log₁₀', String(Math.round(Math.log10(v) * 10000) / 10000)), D2('ln (স্বাভাবিক)', String(Math.round(Math.log(v) * 10000) / 10000))], [`log₁₀(${v}) হিসাব করা হয়েছে`]) },
  },
  {
    slug: 'matrix-calculator', titleBn: 'ম্যাট্রিক্স ক্যালকুলেটর', titleEn: 'Matrix Calculator',
    descriptionBn: '২×২ ম্যাট্রিক্সের যোগ, গুণ ও নির্ণায়ক (determinant) হিসাব করুন।',
    category: 'scientific', keywords: 'Matrix Calculator, ম্যাট্রিক্স, নির্ণায়ক',
    kind: 'matrix', formula: 'det [[a,b],[c,d]] = ad − bc; গুণ: সারি × কলাম',
    example: 'det [[১,২],[৩,৪]] = ১×৪ − ২×৩ = −২',
    faq: [{ q: 'শুধু ২×২ কেন?', a: 'এই সংস্করণে ২×২ ম্যাট্রিক্স সমর্থিত; বড় ম্যাট্রিক্স ভবিষ্যৎ সংস্করণে আসবে।' }],
    fields: [], compute: null,
  },
  {
    slug: 'equation-solver', titleBn: 'সমীকরণ সমাধানকারী', titleEn: 'Equation Solver',
    descriptionBn: 'রৈখিক (ax + b = 0) ও দ্বিঘাত (ax² + bx + c = 0) সমীকরণের সমাধান বের করুন।',
    category: 'scientific', keywords: 'Equation Solver, সমীকরণ, দ্বিঘাত সমীকরণ',
    kind: 'equation', formula: 'রৈখিক: x = −b/a; দ্বিঘাত: x = (−b ± √(b²−4ac)) / 2a',
    example: 'x² − ৫x + ৬ = ০ হলে x = ৩ বা ২',
    faq: [{ q: 'বাস্তব সমাধান না থাকলে?', a: 'বৈষম্যকারী (b²−4ac) ঋণাত্মক হলে বাস্তব সমাধান নেই বলে জানানো হয়।' }],
    fields: [], compute: null,
  },
  {
    slug: 'average-calculator', titleBn: 'গড় ক্যালকুলেটর', titleEn: 'Average Calculator',
    descriptionBn: 'কয়েকটি সংখ্যার গড় (mean) বের করুন — কমা দিয়ে সংখ্যাগুলো লিখুন।',
    category: 'scientific', keywords: 'Average Calculator, গড়, mean',
    kind: 'generic', formula: 'গড় = সব সংখ্যার যোগফল ÷ সংখ্যার সংখ্যা',
    example: '১০, ২০, ৩০ এর গড় ২০',
    faq: [{ q: 'কতগুলো সংখ্যা দেওয়া যায়?', a: 'যত খুশি — কমা দিয়ে আলাদা করে লিখুন।' }],
    fields: [{ key: 'numbers', label: 'সংখ্যাগুলো (কমা দিয়ে আলাদা করুন)', type: 'text', placeholder: 'যেমন: ১০, ২০, ৩০, ৪০' }],
    compute: (inp) => { const nums = String(inp.numbers).split(/[,\s]+/).map(Number).filter(Number.isFinite); const a = average(nums); return res(`গড় ${a}`, [D2('সংখ্যার সংখ্যা', String(nums.length)), D2('যোগফল', String(nums.reduce((x, y) => x + y, 0))), D2('গড়', String(a))], [`যোগফলকে ${nums.length} দিয়ে ভাগ করা হয়েছে`]) },
  },
  {
    slug: 'ratio-calculator', titleBn: 'অনুপাত ক্যালকুলেটর', titleEn: 'Ratio Calculator',
    descriptionBn: 'দুটি সংখ্যার অনুপাত লঘিষ্ঠ আকারে বের করুন।',
    category: 'scientific', keywords: 'Ratio Calculator, অনুপাত',
    kind: 'generic', formula: 'অনুপাত = a : b — গসাগু দিয়ে ভাগ করে লঘিষ্ঠ করা হয়',
    example: '৬ : ৯ = ২ : ৩',
    faq: [{ q: 'তিনটি সংখ্যার অনুপাত?', a: 'এই সংস্করণে দুটি সংখ্যা সমর্থিত।' }],
    fields: [N('a', 'প্রথম সংখ্যা', {}), N('b', 'দ্বিতীয় সংখ্যা', {})],
    compute: (inp) => { const r = ratioSimplify(inp.a, inp.b); return res(`অনুপাত ${r}`, [D2('লঘিষ্ঠ অনুপাত', r)], [`${inp.a} : ${inp.b} কে গসাগু দিয়ে ভাগ করা হয়েছে`]) },
  },
]

calculators.push(
  // ---------- FINANCE ----------
  {
    slug: 'emi-calculator', titleBn: 'EMI ক্যালকুলেটর', titleEn: 'EMI Calculator',
    descriptionBn: 'ঋণের মাসিক কিস্তি (EMI), মোট সুদ ও মোট পরিশোধ হিসাব করুন — চার্টসহ।',
    category: 'finance', keywords: 'EMI Calculator, ইএমআই ক্যালকুলেটর, ঋণের কিস্তি',
    popular: true, kind: 'emi',
    formula: 'EMI = P × r × (1+r)ⁿ ÷ ((1+r)ⁿ − 1), যেখানে r = মাসিক সুদের হার, n = মোট মাস',
    example: '১,০০,০০০ টাকা, ১২% সুদ, ১২ মাস হলে EMI ≈ ৮,৮৮৫ টাকা',
    faq: [{ q: 'EMI কী?', a: 'Equated Monthly Instalment — প্রতি মাসে সমান কিস্তিতে ঋণ শোধ করা হয়।' }, { q: 'সুদের হার কোথা থেকে নেব?', a: 'আপনার ব্যাংক বা ঋণদাতার দেওয়া বার্ষিক হার বসান।' }],
    fields: [N('principal', 'ঋণের পরিমাণ (টাকা)', { min: 1 }), N('rate', 'বার্ষিক সুদের হার (%)', { step: 0.01, min: 0 }), N('months', 'মেয়াদ (মাস)', { min: 1 })],
    compute: (inp) => { const r = emi(inp.principal, inp.rate, inp.months); return res(`মাসিক EMI ৳${r.emi.toLocaleString('en-US')}`, [D2('মাসিক EMI', `৳${r.emi.toLocaleString('en-US')}`), D2('মোট সুদ', `৳${r.totalInterest.toLocaleString('en-US')}`), D2('মোট পরিশোধ', `৳${r.totalPayment.toLocaleString('en-US')}`)], [`মাসিক হার ${Number(inp.rate) / 12}% ধরে EMI সূত্র প্রয়োগ করা হয়েছে`]) },
  },
  {
    slug: 'loan-calculator', titleBn: 'ঋণ ক্যালকুলেটর', titleEn: 'Loan Calculator',
    descriptionBn: 'ঋণের মাসিক কিস্তি ও মোট খরচ হিসাব করুন।',
    category: 'finance', keywords: 'Loan Calculator, ঋণ ক্যালকুলেটর, লোন',
    kind: 'generic', formula: 'EMI সূত্র — P × r × (1+r)ⁿ ÷ ((1+r)ⁿ − 1)',
    example: '৫,০০,০০০ টাকা, ১০% সুদ, ২৪ মাস হলে EMI ≈ ২৩,০৭২ টাকা',
    faq: [{ q: 'EMI আর ঋণ ক্যালকুলেটর কি এক?', a: 'মূল হিসাব একই; EMI ক্যালকুলেটরে চার্টসহ বিস্তারিত দেখানো হয়।' }],
    fields: [N('principal', 'ঋণের পরিমাণ (টাকা)', { min: 1 }), N('rate', 'বার্ষিক সুদের হার (%)', { step: 0.01, min: 0 }), N('months', 'মেয়াদ (মাস)', { min: 1 })],
    compute: (inp) => { const r = emi(inp.principal, inp.rate, inp.months); return res(`মাসিক কিস্তি ৳${r.emi.toLocaleString('en-US')}`, [D2('মাসিক কিস্তি', `৳${r.emi.toLocaleString('en-US')}`), D2('মোট সুদ', `৳${r.totalInterest.toLocaleString('en-US')}`), D2('মোট পরিশোধ', `৳${r.totalPayment.toLocaleString('en-US')}`)], [`EMI সূত্র প্রয়োগ করা হয়েছে`]) },
  },
  {
    slug: 'simple-interest-calculator', titleBn: 'সরল সুদ ক্যালকুলেটর', titleEn: 'Simple Interest Calculator',
    descriptionBn: 'সরল সুদ ও মোট পরিশোধ হিসাব করুন।',
    category: 'finance', keywords: 'Simple Interest, সরল সুদ, সুদ হিসাব',
    kind: 'generic', formula: 'সুদ = (আসল × হার × সময়) ÷ ১০০',
    example: '১০,০০০ টাকা, ১০%, ২ বছর হলে সুদ ২,০০০ টাকা',
    faq: [{ q: 'সরল সুদ আর চক্রবৃদ্ধি সুদের পার্থক্য?', a: 'সরল সুদে শুধু আসলের উপর সুদ ধরা হয়; চক্রবৃদ্ধিতে সুদের উপরও সুদ ধরা হয়।' }],
    fields: [N('principal', 'আসল (টাকা)', { min: 0 }), N('rate', 'বার্ষিক হার (%)', { step: 0.01 }), N('years', 'সময় (বছর)', { step: 0.5 })],
    compute: (inp) => { const r = simpleInterest(inp.principal, inp.rate, inp.years); return res(`সুদ ৳${r.interest.toLocaleString('en-US')}`, [D2('সুদ', `৳${r.interest.toLocaleString('en-US')}`), D2('মোট (আসল+সুদ)', `৳${r.total.toLocaleString('en-US')}`)], [`(${inp.principal} × ${inp.rate} × ${inp.years}) ÷ ১০০ = ${r.interest}`]) },
  },
  {
    slug: 'compound-interest-calculator', titleBn: 'চক্রবৃদ্ধি সুদ ক্যালকুলেটর', titleEn: 'Compound Interest Calculator',
    descriptionBn: 'চক্রবৃদ্ধি সুদে বিনিয়োগের ভবিষ্যৎ মূল্য হিসাব করুন।',
    category: 'finance', keywords: 'Compound Interest, চক্রবৃদ্ধি সুদ, বিনিয়োগ',
    kind: 'generic', formula: 'মোট = P × (1 + r/n)^(n×t)',
    example: '১০,০০০ টাকা, ১০%, ২ বছর (বার্ষিক চক্রবৃদ্ধি) হলে মোট ১২,১০০ টাকা',
    faq: [{ q: 'চক্রবৃদ্ধি কতবার হবে?', a: 'বছরে কতবার সুদ যোগ হয় তা বেছে নিন — বার্ষিক, অর্ধবার্ষিক বা মাসিক।' }],
    fields: [N('principal', 'আসল (টাকা)', { min: 0 }), N('rate', 'বার্ষিক হার (%)', { step: 0.01 }), N('years', 'সময় (বছর)', { step: 0.5 }), S('compounds', 'চক্রবৃদ্ধির ধরন', ['1', '2', '4', '12'])],
    compute: (inp) => { const r = compoundInterest(inp.principal, inp.rate, inp.years, Number(inp.compounds)); return res(`মোট ৳${r.total.toLocaleString('en-US')}`, [D2('সুদ', `৳${r.interest.toLocaleString('en-US')}`), D2('মোট', `৳${r.total.toLocaleString('en-US')}`)], [`${inp.compounds} বার/বছর চক্রবৃদ্ধি ধরে হিসাব করা হয়েছে`]) },
  },
  {
    slug: 'profit-loss-calculator', titleBn: 'লাভ-ক্ষতি ক্যালকুলেটর', titleEn: 'Profit and Loss Calculator',
    descriptionBn: 'ক্রয়মূল্য ও বিক্রয়মূল্য থেকে লাভ বা ক্ষতি ও তার শতাংশ বের করুন।',
    category: 'finance', keywords: 'Profit Loss, লাভ ক্ষতি, লাভের হিসাব',
    kind: 'generic', formula: 'লাভ/ক্ষতি = বিক্রয়মূল্য − ক্রয়মূল্য; শতাংশ = (লাভ/ক্ষতি ÷ ক্রয়মূল্য) × ১০০',
    example: 'কেনা ১০০ টাকা, বিক্রি ১৫০ টাকা হলে লাভ ৫০ টাকা (৫০%)',
    faq: [{ q: 'লাভ না ক্ষতি কীভাবে বুঝব?', a: 'বিক্রয়মূল্য ক্রয়মূল্যের বেশি হলে লাভ, কম হলে ক্ষতি।' }],
    fields: [N('cost', 'ক্রয়মূল্য (টাকা)', { min: 0.01 }), N('selling', 'বিক্রয়মূল্য (টাকা)', { min: 0 })],
    compute: (inp) => { const r = profitLoss(inp.cost, inp.selling); return res(r.isProfit ? `লাভ ৳${r.amount.toLocaleString('en-US')} (${r.percent}%)` : `ক্ষতি ৳${r.amount.toLocaleString('en-US')} (${r.percent}%)`, [D2('পরিমাণ', `৳${r.amount.toLocaleString('en-US')}`), D2('শতাংশ', `${r.percent}%`), D2('ধরন', r.isProfit ? 'লাভ' : 'ক্ষতি')], [`(${inp.selling} − ${inp.cost}) ÷ ${inp.cost} × ১০০ = ${r.percent}%`]) },
  },
  {
    slug: 'discount-calculator', titleBn: 'ডিসকাউন্ট ক্যালকুলেটর', titleEn: 'Discount Calculator',
    descriptionBn: 'ছাড়ের পর দাম ও সাশ্রয় হিসাব করুন।',
    category: 'finance', keywords: 'Discount Calculator, ডিসকাউন্ট, ছাড়ের হিসাব',
    kind: 'generic', formula: 'ছাড়ের পরিমাণ = মূল্য × ছাড়% ÷ ১০০; চূড়ান্ত দাম = মূল্য − ছাড়',
    example: '১,০০০ টাকায় ২০% ছাড় হলে দাম ৮০০ টাকা',
    faq: [{ q: 'দুটি ছাড় একসাথে?', a: 'এই সংস্করণে একটি ছাড়ের হার সমর্থিত।' }],
    fields: [N('price', 'মূল্য (টাকা)', { min: 0 }), N('discount', 'ছাড় (%)', { step: 0.5, min: 0, max: 100 })],
    compute: (inp) => { const r = discountCalc(inp.price, inp.discount); return res(`চূড়ান্ত দাম ৳${r.finalPrice.toLocaleString('en-US')}`, [D2('ছাড়', `৳${r.discountAmount.toLocaleString('en-US')}`), D2('চূড়ান্ত দাম', `৳${r.finalPrice.toLocaleString('en-US')}`)], [`${inp.price} × ${inp.discount}% = ${r.discountAmount} টাকা ছাড়`]) },
  },
  {
    slug: 'vat-calculator', titleBn: 'ভ্যাট ক্যালকুলেটর', titleEn: 'VAT Calculator',
    descriptionBn: 'ভ্যাটসহ বা ভ্যাটছাড়া দাম হিসাব করুন — হার আপনি নিজে বসান। কোনো হার অফিসিয়াল হিসেবে ধরা হয়নি।',
    category: 'finance', keywords: 'VAT Calculator, ভ্যাট ক্যালকুলেটর, ভ্যাট হিসাব',
    kind: 'generic', formula: 'ভ্যাট = মূল্য × হার ÷ ১০০ (হার আপনি বসাবেন; ডিফল্ট ১৫% শুধু উদাহরণ)',
    example: '১,০০০ টাকায় ১৫% ভ্যাট হলে ভ্যাট ১৫০ টাকা, মোট ১,১৫০ টাকা',
    faq: [{ q: 'ভ্যাটের হার কত?', a: 'বাংলাদেশে পণ্য/সেবাভেদে ভ্যাটের হার ভিন্ন। আপনার ক্ষেত্রে প্রযোজ্য হার বসান — এখানে কোনো হার অফিসিয়াল হিসেবে ধরা হয়নি।' }],
    fields: [N('amount', 'পরিমাণ (টাকা)', { min: 0 }), N('rate', 'ভ্যাটের হার (%) — আপনার হার বসান', { step: 0.5, min: 0, defaultValue: 15 }), S('inclusive', 'দামে ভ্যাট অন্তর্ভুক্ত?', ['no', 'yes'])],
    compute: (inp) => { const r = vatCalc(inp.amount, inp.rate, inp.inclusive === 'yes'); return res(`ভ্যাট ৳${r.tax.toLocaleString('en-US')} — মোট ৳${r.total.toLocaleString('en-US')}`, [D2('মূল দাম', `৳${r.base.toLocaleString('en-US')}`), D2('ভ্যাট', `৳${r.tax.toLocaleString('en-US')}`), D2('মোট', `৳${r.total.toLocaleString('en-US')}`)], [`${inp.rate}% হারে ভ্যাট হিসাব করা হয়েছে`], 'হারটি আপনার দেওয়া; অফিসিয়াল হার নয়') },
  },
  {
    slug: 'tax-calculator', titleBn: 'ট্যাক্স ক্যালকুলেটর', titleEn: 'Tax Calculator',
    descriptionBn: 'আপনার দেওয়া হারে ট্যাক্সের পরিমাণ হিসাব করুন। কোনো ট্যাক্স হার অফিসিয়াল হিসেবে ধরা হয়নি।',
    category: 'finance', keywords: 'Tax Calculator, ট্যাক্স ক্যালকুলেটর, আয়কর হিসাব',
    kind: 'generic', formula: 'ট্যাক্স = আয় × হার ÷ ১০০ (হার আপনি বসাবেন)',
    example: '৫,০০,০০০ টাকায় ১০% হারে ট্যাক্স ৫০,০০০ টাকা',
    faq: [{ q: 'এই হিসাব কি অফিসিয়াল আয়কর?', a: 'না — বাংলাদেশের আয়কর স্ল্যাবভিত্তিক ও ছাড়সহ জটিল। এটি সরল হারভিত্তিক হিসাব মাত্র; সঠিক করের জন্য NBR নির্দেশনা বা কর পরামর্শক দেখুন।' }],
    fields: [N('amount', 'আয় / পরিমাণ (টাকা)', { min: 0 }), N('rate', 'ট্যাক্সের হার (%) — আপনার হার বসান', { step: 0.5, min: 0 })],
    compute: (inp) => { const r = vatCalc(inp.amount, inp.rate, false); return res(`ট্যাক্স ৳${r.tax.toLocaleString('en-US')} — মোট ৳${r.total.toLocaleString('en-US')}`, [D2('ট্যাক্স', `৳${r.tax.toLocaleString('en-US')}`), D2('মোট', `৳${r.total.toLocaleString('en-US')}`)], [`${inp.rate}% হারে হিসাব করা হয়েছে`], 'সরল হিসাব; অফিসিয়াল আয়কর নয়') },
  },
  {
    slug: 'savings-calculator', titleBn: 'সঞ্চয় ক্যালকুলেটর', titleEn: 'Savings Calculator',
    descriptionBn: 'মাসিক সঞ্চয়ে ভবিষ্যতে কত জমবে, সুদসহ হিসাব করুন।',
    category: 'finance', keywords: 'Savings Calculator, সঞ্চয় ক্যালকুলেটর, জমানো টাকা',
    kind: 'generic', formula: 'ভবিষ্যৎ মূল্য = মাসিক জমা × ((1+r)ⁿ − 1) ÷ r × (1+r)',
    example: 'মাসে ৫,০০০ টাকা, ৮% সুদ, ৬০ মাসে মোট জমা ৩,০০,০০০ টাকা, ভবিষ্যৎ মূল্য ≈ ৩,৭৪,০০০ টাকা',
    faq: [{ q: 'সুদ কি মাসিক চক্রবৃদ্ধি ধরা হয়?', a: 'হ্যাঁ, মাসিক জমার শুরুতে ধরা হয়।' }],
    fields: [N('monthly', 'মাসিক জমা (টাকা)', { min: 0 }), N('rate', 'বার্ষিক সুদের হার (%)', { step: 0.5, min: 0 }), N('months', 'মেয়াদ (মাস)', { min: 1 })],
    compute: (inp) => { const r = savingsFutureValue(inp.monthly, inp.rate, inp.months); return res(`ভবিষ্যৎ মূল্য ৳${r.futureValue.toLocaleString('en-US')}`, [D2('মোট জমা', `৳${r.totalDeposit.toLocaleString('en-US')}`), D2('সুদ', `৳${r.interest.toLocaleString('en-US')}`), D2('ভবিষ্যৎ মূল্য', `৳${r.futureValue.toLocaleString('en-US')}`)], [`${inp.months} মাসে ${inp.rate}% হারে হিসাব করা হয়েছে`]) },
  },

  // ---------- DATE & TIME ----------
  {
    slug: 'age-calculator', titleBn: 'বয়স ক্যালকুলেটর', titleEn: 'Age Calculator',
    descriptionBn: 'জন্মতারিখ থেকে নিখুঁত বয়স বের করুন — বছর, মাস, দিন, মোট দিনসহ।',
    category: 'date-time', keywords: 'Age Calculator, বয়স ক্যালকুলেটর, বয়স হিসাব',
    popular: true, kind: 'age',
    formula: 'বয়স = আজকের তারিখ − জন্মতারিখ (ক্যালেন্ডার অনুযায়ী বছর/মাস/দিন)',
    example: 'জন্ম ১৫ জানুয়ারি ২০০০, আজ ২২ নভেম্বর ২০২৬ হলে বয়স ২৬ বছর ১০ মাস ৭ দিন',
    faq: [{ q: 'বয়স কি নিখুঁতভাবে হিসাব হয়?', a: 'হ্যাঁ, ক্যালেন্ডারের বছর-মাস-দিন ধরে হিসাব করা হয়।' }],
    fields: [], compute: null,
  },
  {
    slug: 'date-difference-calculator', titleBn: 'তারিখের পার্থক্য ক্যালকুলেটর', titleEn: 'Date Difference Calculator',
    descriptionBn: 'দুটি তারিখের মধ্যে কত দিন, সপ্তাহ, মাস বা বছর — হিসাব করুন।',
    category: 'date-time', keywords: 'Date Difference, তারিখের পার্থক্য, দিনের হিসাব',
    kind: 'generic', formula: 'পার্থক্য = পরের তারিখ − আগের তারিখ',
    example: '১ জানুয়ারি ২০২৬ থেকে ১১ জানুয়ারি ২০২৬ = ১০ দিন',
    faq: [{ q: 'মাসের হিসাব কি নিখুঁত?', a: 'মাস ও বছর আনুমানিক (৩০.৪৪ দিন/মাস, ৩৬৫.২৫ দিন/বছর); দিনের হিসাব নিখুঁত।' }],
    fields: [D('from', 'শুরুর তারিখ'), D('to', 'শেষ তারিখ')],
    compute: (inp) => { const r = dateDiff(inp.from, inp.to); return res(`${r.days} দিন`, [D2('দিন', String(r.days)), D2('সপ্তাহ', String(r.weeks)), D2('মাস (আনুমানিক)', String(r.monthsApprox)), D2('বছর (আনুমানিক)', String(r.yearsApprox))], [`দুটি তারিখের পার্থক্য হিসাব করা হয়েছে`]) },
  },
  {
    slug: 'days-calculator', titleBn: 'দিন ক্যালকুলেটর', titleEn: 'Days Calculator',
    descriptionBn: 'দুটি তারিখের মধ্যে মোট দিন গুনুন।',
    category: 'date-time', keywords: 'Days Calculator, দিন ক্যালকুলেটর, কত দিন',
    kind: 'generic', formula: 'দিন = শেষ তারিখ − শুরুর তারিখ',
    example: '১ জানুয়ারি থেকে ৩১ জানুয়ারি = ৩০ দিন',
    faq: [{ q: 'শুরুর দিন কি গোনা হয়?', a: 'না, পার্থক্যের দিন গোনা হয়।' }],
    fields: [D('from', 'শুরুর তারিখ'), D('to', 'শেষ তারিখ')],
    compute: (inp) => { const r = dateDiff(inp.from, inp.to); return res(`${r.days} দিন`, [D2('মোট দিন', String(r.days))], [`দুটি তারিখের পার্থক্য হিসাব করা হয়েছে`]) },
  },
  {
    slug: 'date-add-subtract-calculator', titleBn: 'তারিখ যোগ-বিয়োগ ক্যালকুলেটর', titleEn: 'Date Addition and Subtraction Calculator',
    descriptionBn: 'কোনো তারিখের সঙ্গে দিন যোগ বা বিয়োগ করে নতুন তারিখ বের করুন।',
    category: 'date-time', keywords: 'Date Add Subtract, তারিখ যোগ বিয়োগ',
    kind: 'generic', formula: 'নতুন তারিখ = তারিখ ± দিনসংখ্যা',
    example: '১ জানুয়ারি ২০২৬ + ৪০ দিন = ১০ ফেব্রুয়ারি ২০২৬',
    faq: [{ q: 'ঋণাত্মক দিন দেওয়া যায়?', a: 'হ্যাঁ, মাইনাস সংখ্যা দিলে দিন বিয়োগ হবে।' }],
    fields: [D('date', 'তারিখ'), N('days', 'দিন (যোগ করতে ধনাত্মক, বিয়োগ করতে ঋণাত্মক)', { step: 1 })],
    compute: (inp) => { const d = addDays(inp.date, inp.days); return res(`নতুন তারিখ ${d}`, [D2('মূল তারিখ', String(inp.date)), D2('দিন', String(inp.days)), D2('নতুন তারিখ', d)], [`${inp.date} এর সঙ্গে ${inp.days} দিন যোগ/বিয়োগ করা হয়েছে`]) },
  },
  {
    slug: 'time-calculator', titleBn: 'সময় ক্যালকুলেটর', titleEn: 'Time Calculator',
    descriptionBn: 'দুটি সময়ের পার্থক্য ঘণ্টা ও মিনিটে বের করুন।',
    category: 'date-time', keywords: 'Time Calculator, সময় ক্যালকুলেটর, সময়ের পার্থক্য',
    kind: 'generic', formula: 'পার্থক্য = পরের সময় − আগের সময়',
    example: 'সকাল ৯:০০ থেকে বিকেল ৫:৩০ = ৮ ঘণ্টা ৩০ মিনিট',
    faq: [{ q: 'রাত পার হলে?', a: 'এই সংস্করণে একই দিনের সময় ধরা হয়।' }],
    fields: [N('h1', 'প্রথম সময় — ঘণ্টা (০–২৩)', { min: 0, max: 23 }), N('m1', 'প্রথম সময় — মিনিট (০–৫৯)', { min: 0, max: 59 }), N('h2', 'দ্বিতীয় সময় — ঘণ্টা (০–২৩)', { min: 0, max: 23 }), N('m2', 'দ্বিতীয় সময় — মিনিট (০–৫৯)', { min: 0, max: 59 })],
    compute: (inp) => { const r = timeDiff(inp.h1, inp.m1, inp.h2, inp.m2); return res(`${r.hours} ঘণ্টা ${r.minutes} মিনিট`, [D2('ঘণ্টা', String(r.hours)), D2('মিনিট', String(r.minutes)), D2('মোট মিনিট', String(r.totalMinutes))], [`দুটি সময়ের পার্থক্য হিসাব করা হয়েছে`]) },
  },
  {
    slug: 'countdown-calculator', titleBn: 'কাউন্টডাউন ক্যালকুলেটর', titleEn: 'Countdown Calculator',
    descriptionBn: 'কোনো তারিখ পর্যন্ত আর কত দিন, ঘণ্টা, মিনিট বাকি — হিসাব করুন।',
    category: 'date-time', keywords: 'Countdown Calculator, কাউন্টডাউন, কত দিন বাকি',
    kind: 'generic', formula: 'বাকি = লক্ষ্য তারিখ − আজকের তারিখ',
    example: 'আজ ২২ নভেম্বর ২০২৬, লক্ষ্য ১ জানুয়ারি ২০২৭ হলে বাকি ৪০ দিন',
    faq: [{ q: 'অতীতের তারিখ দিলে?', a: 'কত দিন আগে ছিল তা দেখাবে।' }],
    fields: [D('target', 'লক্ষ্য তারিখ')],
    compute: (inp) => { const today = new Date().toISOString().slice(0, 10); const r = dateDiff(today, inp.target); const past = inp.target < today; return res(past ? `${r.days} দিন আগে ছিল` : `${r.days} দিন বাকি`, [D2('দিন', String(r.days)), D2('সপ্তাহ', String(r.weeks)), D2('অবস্থা', past ? 'অতীত' : 'ভবিষ্যৎ')], [`আজ (${today}) থেকে ${inp.target} পর্যন্ত হিসাব করা হয়েছে`]) },
  },
  {
    slug: 'working-days-calculator', titleBn: 'কর্মদিবস ক্যালকুলেটর', titleEn: 'Working Days Calculator',
    descriptionBn: 'দুটি তারিখের মধ্যে কর্মদিবস গুনুন — শুক্রবার বাদ, শনিবার ঐচ্ছিক।',
    category: 'date-time', keywords: 'Working Days, কর্মদিবস, অফিস দিন',
    kind: 'generic', formula: 'শুক্রবার বাদ দিয়ে (শনিবার আপনার পছন্দ অনুযায়ী) দিন গোনা হয়',
    example: '১৬–২২ নভেম্বর ২০২৬ (শুক্র+শনি বাদ) = ৫ কর্মদিবস',
    faq: [{ q: 'সরকারি ছুটি কি বাদ যায়?', a: 'না — শুধু সাপ্তাহিক ছুটি (শুক্রবার, ঐচ্ছিক শনিবার) বাদ যায়। সরকারি ছুটির তালিকা এখানে ধরা হয়নি।' }],
    fields: [D('from', 'শুরুর তারিখ'), D('to', 'শেষ তারিখ'), S('saturday', 'শনিবার কি কর্মদিবস?', ['no', 'yes'])],
    compute: (inp) => { const r = workingDays(inp.from, inp.to, inp.saturday === 'yes'); return res(`${r.workingDays} কর্মদিবস`, [D2('কর্মদিবস', String(r.workingDays)), D2('মোট দিন', String(r.totalDays))], [`শুক্রবার বাদ দিয়ে গোনা হয়েছে${inp.saturday === 'yes' ? ', শনিবারসহ' : ', শনিবার ছাড়া'}`]) },
  },

  // ---------- UNIT CONVERTERS ----------
  ...[
    ['length-converter', 'দৈর্ঘ্য কনভার্টার', 'Length Converter', 'length'],
    ['weight-converter', 'ওজন কনভার্টার', 'Weight Converter', 'weight'],
    ['temperature-converter', 'তাপমাত্রা কনভার্টার', 'Temperature Converter', 'temperature'],
    ['area-converter', 'ক্ষেত্রফল কনভার্টার', 'Area Converter', 'area'],
    ['volume-converter', 'আয়তন কনভার্টার', 'Volume Converter', 'volume'],
    ['speed-converter', 'গতি কনভার্টার', 'Speed Converter', 'speed'],
    ['time-converter', 'সময় কনভার্টার', 'Time Converter', 'time'],
    ['digital-storage-converter', 'ডিজিটাল স্টোরেজ কনভার্টার', 'Digital Storage Converter', 'storage'],
  ].map(([slug, titleBn, titleEn, group]) => ({
    slug, titleBn, titleEn,
    descriptionBn: `${titleBn} — যেকোনো একক থেকে যেকোনো এককে রূপান্তর করুন।`,
    category: 'converters', keywords: `${titleEn}, ${titleBn}, একক রূপান্তর`,
    popular: slug === 'length-converter', kind: 'unit', unitGroup: group,
    formula: 'রূপান্তর = মান × (মূল এককের গুণক ÷ লক্ষ্য এককের গুণক)',
    example: group === 'length' ? '১ কিলোমিটার = ১,০০০ মিটার' : group === 'temperature' ? '১০০° সেলসিয়াস = ২১২° ফারেনহাইট' : 'একক বেছে নিয়ে মান বসান',
    faq: [{ q: 'ফলাফল কি নিখুঁত?', a: 'আন্তর্জাতিক মানের রূপান্তর গুণক ব্যবহার করা হয়েছে।' }],
    fields: [], compute: null,
  })),
  {
    slug: 'unit-converter', titleBn: 'একক কনভার্টার', titleEn: 'Unit Converter',
    descriptionBn: 'সব ধরনের একক রূপান্তর এক জায়গায় — দৈর্ঘ্য, ওজন, তাপমাত্রা, ক্ষেত্রফল, আয়তন, গতি, সময় ও ডিজিটাল স্টোরেজ।',
    category: 'converters', keywords: 'Unit Converter, একক কনভার্টার, রূপান্তর',
    popular: true, kind: 'unit', unitGroup: 'length',
    formula: 'রূপান্তর = মান × (মূল এককের গুণক ÷ লক্ষ্য এককের গুণক)',
    example: '১ কিলোমিটার = ১,০০০ মিটার; ১ কেজি = ২.২০৪৬ পাউন্ড',
    faq: [{ q: 'কোন গ্রুপগুলো আছে?', a: 'দৈর্ঘ্য, ওজন, তাপমাত্রা, ক্ষেত্রফল, আয়তন, গতি, সময় ও ডিজিটাল স্টোরেজ।' }],
    fields: [], compute: null,
  },

  // ---------- BANGLADESH SPECIAL ----------
  ...[
    ['land-calculator', 'জমির মাপ ক্যালকুলেটর', 'Land Measurement Calculator', 'শতাংশ'],
    ['shotangsho-converter', 'শতাংশ কনভার্টার', 'Shotangsho Converter', 'শতাংশ'],
    ['katha-converter', 'কাঠা কনভার্টার', 'Katha Converter', 'কাঠা'],
    ['bigha-converter', 'বিঘা কনভার্টার', 'Bigha Converter', 'বিঘা'],
    ['acre-converter', 'একর কনভার্টার', 'Acre Converter', 'একর'],
    ['square-feet-converter', 'বর্গফুট কনভার্টার', 'Square Feet Converter', 'বর্গফুট'],
  ].map(([slug, titleBn, titleEn, unit]) => ({
    slug, titleBn, titleEn,
    descriptionBn: `${titleBn} — বাংলাদেশের জমির মাপ রূপান্তর করুন: শতাংশ, কাঠা, বিঘা, একর, বর্গফুট। ${LAND_NOTE}`,
    category: 'bangladesh', keywords: `${titleEn}, ${titleBn}, জমির মাপ, শতাংশ কাঠা বিঘা`,
    popular: slug === 'land-calculator', kind: 'land', landUnit: unit,
    formula: '১ একর = ১০০ শতাংশ; ১ বিঘা = ৩৩ শতাংশ (ঢাকা মান); ১ কাঠা = ১.৬৫ শতাংশ; ১ শতাংশ = ৪৩৫.৬ বর্গফুট',
    example: '১ বিঘা = ৩৩ শতাংশ = ১৪,৪০০ বর্গফুট (প্রায়)',
    faq: [{ q: 'বিঘার মাপ কি সব জায়গায় এক?', a: 'না — ঢাকা মান ৩৩ শতাংশ, তবে বিভিন্ন অঞ্চলে বিঘা ৩৩–৩৩.০৬ শতাংশ বা আরও ভিন্ন হতে পারে। জমি কেনাবেচার আগে স্থানীয় মাপ যাচাই করুন।' }],
    fields: [], compute: null,
  })),
  {
    slug: 'bhori-to-gram-converter', titleBn: 'ভরি থেকে গ্রাম কনভার্টার', titleEn: 'Bhori to Gram Converter',
    descriptionBn: 'স্বর্ণের ভরি থেকে গ্রামে রূপান্তর করুন — ১ ভরি = ১১.৬৬৪ গ্রাম।',
    category: 'bangladesh', keywords: 'Bhori to Gram, ভরি গ্রাম, স্বর্ণের হিসাব',
    kind: 'generic', formula: 'গ্রাম = ভরি × ১১.৬৬৪',
    example: '২ ভরি = ২৩.৩২৮ গ্রাম',
    faq: [{ q: '১ ভরি কত গ্রাম?', a: '১১.৬৬৪ গ্রাম (আন্তর্জাতিক মান)।' }],
    fields: [N('bhori', 'ভরি', { step: 0.01, min: 0 })],
    compute: (inp) => { const r = bhoriToGram(inp.bhori); return res(`${inp.bhori} ভরি = ${r.gram} গ্রাম`, [D2('গ্রাম', String(r.gram)), D2('ভরি', String(inp.bhori))], [`${inp.bhori} × ১১.৬৬৪ = ${r.gram} গ্রাম`]) },
  },
  {
    slug: 'taka-to-poisha-converter', titleBn: 'টাকা থেকে পয়সা কনভার্টার', titleEn: 'Taka to Poisha Converter',
    descriptionBn: 'টাকা থেকে পয়সায় রূপান্তর করুন — ১ টাকা = ১০০ পয়সা।',
    category: 'bangladesh', keywords: 'Taka to Poisha, টাকা পয়সা, টাকা কনভার্টার',
    kind: 'generic', formula: 'পয়সা = টাকা × ১০০',
    example: '১০ টাকা = ১,০০০ পয়সা',
    faq: [{ q: '১ টাকায় কত পয়সা?', a: '১০০ পয়সা।' }],
    fields: [N('taka', 'টাকা', { step: 0.01, min: 0 })],
    compute: (inp) => { const p = takaToPoisha(inp.taka); return res(`${inp.taka} টাকা = ${p.toLocaleString('en-US')} পয়সা`, [D2('পয়সা', p.toLocaleString('en-US'))], [`${inp.taka} × ১০০ = ${p} পয়সা`]) },
  },

  // ---------- HEALTH ----------
  {
    slug: 'bmi-calculator', titleBn: 'BMI ক্যালকুলেটর', titleEn: 'BMI Calculator',
    descriptionBn: 'ওজন ও উচ্চতা দিয়ে BMI (Body Mass Index) বের করুন। এটি শিক্ষামূলক অনুমান, চিকিৎসা পরামর্শ নয়।',
    category: 'health', keywords: 'BMI Calculator, বিএমআই, ওজন হিসাব',
    popular: true, kind: 'generic', formula: 'BMI = ওজন (কেজি) ÷ উচ্চতা (মিটার)²',
    example: '৭০ কেজি, ১৭০ সেমি হলে BMI ২৪.২২ (স্বাভাবিক)',
    faq: [{ q: 'BMI কত হলে স্বাভাবিক?', a: '১৮.৫–২৪.৯ স্বাভাবিক, ২৫–২৯.৯ অতিরিক্ত ওজন, ৩০+ স্থূলতা। এটি সাধারণ নির্দেশিকা মাত্র।' }],
    fields: [N('weight', 'ওজন (কেজি)', { min: 1 }), N('height', 'উচ্চতা (সেমি)', { min: 1 })],
    compute: (inp) => { const r = bmi(inp.weight, inp.height); return res(`BMI ${r.bmi} — ${r.category}`, [D2('BMI', String(r.bmi)), D2('বিভাগ', r.category)], [`${inp.weight} ÷ (${Number(inp.height) / 100})² = ${r.bmi}`], 'শিক্ষামূলক অনুমান, চিকিৎসা পরামর্শ নয়') },
  },
  {
    slug: 'bmr-calculator', titleBn: 'BMR ক্যালকুলেটর', titleEn: 'BMR Calculator',
    descriptionBn: 'Mifflin-St Jeor সূত্রে আপনার BMR (বিশ্রামে দৈনিক ক্যালরি চাহিদা) বের করুন। শিক্ষামূলক অনুমান, চিকিৎসা পরামর্শ নয়।',
    category: 'health', keywords: 'BMR Calculator, বিএমআর, ক্যালরি চাহিদা',
    kind: 'generic', formula: 'পুরুষ: 10×ওজন + 6.25×উচ্চতা − 5×বয়স + 5; মহিলা: 10×ওজন + 6.25×উচ্চতা − 5×বয়স − 161',
    example: '৭০ কেজি, ১৭০ সেমি, ২৫ বছর, পুরুষ হলে BMR ≈ ১,৬৪৩ ক্যালরি/দিন',
    faq: [{ q: 'BMR কী?', a: 'সম্পূর্ণ বিশ্রামে শরীরের দৈনিক ক্যালরি খরচ।' }],
    fields: [N('weight', 'ওজন (কেজি)', { min: 1 }), N('height', 'উচ্চতা (সেমি)', { min: 1 }), N('age', 'বয়স (বছর)', { min: 1, max: 120 }), S('gender', 'লিঙ্গ', ['male', 'female'])],
    compute: (inp) => { const v = bmr({ weightKg: inp.weight, heightCm: inp.height, age: inp.age, gender: inp.gender }); return res(`BMR ≈ ${v.toLocaleString('en-US')} ক্যালরি/দিন`, [D2('BMR', `${v} ক্যালরি/দিন`)], [`Mifflin-St Jeor সূত্র প্রয়োগ করা হয়েছে`], 'শিক্ষামূলক অনুমান, চিকিৎসা পরামর্শ নয়') },
  },
  {
    slug: 'calorie-calculator', titleBn: 'ক্যালরি ক্যালকুলেটর', titleEn: 'Calorie Estimate Calculator',
    descriptionBn: 'আপনার দৈনিক ক্যালরি চাহিদার অনুমান করুন — BMR ও কর্মকাণ্ডের স্তর দিয়ে। শিক্ষামূলক অনুমান, চিকিৎসা পরামর্শ নয়।',
    category: 'health', keywords: 'Calorie Calculator, ক্যালরি হিসাব, দৈনিক ক্যালরি',
    kind: 'generic', formula: 'দৈনিক ক্যালরি = BMR × কর্মকাণ্ড গুণক (১.২–১.৯)',
    example: 'BMR ১,৬৪৩, মাঝারি কর্মকাণ্ড (১.৫৫) হলে দৈনিক ≈ ২,৫৪৭ ক্যালরি',
    faq: [{ q: 'কর্মকাণ্ডের স্তর কী?', a: 'বসে থাকা ১.২, হালকা ১.৩৭৫, মাঝারি ১.৫৫, সক্রিয় ১.৭২৫, খুব সক্রিয় ১.৯।' }],
    fields: [N('weight', 'ওজন (কেজি)', { min: 1 }), N('height', 'উচ্চতা (সেমি)', { min: 1 }), N('age', 'বয়স (বছর)', { min: 1, max: 120 }), S('gender', 'লিঙ্গ', ['male', 'female']), S('activity', 'কর্মকাণ্ডের স্তর', ['sedentary', 'light', 'moderate', 'active', 'veryActive'])],
    compute: (inp) => { const b = bmr({ weightKg: inp.weight, heightCm: inp.height, age: inp.age, gender: inp.gender }); const c = calorieEstimate(b, inp.activity); return res(`দৈনিক ≈ ${c.toLocaleString('en-US')} ক্যালরি`, [D2('BMR', `${b} ক্যালরি/দিন`), D2('দৈনিক চাহিদা', `${c} ক্যালরি/দিন`)], [`BMR ${b} × কর্মকাণ্ড গুণক = ${c}`], 'শিক্ষামূলক অনুমান, চিকিৎসা পরামর্শ নয়') },
  },
  {
    slug: 'water-intake-calculator', titleBn: 'পানি পানের হিসাব ক্যালকুলেটর', titleEn: 'Water Intake Calculator',
    descriptionBn: 'ওজন অনুযায়ী দৈনিক কত পানি পান করা উচিত, তার অনুমান করুন। শিক্ষামূলক অনুমান, চিকিৎসা পরামর্শ নয়।',
    category: 'health', keywords: 'Water Intake, পানি পান, দৈনিক পানি',
    kind: 'generic', formula: 'পানি (লিটার) = ওজন (কেজি) × ০.০৩৫ + ব্যায়াম (মিনিট) × ০.০১২',
    example: '৭০ কেজি হলে ≈ ২.৪৫ লিটার/দিন',
    faq: [{ q: 'এই পরিমাণ কি সবার জন্য?', a: 'না — আবহাওয়া, ব্যায়াম ও স্বাস্থ্যভেদে চাহিদা বদলায়।' }],
    fields: [N('weight', 'ওজন (কেজি)', { min: 1 }), N('activity', 'দৈনিক ব্যায়াম (মিনিট)', { min: 0, defaultValue: 0 })],
    compute: (inp) => { const w = waterIntake(inp.weight, inp.activity || 0); return res(`দৈনিক ≈ ${w} লিটার পানি`, [D2('পানি', `${w} লিটার/দিন`), D2('গ্লাস (২৫০ মি.লি.)', String(Math.round(w * 4)))], [`${inp.weight} × ০.০৩৫ = ${w} লিটার`], 'শিক্ষামূলক অনুমান, চিকিৎসা পরামর্শ নয়') },
  },

  // ---------- MATHEMATICS / GEOMETRY ----------
  {
    slug: 'triangle-area-calculator', titleBn: 'ত্রিভুজের ক্ষেত্রফল ক্যালকুলেটর', titleEn: 'Triangle Area Calculator',
    descriptionBn: 'ত্রিভুজের ভূমি ও উচ্চতা দিয়ে ক্ষেত্রফল বের করুন।',
    category: 'mathematics', keywords: 'Triangle Area, ত্রিভুজের ক্ষেত্রফল',
    kind: 'generic', formula: 'ক্ষেত্রফল = (ভূমি × উচ্চতা) ÷ ২',
    example: 'ভূমি ১০, উচ্চতা ৫ হলে ক্ষেত্রফল ২৫ বর্গ একক',
    faq: [{ q: 'একক কী হবে?', a: 'ভূমি ও উচ্চতা যে এককে দেবেন, ক্ষেত্রফল সেই এককের বর্গ হবে।' }],
    fields: [N('base', 'ভূমি', { min: 0.01 }), N('height', 'উচ্চতা', { min: 0.01 })],
    compute: (inp) => { const a = triangleArea(inp.base, inp.height); return res(`ক্ষেত্রফল ${a} বর্গ একক`, [D2('ক্ষেত্রফল', String(a))], [`(${inp.base} × ${inp.height}) ÷ ২ = ${a}`]) },
  },
  {
    slug: 'circle-area-calculator', titleBn: 'বৃত্তের ক্ষেত্রফল ক্যালকুলেটর', titleEn: 'Circle Area Calculator',
    descriptionBn: 'বৃত্তের ব্যাসার্ধ দিয়ে ক্ষেত্রফল ও পরিধি বের করুন।',
    category: 'mathematics', keywords: 'Circle Area, বৃত্তের ক্ষেত্রফল, পরিধি',
    kind: 'generic', formula: 'ক্ষেত্রফল = πr²; পরিধি = 2πr',
    example: 'ব্যাসার্ধ ৭ হলে ক্ষেত্রফল ≈ ১৫৩.৯৪, পরিধি ≈ ৪৩.৯৮',
    faq: [{ q: 'π এর মান কত ধরা হয়?', a: '৩.১৪১৫৯২৬৫... (জাভাস্ক্রিপ্টের Math.PI)।' }],
    fields: [N('radius', 'ব্যাসার্ধ', { min: 0.01 })],
    compute: (inp) => { const a = circleArea(inp.radius); const c = circleCircumference(inp.radius); return res(`ক্ষেত্রফল ${a} বর্গ একক`, [D2('ক্ষেত্রফল', String(a)), D2('পরিধি', String(c))], [`π × ${inp.radius}² = ${a}`]) },
  },
  {
    slug: 'rectangle-area-calculator', titleBn: 'আয়তক্ষেত্রের ক্ষেত্রফল ক্যালকুলেটর', titleEn: 'Rectangle Area Calculator',
    descriptionBn: 'আয়তক্ষেত্রের দৈর্ঘ্য ও প্রস্থ দিয়ে ক্ষেত্রফল ও পরিসীমা বের করুন।',
    category: 'mathematics', keywords: 'Rectangle Area, আয়তক্ষেত্রের ক্ষেত্রফল',
    kind: 'generic', formula: 'ক্ষেত্রফল = দৈর্ঘ্য × প্রস্থ; পরিসীমা = 2 × (দৈর্ঘ্য + প্রস্থ)',
    example: 'দৈর্ঘ্য ১০, প্রস্থ ৫ হলে ক্ষেত্রফল ৫০, পরিসীমা ৩০',
    faq: [{ q: 'বর্গক্ষেত্রের জন্য?', a: 'বর্গক্ষেত্রের আলাদা ক্যালকুলেটর আছে — সেখানে এক বাহুই যথেষ্ট।' }],
    fields: [N('length', 'দৈর্ঘ্য', { min: 0.01 }), N('width', 'প্রস্থ', { min: 0.01 })],
    compute: (inp) => { const a = rectangleArea(inp.length, inp.width); const p = rectanglePerimeter(inp.length, inp.width); return res(`ক্ষেত্রফল ${a} বর্গ একক`, [D2('ক্ষেত্রফল', String(a)), D2('পরিসীমা', String(p))], [`${inp.length} × ${inp.width} = ${a}`]) },
  },
  {
    slug: 'square-area-calculator', titleBn: 'বর্গক্ষেত্রের ক্ষেত্রফল ক্যালকুলেটর', titleEn: 'Square Area Calculator',
    descriptionBn: 'বর্গক্ষেত্রের এক বাহু দিয়ে ক্ষেত্রফল ও পরিসীমা বের করুন।',
    category: 'mathematics', keywords: 'Square Area, বর্গক্ষেত্রের ক্ষেত্রফল',
    kind: 'generic', formula: 'ক্ষেত্রফল = বাহু²; পরিসীমা = 4 × বাহু',
    example: 'বাহু ৬ হলে ক্ষেত্রফল ৩৬, পরিসীমা ২৪',
    faq: [{ q: 'বাহু কত হলে ক্ষেত্রফল ১০০?', a: 'বাহু ১০ হলে ক্ষেত্রফল ১০০।' }],
    fields: [N('side', 'বাহুর দৈর্ঘ্য', { min: 0.01 })],
    compute: (inp) => { const a = squareArea(inp.side); return res(`ক্ষেত্রফল ${a} বর্গ একক`, [D2('ক্ষেত্রফল', String(a)), D2('পরিসীমা', String(Math.round(Number(inp.side) * 4 * 100) / 100))], [`${inp.side}² = ${a}`]) },
  },
  {
    slug: 'pythagorean-calculator', titleBn: 'পিথাগোরাস ক্যালকুলেটর', titleEn: 'Pythagorean Calculator',
    descriptionBn: 'সমকোণী ত্রিভুজের অতিভুজ বা বাহু বের করুন — পিথাগোরাসের উপপাদ্য দিয়ে।',
    category: 'mathematics', keywords: 'Pythagorean, পিথাগোরাস, অতিভুজ',
    kind: 'generic', formula: 'c² = a² + b² (c = অতিভুজ)',
    example: 'বাহু ৩ ও ৪ হলে অতিভুজ ৫',
    faq: [{ q: 'কোন বাহু বের করবেন?', a: 'নিচে বেছে নিন — অতিভুজ নাকি অন্য বাহু।' }],
    fields: [S('mode', 'কী বের করবেন?', ['hypotenuse', 'leg']), N('a', 'প্রথম বাহু', { min: 0.01 }), N('b', 'দ্বিতীয় বাহু / অতিভুজ', { min: 0.01 })],
    compute: (inp) => {
      if (inp.mode === 'hypotenuse') { const c = pythagHypotenuse(inp.a, inp.b); return res(`অতিভুজ ${c}`, [D2('অতিভুজ', String(c))], [`√(${inp.a}² + ${inp.b}²) = ${c}`]) }
      const l = pythagLeg(inp.b, inp.a); return res(`বাহু ${l}`, [D2('বাহু', String(l))], [`√(${inp.b}² − ${inp.a}²) = ${l}`])
    },
  },
  {
    slug: 'volume-calculator', titleBn: 'আয়তন ক্যালকুলেটর', titleEn: 'Volume Calculator',
    descriptionBn: 'বাক্স, সিলিন্ডার ও গোলকের আয়তন বের করুন।',
    category: 'mathematics', keywords: 'Volume Calculator, আয়তন, ঘনফল',
    kind: 'generic', formula: 'বাক্স: দৈর্ঘ্য×প্রস্থ×উচ্চতা; সিলিন্ডার: πr²h; গোলক: (4/3)πr³',
    example: 'বাক্স ২×৩×৪ হলে আয়তন ২৪ ঘন একক',
    faq: [{ q: 'কোন আকৃতি?', a: 'নিচে আকৃতি বেছে নিন।' }],
    fields: [S('shape', 'আকৃতি', ['box', 'cylinder', 'sphere']), N('l', 'দৈর্ঘ্য / ব্যাসার্ধ', { min: 0.01 }), N('w', 'প্রস্থ (শুধু বাক্স)', { min: 0 }), N('h', 'উচ্চতা (বাক্স/সিলিন্ডার)', { min: 0 })],
    compute: (inp) => {
      if (inp.shape === 'box') { const v = boxVolume(inp.l, inp.w, inp.h); return res(`আয়তন ${v} ঘন একক`, [D2('আয়তন', String(v))], [`${inp.l} × ${inp.w} × ${inp.h} = ${v}`]) }
      if (inp.shape === 'cylinder') { const v = cylinderVolume(inp.l, inp.h); return res(`আয়তন ${v} ঘন একক`, [D2('আয়তন', String(v))], [`π × ${inp.l}² × ${inp.h} = ${v}`]) }
      const v = sphereVolume(inp.l); return res(`আয়তন ${v} ঘন একক`, [D2('আয়তন', String(v))], [`(4/3) × π × ${inp.l}³ = ${v}`])
    },
  },
  {
    slug: 'perimeter-calculator', titleBn: 'পরিসীমা ক্যালকুলেটর', titleEn: 'Perimeter Calculator',
    descriptionBn: 'আয়তক্ষেত্রের পরিসীমা বের করুন — দৈর্ঘ্য ও প্রস্থ দিয়ে।',
    category: 'mathematics', keywords: 'Perimeter Calculator, পরিসীমা',
    kind: 'generic', formula: 'পরিসীমা = 2 × (দৈর্ঘ্য + প্রস্থ)',
    example: 'দৈর্ঘ্য ১০, প্রস্থ ৫ হলে পরিসীমা ৩০',
    faq: [{ q: 'বৃত্তের পরিধি?', a: 'বৃত্তের ক্ষেত্রফল ক্যালকুলেটরে পরিধিও দেখানো হয়।' }],
    fields: [N('length', 'দৈর্ঘ্য', { min: 0.01 }), N('width', 'প্রস্থ', { min: 0.01 })],
    compute: (inp) => { const p = rectanglePerimeter(inp.length, inp.width); const a = rectangleArea(inp.length, inp.width); return res(`পরিসীমা ${p} একক`, [D2('পরিসীমা', String(p)), D2('ক্ষেত্রফল', String(a))], [`2 × (${inp.length} + ${inp.width}) = ${p}`]) },
  },
)

export function getCalculator(slug) { return calculators.find((c) => c.slug === slug) }
export function byCategory(id) { return calculators.filter((c) => c.category === id) }
export function popularCalculators() { return calculators.filter((c) => c.popular) }
export function searchCalculators(q) {
  const s = String(q || '').trim().toLowerCase()
  if (!s) return calculators
  return calculators.filter((c) => `${c.titleBn} ${c.titleEn} ${c.descriptionBn} ${c.keywords}`.toLowerCase().includes(s))
}
export function relatedCalculators(slug, n = 4) {
  const cur = getCalculator(slug)
  if (!cur) return []
  const same = calculators.filter((c) => c.category === cur.category && c.slug !== slug)
  const rest = calculators.filter((c) => c.category !== cur.category)
  return [...same, ...rest].slice(0, n)
}
