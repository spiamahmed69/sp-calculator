# SP Calculator — সব হিসাব, একটি প্ল্যাটফর্মে।

বাংলা ভাষার All-in-One অনলাইন ক্যালকুলেটর প্ল্যাটফর্ম। **৮২টি ক্যালকুলেটর**, ১১টি ক্যাটাগরি — GPA, CGPA, Scientific, Age, EMI, Percentage, Unit Converter, জমির মাপসহ সব হিসাব বিনামূল্যে, রেজিস্ট্রেশন ছাড়াই।

লাইভ (এখনো ডিপ্লয় করা হয়নি — নিচের নির্দেশনা দেখুন): https://sp-calculator.vercel.app

## প্রযুক্তি

- React 19 + Vite 8 + Tailwind CSS v4 (`@tailwindcss/vite`)
- react-router-dom v7, framer-motion, lucide-react, recharts, date-fns, vitest
- হোস্টিং: Vercel (SPA rewrites সহ), ডেটাবেস নেই; পছন্দ/ইতিহাস localStorage-এ

## চালানো

```bash
cd sp-calculator
npm install        # এই VM-এ npm 10.9.4-এ একটি রেজোলভার বাগ ("edgesOut") দেখা গেছে;
bun install        #   তাই এখানে bun install দিয়ে ইনস্টল করা হয়েছে — Vercel-এ npm install ব্যবহার করুন,
npm test           #   সমস্যা হলে Vercel-এ Install Command হিসেবে `bun install` বসান।
npm run dev        # http://localhost:5173
npm run build      # sitemap তৈরি করে তারপর প্রোডাকশন বিল্ড
npm run preview    # প্রোডাকশন আউটপুট পরীক্ষা
```

## ডিপ্লয় (Vercel)

1. GitHub-এ রিপো তৈরি করে এই ফোল্ডারের ফাইলগুলো পুশ করুন (`git init && git add . && git commit -m "SP Calculator v1" && git remote add origin … && git push -u origin main`)।
2. Vercel → Add New Project → রিপো ইমপোর্ট করুন। Framework: Vite, Build Command: `npm run build`, Output: `dist`।
3. `vercel.json` ইতিমধ্যে SPA rewrite দেয়, তাই `/ssc-gpa-calculator` এর মতো ডিপ লিংক রিফ্রেশ করলেও কাজ করে।
4. কাস্টম ডোমেইন থাকলে Vercel-এ যোগ করুন; তারপর `src/data/calculators.js`-এর `SITE_URL`, `public/robots.txt`, `index.html`-এর canonical/OG URL গুলো সেই ডোমেইনে বদলে `npm run build` আবার চালান।

## Google Search Console

1. Search Console (search.google.com/search-console) → সম্পত্তি যোগ করুন (ডোমেইন বা URL prefix)।
2. যাচাইকরণ: HTML ট্যাগ পদ্ধতি বেছে নিলে দেওয়া `content="…"` টোকেনটি `index.html`-এর `<head>`-এ বসান। **কোনো যাচাইকরণ কোড এখানে আগে থেকে বসানো নেই — আসল কোড Search Console থেকেই নিতে হবে।**
3. Sitemap জমা দিন: `https://sp-calculator.vercel.app/sitemap.xml` (এটি `src/data/calculators.js` রেজিস্ট্রি থেকে প্রতিটি বিল্ডে তৈরি হয় — ৯১টি URL: হোম + ৮টি স্ট্যাটিক পাতা + ৮২টি ক্যালকুলেটর)।
4. URL Inspection দিয়ে কয়েকটি ক্যালকুলেটর পাতা পরীক্ষা করুন; Indexing রিপোর্টে নিয়মিত নজর রাখুন।
5. Google Analytics 4 (ঐচ্ছিক): `VITE_GA_MEASUREMENT_ID` এনভায়রনমেন্ট ভেরিয়েবল বসালে তবেই ট্র্যাকিং চালু হবে — ডিফল্টভাবে কোনো ট্র্যাকিং নেই।

**কোনো র‍্যাঙ্কিংয়ের নিশ্চয়তা দেওয়া হয় না** — শুধু সৎ SEO অনুশীলন (সাইটম্যাপ, robots.txt, ক্যানোনিকাল, JSON-LD, সেমান্টিক HTML, একটিমাত্র H1, আসল অভ্যন্তরীণ লিংক) করা হয়েছে।

## ক্যালকুলেটর তালিকা (৮২টি)

