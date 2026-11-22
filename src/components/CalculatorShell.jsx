import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Calculator, ChevronDown, Copy, RotateCcw, Share2, Star, CheckCircle2, AlertTriangle } from 'lucide-react'
import Seo from './Seo.jsx'
import { useToast } from './Toast.jsx'
import { addHistory, getFavorites, toggleFavorite } from '../lib/storage.js'
import { relatedCalculators } from '../data/calculators.js'
import { nuPoint } from '../lib/calc/gpa.js'

export const OPTION_LABELS = {
  male: 'পুরুষ', female: 'মহিলা', no: 'না', yes: 'হ্যাঁ',
  sedentary: 'বসে থাকা (কম)', light: 'হালকা', moderate: 'মাঝারি', active: 'সক্রিয়', veryActive: 'খুব সক্রিয়',
  hypotenuse: 'অতিভুজ', leg: 'অন্য বাহু', box: 'বাক্স', cylinder: 'সিলিন্ডার', sphere: 'গোলক',
  '1': 'বার্ষিক (১ বার)', '2': 'অর্ধবার্ষিক (২ বার)', '4': 'ত্রৈমাসিক (৪ বার)', '12': 'মাসিক (১২ বার)',
  '+': 'যোগ (+)', '-': 'বিয়োগ (−)', '*': 'গুণ (×)', '/': 'ভাগ (÷)',
}
const labelOf = (v) => OPTION_LABELS[String(v)] ?? String(v)

