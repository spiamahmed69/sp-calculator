import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Calculator, GraduationCap, BookOpen, Wrench, Briefcase, FlaskConical, Wallet, CalendarDays, ArrowLeftRight, MapPin, HeartPulse, Shapes, Star, ChevronDown, Sparkles, ShieldCheck, Zap, Globe } from 'lucide-react'
import Seo from '../components/Seo.jsx'
import { CATEGORIES, calculators, popularCalculators, searchCalculators } from '../data/calculators.js'

const ICONS = { GraduationCap, BookOpen, Wrench, Briefcase, FlaskConical, Wallet, CalendarDays, ArrowLeftRight, MapPin, HeartPulse, Shapes }
const SUGGESTIONS = ['GPA Calculator', 'Scientific Calculator', 'Age Calculator', 'EMI Calculator']

export default function Home() {
  const [q, setQ] = useState('')
  const [openFaq, setOpenFaq] = useState(null)
  const navigate = useNavigate()
  const results = q.trim() ? searchCalculators(q).slice(0, 6) : []
  const popular = popularCalculators()
  const go = (e) => { e.preventDefault(); if (q.trim()) navigate(`/calculators?q=${encodeURIComponent(q.trim())}`) }
  const faqs = [
    { q: 'SP Calculator কি সম্পূর্ণ বিনামূল্যে?', a: 'হ্যাঁ — সব ক্যালকুলেটর রেজিস্ট্রেশন ছাড়াই বিনামূল্যে ব্যবহার করা যায়।' },
    { q: 'GPA কীভাবে হিসাব করা হয়?', a: 'প্রতিটি বিষয়ের নম্বর থেকে গ্রেড পয়েন্ট বের করে গড় নেওয়া হয়। ঐচ্ছিক বিষয়ের ক্ষেত্রে ২.০ এর বেশি পয়েন্টের অতিরিক্ত অংশই শুধু যোগ হয়।' },
    { q: 'আমার তথ্য কি সংরক্ষণ করা হয়?', a: 'না — হিসাব আপনার ব্রাউজারেই হয়। প্রিয় ক্যালকুলেটর ও সাম্প্রতিক হিসাব শুধু আপনার ডিভাইসের localStorage-এ থাকে।' },
    { q: 'EMI ক্যালকুলেটরের সুদের হার কোথা থেকে নেব?', a: 'আপনার ব্যাংক বা ঋণদাতার দেওয়া বার্ষিক হার বসান। এখানে কোনো হার অফিসিয়াল হিসেবে ধরা হয়নি।' },
  ]
  return (
    <div>
      <Seo title="" description="SP Calculator হলো বাংলা ভাষার All-in-One Online Calculator Platform। এখানে GPA, CGPA, Scientific, Age, EMI, Percentage ও Unit Converterসহ প্রয়োজনীয় হিসাব করুন বিনামূল্যে।" slug="" />
      {/* Hero */}
      <section className="mt-6 text-center" aria-label="হিরো">
        <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-blue-700 dark:text-blue-300"><Sparkles className="h-4 w-4" /> বাংলা ভাষার All-in-One ক্যালকুলেটর</span>
        <h1 className="mx-auto mt-4 max-w-3xl text-3xl font-bold leading-snug sm:text-5xl">SP Calculator – সকল ধরনের অনলাইন ক্যালকুলেটর</h1>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-slate-600 dark:text-slate-300">শিক্ষা, বিজ্ঞান, গণিত, অর্থনীতি ও দৈনন্দিন জীবনের প্রয়োজনীয় হিসাব করুন সহজেই।</p>
        <form onSubmit={go} className="relative mx-auto mt-6 max-w-2xl" role="search">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="আপনি কোন হিসাবটি করতে চান?" aria-label="ক্যালকুলেটর খুঁজুন" className="min-h-[56px] w-full rounded-full border border-white/70 bg-white/80 py-3 pl-12 pr-4 text-base shadow-xl backdrop-blur dark:border-slate-600 dark:bg-slate-800/80" />
          {results.length > 0 && (
            <ul className="glass absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-2xl text-left shadow-xl">
              {results.map((c) => <li key={c.slug}><Link to={`/${c.slug}`} className="block min-h-[44px] px-4 py-3 hover:bg-blue-50 dark:hover:bg-slate-700">{c.titleBn} <span className="text-xs text-slate-500">— {c.titleEn}</span></Link></li>)}
            </ul>
          )}
        </form>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span className="text-sm text-slate-500">জনপ্রিয় খোঁজ:</span>
          {SUGGESTIONS.map((s) => <button key={s} type="button" onClick={() => navigate(`/calculators?q=${encodeURIComponent(s)}`)} className="glass min-h-[40px] rounded-full px-4 text-sm font-medium hover:shadow-md">{s}</button>)}
        </div>
        <div className="mx-auto mt-6 grid max-w-2xl grid-cols-3 gap-3 text-center">
          <div className="glass rounded-2xl p-3"><p className="text-2xl font-bold grad-text">{calculators.length}+</p><p className="text-xs text-slate-500">ক্যালকুলেটর</p></div>
          <div className="glass rounded-2xl p-3"><p className="text-2xl font-bold grad-text">{CATEGORIES.length}</p><p className="text-xs text-slate-500">ক্যাটাগরি</p></div>
          <div className="glass rounded-2xl p-3"><p className="text-2xl font-bold grad-text">১০০%</p><p className="text-xs text-slate-500">বিনামূল্যে</p></div>
        </div>
      </section>

      {/* Popular */}
      <section className="mt-12" aria-label="জনপ্রিয় ক্যালকুলেটর">
        <h2 className="text-xl font-bold sm:text-2xl">জনপ্রিয় ক্যালকুলেটর</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {popular.map((c, i) => (
            <Link key={c.slug} to={`/${c.slug}`} className={`glass rounded-3xl p-4 hover:shadow-xl ${i === 0 ? 'grad text-white' : ''}`}>
              <Calculator className="h-6 w-6" />
              <p className="mt-2 font-bold">{c.titleBn}</p>
              <p className={`mt-1 text-xs ${i === 0 ? 'text-white/80' : 'text-slate-500'}`}>{c.titleEn}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mt-12" aria-label="ক্যাটাগরি">
        <div className="flex items-center justify-between"><h2 className="text-xl font-bold sm:text-2xl">ক্যাটাগরি অনুযায়ী খুঁজুন</h2><Link to="/categories" className="text-sm font-medium text-blue-700 dark:text-blue-300">সব দেখুন →</Link></div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.map((cat) => {
            const Icon = ICONS[cat.icon] || Calculator
            const count = calculators.filter((c) => c.category === cat.id).length
            return (
              <Link key={cat.id} to={`/categories#${cat.id}`} className="glass rounded-3xl p-4 hover:shadow-xl">
                <span className="grad flex h-11 w-11 items-center justify-center rounded-2xl text-white"><Icon className="h-5 w-5" /></span>
                <p className="mt-3 font-bold">{cat.name}</p>
                <p className="mt-1 text-xs text-slate-500">{cat.desc}</p>
                <p className="mt-2 text-xs font-semibold text-blue-700 dark:text-blue-300">{count}টি ক্যালকুলেটর</p>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Featured */}
      <section className="mt-12" aria-label="বিশেষ টুল">
        <h2 className="text-xl font-bold sm:text-2xl">বিশেষ টুল</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { to: '/ssc-gpa-calculator', t: 'SSC GPA ক্যালকুলেটর', d: 'ঐচ্ছিক বিষয়ের নিয়মসহ নিখুঁত GPA' },
            { to: '/emi-calculator', t: 'EMI ক্যালকুলেটর', d: 'আসল বনাম সুদের চার্টসহ কিস্তি' },
            { to: '/land-calculator', t: 'জমির মাপ ক্যালকুলেটর', d: 'শতাংশ, কাঠা, বিঘা, একর — আঞ্চলিক নোটসহ' },
          ].map((f) => (
            <Link key={f.to} to={f.to} className="glass rounded-3xl p-5 hover:shadow-xl">
              <p className="font-bold">{f.t}</p><p className="mt-1 text-sm text-slate-500">{f.d}</p><p className="mt-3 text-sm font-semibold text-blue-700 dark:text-blue-300">এখনই ব্যবহার করুন →</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Recently added */}
      <section className="mt-12" aria-label="সম্প্রতি যোগ হয়েছে">
        <h2 className="text-xl font-bold sm:text-2xl">সম্প্রতি যোগ হয়েছে</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {calculators.slice(-8).map((c) => <Link key={c.slug} to={`/${c.slug}`} className="glass rounded-2xl p-4 text-sm font-medium hover:shadow-lg">{c.titleBn}</Link>)}
        </div>
      </section>

      {/* Why */}
      <section className="mt-12" aria-label="কেন SP Calculator">
        <h2 className="text-xl font-bold sm:text-2xl">কেন SP Calculator</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { icon: Zap, t: 'দ্রুত ও সহজ', d: 'কোনো রেজিস্ট্রেশন ছাড়াই মুহূর্তে হিসাব — মোবাইল ও ডেস্কটপে।' },
            { icon: Globe, t: 'বাংলা ভাষায়', d: 'সব নির্দেশনা, সূত্র ও উদাহরণ বাংলায় — শিক্ষার্থী থেকে ব্যবসায়ী সবার জন্য।' },
            { icon: ShieldCheck, t: 'স্বচ্ছ ও সৎ', d: 'কোনো ভুয়া ফলাফল নয়; সূত্র, ধাপ ও সীমাবদ্ধতা খোলাখুলিভাবে দেখানো হয়।' },
          ].map((w) => (
            <div key={w.t} className="glass rounded-3xl p-5"><w.icon className="h-6 w-6 text-blue-600" /><p className="mt-2 font-bold">{w.t}</p><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{w.d}</p></div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="glass mt-12 rounded-3xl p-5" aria-label="সাধারণ প্রশ্ন">
        <h2 className="text-xl font-bold">সাধারণ প্রশ্ন</h2>
        {faqs.map((f, i) => (
          <div key={i} className="mt-3 border-b border-slate-200 pb-3 last:border-0 dark:border-slate-700">
            <button type="button" onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i} className="flex min-h-[44px] w-full items-center justify-between gap-2 text-left font-medium">{f.q}<ChevronDown className={`h-5 w-5 shrink-0 ${openFaq === i ? 'rotate-180' : ''}`} /></button>
            {openFaq === i && <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{f.a}</p>}
          </div>
        ))}
      </section>
    </div>
  )
}