| ক্যাটাগরি | সংখ্যা | ক্যালকুলেটর |
|---|---|---|
| শিক্ষা | ১০ | SSC/HSC/JSC/দাখিল/আলিম GPA, SSC/HSC গ্রেড, ভোকেশনাল GPA, নম্বর→GPA, গ্রেড→GPA |
| বিশ্ববিদ্যালয় | ১০ | NU CGPA, অনার্স, ডিগ্রি, মাস্টার্স, সেমিস্টার GPA, ক্রেডিটভিত্তিক, ইউনিভার্সাল CGPA, টার্গেট CGPA, GPA→CGPA, CGPA→শতাংশ |
| বিটিইবি/ডিপ্লোমা | ৪ | ডিপ্লোমা ইঞ্জিনিয়ারিং CGPA, ডিপ্লোমা সেমিস্টার GPA, HSC ভোকেশনাল GPA, BTEB গ্রেড |
| ক্যারিয়ার | ৩ | BCS বয়স, সরকারি চাকরির বয়স, চাকরির যোগ্যতা বয়স |
| বৈজ্ঞানিক | ১১ | বেসিক, সায়েন্টিফিক, শতাংশ, ভগ্নাংশ, বর্গমূল, ঘাত, লগারিদম, ম্যাট্রিক্স (২×২), সমীকরণ সমাধান, গড়, অনুপাত |
| আর্থিক | ৯ | EMI (চার্টসহ), ঋণ, সরল সুদ, চক্রবৃদ্ধি সুদ, লাভ-ক্ষতি, ডিসকাউন্ট, ভ্যাট, ট্যাক্স, সঞ্চয় |
| তারিখ ও সময় | ৭ | বয়স, তারিখের পার্থক্য, দিন, তারিখ যোগ-বিয়োগ, সময়, কাউন্টডাউন, কর্মদিবস |
| একক রূপান্তর | ৯ | দৈর্ঘ্য, ওজন, তাপমাত্রা, ক্ষেত্রফল, আয়তন, গতি, সময়, ডিজিটাল স্টোরেজ + সর্বজনীন কনভার্টার |
| বাংলাদেশ বিশেষ | ৮ | জমির মাপ, শতাংশ, কাঠা, বিঘা, একর, বর্গফুট, ভরি→গ্রাম, টাকা→পয়সা |
| স্বাস্থ্য | ৪ | BMI, BMR, ক্যালরি, পানি পানের হিসাব |
| গণিত ও জ্যামিতি | ৭ | ত্রিভুজ/বৃত্ত/আয়তক্ষেত্র/বর্গক্ষেত্রের ক্ষেত্রফল, পিথাগোরাস, আয়তন, পরিসীমা |

সব ক্যালকুলেটর `src/data/calculators.js` রেজিস্ট্রি থেকে চলে — নতুন ক্যালকুলেটর যোগ করতে শুধু রেজিস্ট্রিতে একটি এন্ট্রি যোগ করুন; নেভিগেশন, সার্চ ও সাইটম্যাপ নিজে থেকে তৈরি হয়।

## নিয়ম ও সতর্কতা (পাতায়ও দেখানো হয়)

- **বোর্ড গ্রেডিং:** A+ ৫.০ (৮০–১০০), A ৪.০ (৭০–৭৯), A- ৩.৫ (৬০–৬৯), B ৩.০ (৫০–৫৯), C ২.০ (৪০–৪৯), D ১.০ (৩৩–৩৯), F ০ (০–৩২)। ঐচ্ছিক (৪র্থ) বিষয়ে ২.০-এর বেশি পয়েন্টের অতিরিক্ত অংশই যোগ হয় — বোর্ডের প্রচলিত নিয়ম।
- **CGPA:** জাতীয় বিশ্ববিদ্যালয়ের প্রচলিত ৪.০ স্কেল (A+ ৪.০, A ৩.৭৫, A- ৩.৫, B+ ৩.২৫, B ৩.০)।
- **জমি:** ১ একর = ১০০ শতাংশ; ১ বিঘা = ৩৩ শতাংশ (ঢাকা মান); ১ কাঠা = ১.৬৫ শতাংশ; ১ শতাংশ = ৪৩৫.৬ বর্গফুট। বিঘার মাপ অঞ্চলভেদে ভিন্ন (৩৩–৩৩.০৬ শতাংশ) — কেনাবেচার আগে স্থানীয় মাপ যাচাই করুন।
- **ক্যারিয়ার:** BCS/সরকারি চাকরির বয়সসীমা ৩২ বছর "বর্তমান নিয়ম অনুযায়ী" লেখা; আবেদনের আগে সর্বশেষ সার্কুলার দেখুন।
- **ভ্যাট/ট্যাক্স:** হার ব্যবহারকারী নিজে বসান (ডিফল্ট ১৫% শুধু উদাহরণ) — কোনো হার অফিসিয়াল হিসেবে ধরা হয়নি।
- **স্বাস্থ্য:** সব ফলাফল "শিক্ষামূলক অনুমান, চিকিৎসা পরামর্শ নয়"।
- **সায়েন্টিফিক ক্যালকুলেটর:** নিরাপদ shunting-yard পার্সার — `eval()`/`Function()` কোথাও ব্যবহার করা হয়নি।