function GradeRows({ field, value, onChange }) {
  const rows = value || [{ name: '', marks: '', point: '', grade: 'A+', credit: 3, optional: false }]
  const set = (i, patch) => onChange(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)))
  return (
    <div className="space-y-2">
      {rows.map((r, i) => (
        <div key={i} className="grid grid-cols-2 gap-2 rounded-xl bg-white/70 p-2 dark:bg-slate-800/60 sm:grid-cols-[1fr_1fr_auto_auto]">
          <input aria-label={`বিষয় ${i + 1} এর নাম`} placeholder={`বিষয় ${i + 1}`} value={r.name} onChange={(e) => set(i, { name: e.target.value })} className="min-h-[44px] rounded-lg border border-slate-200 bg-white px-3 dark:border-slate-600 dark:bg-slate-900" />
          {field.mode === 'marks' && <input aria-label="নম্বর" type="number" min="0" max="100" placeholder="নম্বর (০–১০০)" value={r.marks} onChange={(e) => set(i, { marks: e.target.value })} className="min-h-[44px] rounded-lg border border-slate-200 bg-white px-3 dark:border-slate-600 dark:bg-slate-900" />}
          {field.mode === 'points' && <input aria-label="গ্রেড পয়েন্ট" type="number" min="0" max="5" step="0.25" placeholder="গ্রেড পয়েন্ট (০–৫)" value={r.point} onChange={(e) => set(i, { point: e.target.value })} className="min-h-[44px] rounded-lg border border-slate-200 bg-white px-3 dark:border-slate-600 dark:bg-slate-900" />}
          {field.mode === 'credit' && (
            <>
              <select aria-label="গ্রেড" value={r.grade} onChange={(e) => set(i, { grade: e.target.value })} className="min-h-[44px] rounded-lg border border-slate-200 bg-white px-3 dark:border-slate-600 dark:bg-slate-900">
                {['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'D', 'F'].map((g) => <option key={g} value={g}>{g} ({nuPoint(g)})</option>)}
              </select>
              <input aria-label="ক্রেডিট" type="number" min="0.5" step="0.5" placeholder="ক্রেডিট" value={r.credit} onChange={(e) => set(i, { credit: e.target.value })} className="min-h-[44px] rounded-lg border border-slate-200 bg-white px-3 dark:border-slate-600 dark:bg-slate-900" />
            </>
          )}
          <label className="col-span-2 flex min-h-[44px] items-center gap-2 text-sm sm:col-span-1">
            <input type="checkbox" checked={!!r.optional} onChange={(e) => set(i, { optional: e.target.checked })} className="h-5 w-5" /> ঐচ্ছিক (৪র্থ) বিষয়
          </label>
          <button type="button" onClick={() => onChange(rows.filter((_, j) => j !== i))} disabled={rows.length <= 1} className="min-h-[44px] rounded-lg bg-red-50 px-3 text-sm font-medium text-red-600 disabled:opacity-40 dark:bg-red-900/30">মুছুন</button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...rows, { name: '', marks: '', point: '', grade: 'A+', credit: 3, optional: false }])} className="min-h-[44px] w-full rounded-xl border-2 border-dashed border-blue-300 font-medium text-blue-700 dark:text-blue-300">+ বিষয় / কোর্স যোগ করুন</button>
      <p className="text-xs text-slate-500">ঐচ্ছিক বিষয় টিক দিলে তার ২.০ এর বেশি পয়েন্টের অতিরিক্ত অংশই শুধু যোগ হবে।</p>
    </div>
  )
}

export function ResultPanel({ result, calc }) {
  const toast = useToast()
  if (!result) return null
  const copyText = `${calc.titleBn}: ${result.headline}${result.details ? '\n' + result.details.map((d) => `${d.label}: ${d.value}`).join('\n') : ''}`
  const copy = async () => {
    try { await navigator.clipboard.writeText(copyText); toast('ফলাফল কপি হয়েছে') } catch { toast('কপি করা যায়নি') }
  }
  const share = async () => {
    if (navigator.share) { try { await navigator.share({ title: calc.titleBn, text: copyText, url: window.location.href }) } catch { /* dismissed */ } }
    else { await copy(); toast('শেয়ার সমর্থিত নয় — লিংক কপি করা হয়েছে') }
  }
  return (
    <section aria-label="ফলাফল" className="mt-6 rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-500 to-violet-500 p-5 text-white shadow-xl">
      <p className="flex items-center gap-2 text-sm font-medium opacity-90"><CheckCircle2 className="h-5 w-5" /> ফলাফল</p>
      <p className="mt-2 text-2xl font-bold sm:text-3xl">{result.headline}</p>
      {result.sub && <p className="mt-2 flex items-start gap-2 rounded-xl bg-white/15 p-3 text-sm"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />{result.sub}</p>}
      {result.details && (
        <dl className="mt-4 space-y-2">
          {result.details.map((d) => (
            <div key={d.label} className="flex items-center justify-between gap-3 rounded-lg bg-white/15 px-3 py-2 text-sm">
              <dt>{d.label}</dt><dd className="font-bold">{d.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {result.steps && result.steps.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-semibold opacity-90">হিসাবের ধাপ</p>
          <ol className="mt-1 list-decimal space-y-1 pl-5 text-sm">{result.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
        </div>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={copy} className="flex min-h-[44px] items-center gap-2 rounded-full bg-white px-4 font-semibold text-blue-700"><Copy className="h-4 w-4" /> ফলাফল কপি</button>
        <button type="button" onClick={share} className="flex min-h-[44px] items-center gap-2 rounded-full bg-white/20 px-4 font-semibold text-white"><Share2 className="h-4 w-4" /> শেয়ার করুন</button>
      </div>
    </section>
  )
}

export default function CalculatorShell({ calc, children }) {
  const toast = useToast()
  const [inputs, setInputs] = useState(() => {
    const init = {}
    for (const f of calc.fields || []) {
      if (f.type === 'gradeRows') init[f.key] = [{ name: '', marks: '', point: '', grade: 'A+', credit: 3, optional: false }]
      else if (f.type === 'select') init[f.key] = f.options[0]
      else if (f.defaultValue != null) init[f.key] = f.defaultValue
      else init[f.key] = ''
    }
    return init
  })
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [openFaq, setOpenFaq] = useState(null)
  const [fav, setFav] = useState(() => getFavorites().includes(calc.slug))
  const related = useMemo(() => relatedCalculators(calc.slug), [calc.slug])

  const set = (key, value) => setInputs((p) => ({ ...p, [key]: value }))
  const calculate = (e) => {
    e?.preventDefault()
    setError('')
    try {
      const prepared = { ...inputs }
      for (const f of calc.fields || []) {
        if (f.type === 'gradeRows') {
          prepared[f.key] = (inputs[f.key] || []).filter((r) => r.marks !== '' || r.point !== '' || r.grade)
        }
      }
      const r = calc.compute(prepared)
      setResult(r)
      addHistory({ slug: calc.slug, title: calc.titleBn, summary: r.headline })
      toast('হিসাব সম্পন্ন হয়েছে')
    } catch (err) { setError(err.message || 'হিসাব করা যায়নি — তথ্য যাচাই করুন') }
  }
  const reset = () => {
    setInputs((p) => {
      const n = {}
      for (const f of calc.fields || []) {
        if (f.type === 'gradeRows') n[f.key] = [{ name: '', marks: '', point: '', grade: 'A+', credit: 3, optional: false }]
        else if (f.type === 'select') n[f.key] = f.options[0]
        else n[f.key] = f.defaultValue ?? ''
      }
      return n
    })
    setResult(null); setError('')
  }
  const toggleFav = () => { const next = toggleFavorite(calc.slug); setFav(next.includes(calc.slug)); toast(next.includes(calc.slug) ? 'প্রিয়তে যোগ হয়েছে' : 'প্রিয় থেকে সরানো হয়েছে') }

  return (
    <div>
      <Seo title={calc.titleBn} description={calc.descriptionBn} slug={calc.slug} faq={calc.faq} />
      <nav aria-label="ব্রেডক্রাম্ব" className="mt-4 text-sm text-slate-500">
        <Link to="/" className="text-blue-700 dark:text-blue-300">হোম</Link> / <Link to="/calculators" className="text-blue-700 dark:text-blue-300">ক্যালকুলেটর</Link> / {calc.titleBn}
      </nav>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">{calc.titleBn}</h1>
          <p className="mt-1 text-sm text-slate-500">{calc.titleEn}</p>
        </div>
        <button type="button" onClick={toggleFav} aria-pressed={fav} className={`flex min-h-[44px] items-center gap-2 rounded-full px-4 font-medium ${fav ? 'grad text-white' : 'glass'}`}>
          <Star className={`h-5 w-5 ${fav ? 'fill-white' : ''}`} /> {fav ? 'প্রিয়তে আছে' : 'প্রিয় করুন'}
        </button>
      </div>
      <p className="mt-3 text-slate-700 dark:text-slate-200">{calc.descriptionBn}</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <section className="glass rounded-3xl p-4 sm:p-6" aria-label="ইনপুট">
          <form onSubmit={calculate} className="space-y-4">
            {(calc.fields || []).map((f) => (
              <div key={f.key}>
                <label htmlFor={f.key} className="mb-1 block font-medium">{f.label}</label>
                {f.type === 'number' && <input id={f.key} type="number" inputMode="decimal" step={f.step ?? 'any'} min={f.min} max={f.max} placeholder={f.placeholder} value={inputs[f.key]} onChange={(e) => set(f.key, e.target.value)} required className="min-h-[48px] w-full rounded-xl border border-slate-200 bg-white px-4 dark:border-slate-600 dark:bg-slate-900" />}
                {f.type === 'text' && <input id={f.key} type="text" placeholder={f.placeholder} value={inputs[f.key]} onChange={(e) => set(f.key, e.target.value)} required className="min-h-[48px] w-full rounded-xl border border-slate-200 bg-white px-4 dark:border-slate-600 dark:bg-slate-900" />}
                {f.type === 'date' && <input id={f.key} type="date" value={inputs[f.key]} onChange={(e) => set(f.key, e.target.value)} required className="min-h-[48px] w-full rounded-xl border border-slate-200 bg-white px-4 dark:border-slate-600 dark:bg-slate-900" />}
                {f.type === 'select' && (
                  <select id={f.key} value={inputs[f.key]} onChange={(e) => set(f.key, e.target.value)} className="min-h-[48px] w-full rounded-xl border border-slate-200 bg-white px-4 dark:border-slate-600 dark:bg-slate-900">
                    {f.options.map((o) => <option key={String(o)} value={String(o)}>{labelOf(o)}</option>)}
                  </select>
                )}
                {f.type === 'gradeRows' && <GradeRows field={f} value={inputs[f.key]} onChange={(v) => set(f.key, v)} />}
              </div>
            ))}
            {children}
            {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700 dark:bg-red-900/30 dark:text-red-300">{error}</p>}
            <div className="flex flex-wrap gap-2">
              <button type="submit" className="grad flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-full px-6 font-bold text-white shadow-lg"><Calculator className="h-5 w-5" /> হিসাব করুন</button>
              <button type="button" onClick={reset} className="flex min-h-[48px] items-center gap-2 rounded-full bg-white/80 px-5 font-medium shadow-sm dark:bg-slate-800"><RotateCcw className="h-4 w-4" /> রিসেট</button>
            </div>
          </form>
          <ResultPanel result={result} calc={calc} />
        </section>

        <div className="space-y-4">
          <section className="glass rounded-3xl p-5" aria-label="সূত্র">
            <h2 className="font-bold">সূত্র</h2>
            <p className="mt-2 rounded-xl bg-blue-50 p-3 text-sm dark:bg-blue-900/30">{calc.formula}</p>
            <h3 className="mt-4 font-bold">উদাহরণ</h3>
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{calc.example}</p>
          </section>
          <section className="glass rounded-3xl p-5" aria-label="কীভাবে ব্যবহার করবেন">
            <h2 className="font-bold">কীভাবে ব্যবহার করবেন</h2>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-200">
              <li>প্রয়োজনীয় তথ্য উপরের ঘরগুলোতে বসান।</li>
              <li>“হিসাব করুন” চাপুন — ফলাফল ও ধাপগুলো দেখাবে।</li>
              <li>ফলাফল কপি বা শেয়ার করতে পারেন; প্রিয়তে রাখতে তারকা চাপুন।</li>
            </ol>
            <p className="mt-3 text-sm text-slate-500">সীমাবদ্ধতা: এই ক্যালকুলেটর প্রচলিত নিয়ম ও সূত্র অনুযায়ী হিসাব দেয়। অফিসিয়াল সিদ্ধান্তের আগে সংশ্লিষ্ট কর্তৃপক্ষের প্রকাশিত তথ্য মিলিয়ে নিন।</p>
          </section>
        </div>
      </div>

      {calc.faq && calc.faq.length > 0 && (
        <section className="glass mt-6 rounded-3xl p-5" aria-label="সাধারণ প্রশ্ন">
          <h2 className="text-lg font-bold">সাধারণ প্রশ্ন</h2>
          {calc.faq.map((f, i) => (
            <div key={i} className="mt-3 border-b border-slate-200 pb-3 last:border-0 dark:border-slate-700">
              <button type="button" onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i} className="flex min-h-[44px] w-full items-center justify-between gap-2 text-left font-medium">
                {f.q}<ChevronDown className={`h-5 w-5 shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === i && <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{f.a}</p>}
            </div>
          ))}
        </section>
      )}

      <section className="mt-6" aria-label="সম্পর্কিত ক্যালকুলেটর">
        <h2 className="text-lg font-bold">সম্পর্কিত ক্যালকুলেটর</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {related.map((c) => (
            <Link key={c.slug} to={`/${c.slug}`} className="glass rounded-2xl p-4 text-sm font-medium hover:shadow-lg">{c.titleBn}</Link>
          ))}
        </div>
      </section>
    </div>
  )
}