## SEO বাস্তবায়ন

- হোমপেজ title/description (ব্রিফের নির্ধারিত লেখা), প্রতি রুটে title/meta/canonical (Seo কম্পোনেন্ট), JSON-LD WebSite + Organization + WebPage + BreadcrumbList, FAQ থাকলে FAQPage।
- `public/robots.txt`, `public/sitemap.xml` (রেজিস্ট্রি থেকে জেনারেটেড), `favicon.svg`, `logo.svg`, `og.svg`, `manifest.webmanifest`।
- কোনো ভুয়া রেটিং/রিভিউ/ব্যবহারকারী সংখ্যা নেই।
- **সীমা:** পাতাগুলো ক্লায়েন্ট-রেন্ডারড React (SPA)। প্রতিটি পাতার মেটাডেটা রুট বদলের সঙ্গে সঙ্গে আপডেট হয়, তবে সার্চ ইঞ্জিনের জন্য পূর্ণ prerendering/static generation এখনো করা হয়নি — ভবিষ্যৎ ধাপ (Vite prerender প্লাগইন বা SSG)।

## পরীক্ষা (Vitest)

`src/lib/calc/calc.test.js` — ৩৯টি টেস্ট, সব পাস:

- GPA (ঐচ্ছিক বিষয়ের নিয়মসহ), CGPA (ক্রেডিট-ওজন), EMI (১,০০,০০০ টাকা, ১২%, ১২ মাস → EMI ৳৮,৮৮৪.৮৮, মোট সুদ ৳৬,৬১৮.৫৫)
- সায়েন্টিফিক পার্সার (2+3*4=14, বন্ধনী, sqrt/log, শূন্যে ভাগে ত্রুটি, eval-বিরোধী ইনপুটে ত্রুটি), দ্বিঘাত সমীকরণ, ম্যাট্রিক্স গুণ
- বয়স/তারিখের পার্থক্য/কর্মদিবস, একক ও জমির রূপান্তর, ভরি, BMI/BMR, জ্যামিতি

চালান: `npm test`

## যাচাইকৃত ফলাফল

- `npm test`: ৩৯/৩৯ পাস
- `npm run build`: সফল (dist/index.html ২.৫৮ kB; JS বান্ডেল ৮১৩ kB — রিচার্টস/ফ্রেমার-মোশনসহ একটিমাত্র চাংক; কোড-স্প্লিটিং ভবিষ্যৎ অপ্টিমাইজেশন)
- `vite preview` + curl: `/` ২০০, `/ssc-gpa-calculator` ২০০, `/sitemap.xml` ২০০, `/robots.txt` ২০০, অজানা রুটে কাস্টম ৪০৪ কনটেন্ট (SPA ফলব্যাক হিসেবে index.html ২০০ দেয় — SPA-এর স্বাভাবিক আচরণ)
- কোনো lorem ipsum নেই; সব বাংলা কনটেন্ট মৌলিক

## ফোল্ডার কাঠামো

```
src/
  lib/calc/      # বিশুদ্ধ হিসাব ফাংশন + টেস্ট (gpa, finance, scientific, dates, units, land, health, geometry)
  lib/storage.js # localStorage: প্রিয়, ইতিহাস, থিম
  data/calculators.js  # একমাত্র রেজিস্ট্রি (৮২টি ক্যালকুলেটর)
  components/    # Layout, CalculatorShell, SpecialCalculators, Seo, Toast
  pages/         # Home, AllCalculators, Categories, Favorites, History, CalculatorPage, Static, NotFound
public/          # favicon.svg, logo.svg, og.svg, robots.txt, sitemap.xml (জেনারেটেড), manifest, _redirects
scripts/generate-sitemap.mjs
```
