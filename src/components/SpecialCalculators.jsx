import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Calculator, ChevronDown, Delete, Star } from 'lucide-react'
import Seo from './Seo.jsx'
import { ResultPanel } from './CalculatorShell.jsx'
import { useToast } from './Toast.jsx'
import { addHistory, getFavorites, toggleFavorite } from '../lib/storage.js'
import { relatedCalculators } from '../data/calculators.js'
import { evaluate, solveLinear, solveQuadratic, matrix2x2 } from '../lib/calc/scientific.js'
import { emi } from '../lib/calc/finance.js'
import { ageCalc } from '../lib/calc/dates.js'
import { UNIT_GROUPS, convertUnit } from '../lib/calc/units.js'
import { LAND_UNITS, convertLand, LAND_NOTE } from '../lib/calc/land.js'

function PageHead({ calc }) {
  const toast = useToast()
  const [fav, setFav] = useState(() => getFavorites().includes(calc.slug))
  return (
    <>
      <Seo title={calc.titleBn} description={calc.descriptionBn} slug={calc.slug} faq={calc.faq} />
      <nav aria-label="ব্রেডক্রাম্ব" className="mt-4 text-sm text-slate-500">
        <Link to="/" className="text-blue-700 dark:text-blue-300">হোম</Link> / <Link to="/calculators" className="text-blue-700 dark:text-blue-300">ক্যালকুলেটর</Link> / {calc.titleBn}
      </nav>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <div><h1 className="text-2xl font-bold sm:text-3xl">{calc.titleBn}</h1><p className="mt-1 text-sm text-slate-500">{calc.titleEn}</p></div>
        <button type="button" onClick={() => { const n = toggleFavorite(calc.slug); setFav(n.includes(calc.slug)); toast(n.includes(calc.slug) ? 'প্রিয়তে যোগ হয়েছে' : 'প্রিয় থেকে সরানো হয়েছে') }} aria-pressed={fav} className={`flex min-h-[44px] items-center gap-2 rounded-full px-4 font-medium ${fav ? 'grad text-white' : 'glass'}`}>
          <Star className={`h-5 w-5 ${fav ? 'fill-white' : ''}`} /> {fav ? 'প্রিয়তে আছে' : 'প্রিয় করুন'}
        </button>
      </div>
      <p className="mt-3 text-slate-700 dark:text-slate-200">{calc.descriptionBn}</p>
    </>
  )
}

function PageFoot({ calc }) {
  const [openFaq, setOpenFaq] = useState(null)
  const related = useMemo(() => relatedCalculators(calc.slug), [calc.slug])
  return (
    <>
      <section className="glass mt-6 rounded-3xl p-5" aria-label="সূত্র ও উদাহরণ">
        <h2 className="font-bold">সূত্র</h2>
        <p className="mt-2 rounded-xl bg-blue-50 p-3 text-sm dark:bg-blue-900/30">{calc.formula}</p>
        <h3 className="mt-4 font-bold">উদাহরণ</h3>
        <p className="mt-1 text-sm">{calc.example}</p>
      </section>
      {calc.faq?.length > 0 && (
        <section className="glass mt-6 rounded-3xl p-5" aria-label="সাধারণ প্রশ্ন">
          <h2 className="text-lg font-bold">সাধারণ প্রশ্ন</h2>
          {calc.faq.map((f, i) => (
            <div key={i} className="mt-3 border-b border-slate-200 pb-3 last:border-0 dark:border-slate-700">
              <button type="button" onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i} className="flex min-h-[44px] w-full items-center justify-between gap-2 text-left font-medium">{f.q}<ChevronDown className={`h-5 w-5 shrink-0 ${openFaq === i ? 'rotate-180' : ''}`} /></button>
              {openFaq === i && <p className="mt-1 text-sm">{f.a}</p>}
            </div>
          ))}
        </section>
      )}
      <section className="mt-6" aria-label="সম্পর্কিত ক্যালকুলেটর">
        <h2 className="text-lg font-bold">সম্পর্কিত ক্যালকুলেটর</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {related.map((c) => <Link key={c.slug} to={`/${c.slug}`} className="glass rounded-2xl p-4 text-sm font-medium hover:shadow-lg">{c.titleBn}</Link>)}
        </div>
      </section>
    </>
  )
}

function Keypad({ expr, setExpr, onEquals, scientific }) {
  const toast = useToast()
  const keys = scientific
    ? ['sin(', 'cos(', 'tan(', 'sqrt(', 'log(', 'ln(', 'pi', 'e', '^', '(', ')', '7', '8', '9', '/', '%', '4', '5', '6', '*', '1/x', '1', '2', '3', '-', '0', '.', '0', '+', '=']
    : ['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '%', '+', '=']
  const press = (k) => {
    if (k === '=') { onEquals(); return }
    if (k === '1/x') { setExpr((e) => `1/(${e || '1'})`); return }
    setExpr((e) => e + k)
  }
  return (
    <div>
      <div className="rounded-2xl bg-slate-900 p-4 text-right text-white">
        <p className="min-h-[28px] break-all text-sm text-slate-400">{expr || ' '}</p>
        <p className="text-xs text-slate-500">নিরাপদ পার্সার — eval() ব্যবহার করা হয় না</p>
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
        <button type="button" onClick={() => setExpr('')} className="min-h-[48px] rounded-xl bg-red-100 font-bold text-red-700 dark:bg-red-900/40">C</button>
        <button type="button" onClick={() => setExpr((e) => e.slice(0, -1))} aria-label="মুছুন" className="flex min-h-[48px] items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800"><Delete className="h-5 w-5" /></button>
        {keys.map((k, i) => (
          <button key={i} type="button" onClick={() => press(k)} className={`min-h-[48px] rounded-xl font-bold ${k === '=' ? 'grad text-white' : 'bg-white shadow-sm dark:bg-slate-800'}`}>{k}</button>
        ))}
      </div>
      <p className="mt-2 text-xs text-slate-500">কীবোর্ড দিয়েও লিখতে পারেন — নিচের ঘরে এক্সপ্রেশন টাইপ করে Enter চাপুন।</p>
    </div>
  )
}

export function ScientificPage({ calc }) {
  const toast = useToast()
  const [expr, setExpr] = useState('')
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])
  const [error, setError] = useState('')
  const compute = (e) => {
    e?.preventDefault(); setError('')
    try {
      const v = evaluate(expr)
      const r = { headline: `${expr} = ${v}`, details: [{ label: 'ফলাফল', value: String(v) }], steps: [`${expr} নিরাপদ পার্সার দিয়ে হিসাব করা হয়েছে`] }
      setResult(r); setHistory((h) => [`${expr} = ${v}`, ...h].slice(0, 10))
      addHistory({ slug: calc.slug, title: calc.titleBn, summary: r.headline })
    } catch (err) { setError(err.message) }
  }
  return (
    <div><PageHead calc={calc} />
      <div className="glass mt-6 rounded-3xl p-4 sm:p-6">
        <Keypad expr={expr} setExpr={setExpr} onEquals={compute} scientific />
        <form onSubmit={compute} className="mt-3 flex gap-2">
          <input aria-label="এক্সপ্রেশন লিখুন" value={expr} onChange={(e) => setExpr(e.target.value)} placeholder="যেমন: 2+3*4 বা sqrt(16)+log(100)" className="min-h-[48px] flex-1 rounded-xl border border-slate-200 bg-white px-4 dark:border-slate-600 dark:bg-slate-900" />
          <button type="submit" className="grad flex min-h-[48px] items-center gap-2 rounded-full px-5 font-bold text-white"><Calculator className="h-5 w-5" /> =</button>
        </form>
        {error && <p role="alert" className="mt-3 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700 dark:bg-red-900/30">{error}</p>}
        <ResultPanel result={result} calc={calc} />
        {history.length > 0 && (
          <div className="mt-4"><h2 className="font-bold">সাম্প্রতিক হিসাব</h2><ul className="mt-2 space-y-1 text-sm">{history.map((h, i) => <li key={i}><button type="button" onClick={() => setExpr(h.split(' = ')[0])} className="rounded-lg bg-white/70 px-3 py-2 text-left dark:bg-slate-800">{h}</button></li>)}</ul></div>
        )}
      </div>
      <PageFoot calc={calc} />
    </div>
  )
}

export function BasicPage({ calc }) {
  const toast = useToast()
  const [expr, setExpr] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const compute = (e) => {
    e?.preventDefault(); setError('')
    try {
      const v = evaluate(expr)
      const r = { headline: `${expr} = ${v}`, details: [{ label: 'ফলাফল', value: String(v) }], steps: [] }
      setResult(r); addHistory({ slug: calc.slug, title: calc.titleBn, summary: r.headline })
    } catch (err) { setError(err.message) }
  }
  return (
    <div><PageHead calc={calc} />
      <div className="glass mt-6 rounded-3xl p-4 sm:p-6">
        <Keypad expr={expr} setExpr={setExpr} onEquals={compute} scientific={false} />
        <form onSubmit={compute} className="mt-3 flex gap-2">
          <input aria-label="এক্সপ্রেশন লিখুন" value={expr} onChange={(e) => setExpr(e.target.value)} placeholder="যেমন: 1250+375" className="min-h-[48px] flex-1 rounded-xl border border-slate-200 bg-white px-4 dark:border-slate-600 dark:bg-slate-900" />
          <button type="submit" className="grad flex min-h-[48px] items-center gap-2 rounded-full px-5 font-bold text-white"><Calculator className="h-5 w-5" /> =</button>
        </form>
        {error && <p role="alert" className="mt-3 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700 dark:bg-red-900/30">{error}</p>}
        <ResultPanel result={result} calc={calc} />
      </div>
      <PageFoot calc={calc} />
    </div>
  )
}

export function EmiPage({ calc }) {
  const [principal, setPrincipal] = useState('100000')
  const [rate, setRate] = useState('12')
  const [months, setMonths] = useState('12')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const toast = useToast()
  const compute = (e) => {
    e?.preventDefault(); setError('')
    try {
      const r = emi(principal, rate, months)
      setResult({ headline: `মাসিক EMI ৳${r.emi.toLocaleString('en-US')}`, details: [{ label: 'মাসিক EMI', value: `৳${r.emi.toLocaleString('en-US')}` }, { label: 'মোট সুদ', value: `৳${r.totalInterest.toLocaleString('en-US')}` }, { label: 'মোট পরিশোধ', value: `৳${r.totalPayment.toLocaleString('en-US')}` }], steps: [`মাসিক হার ${Number(rate) / 12}% ধরে EMI সূত্র প্রয়োগ করা হয়েছে`] })
      addHistory({ slug: calc.slug, title: calc.titleBn, summary: `EMI ৳${r.emi.toLocaleString('en-US')}` })
    } catch (err) { setError(err.message) }
  }
  const chartData = result ? [
    { name: 'আসল', value: Number(principal), fill: '#2563EB' },
    { name: 'সুদ', value: Math.round(emi(principal, rate, months).totalInterest), fill: '#06B6D4' },
  ] : []
  return (
    <div><PageHead calc={calc} />
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="glass rounded-3xl p-4 sm:p-6">
          <form onSubmit={compute} className="space-y-4">
            <div><label htmlFor="emi-p" className="mb-1 block font-medium">ঋণের পরিমাণ (টাকা)</label><input id="emi-p" type="number" min="1" value={principal} onChange={(e) => setPrincipal(e.target.value)} required className="min-h-[48px] w-full rounded-xl border border-slate-200 bg-white px-4 dark:border-slate-600 dark:bg-slate-900" /></div>
            <div><label htmlFor="emi-r" className="mb-1 block font-medium">বার্ষিক সুদের হার (%)</label><input id="emi-r" type="number" step="0.01" min="0" value={rate} onChange={(e) => setRate(e.target.value)} required className="min-h-[48px] w-full rounded-xl border border-slate-200 bg-white px-4 dark:border-slate-600 dark:bg-slate-900" /></div>
            <div><label htmlFor="emi-m" className="mb-1 block font-medium">মেয়াদ (মাস)</label><input id="emi-m" type="number" min="1" value={months} onChange={(e) => setMonths(e.target.value)} required className="min-h-[48px] w-full rounded-xl border border-slate-200 bg-white px-4 dark:border-slate-600 dark:bg-slate-900" /></div>
            {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            <button type="submit" className="grad flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full font-bold text-white"><Calculator className="h-5 w-5" /> হিসাব করুন</button>
          </form>
          <ResultPanel result={result} calc={calc} />
        </section>
        <section className="glass rounded-3xl p-4 sm:p-6" aria-label="আসল বনাম সুদ">
          <h2 className="font-bold">আসল বনাম সুদ</h2>
          {result ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart><Pie data={chartData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} label>{chartData.map((d) => <Cell key={d.name} fill={d.fill} />)}</Pie><Tooltip formatter={(v) => `৳${Number(v).toLocaleString('en-US')}`} /></PieChart>
              </ResponsiveContainer>
              <p className="text-center text-sm text-slate-500">নীল: আসল ৳{Number(principal).toLocaleString('en-US')} • আকাশি: মোট সুদ</p>
            </div>
          ) : <p className="mt-4 text-sm text-slate-500">হিসাব করলে এখানে আসল বনাম সুদের চার্ট দেখাবে।</p>}
        </section>
      </div>
      <PageFoot calc={calc} />
    </div>
  )
}

export function AgePage({ calc }) {
  const [birth, setBirth] = useState('')
  const [asOf, setAsOf] = useState(new Date().toISOString().slice(0, 10))
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const compute = (e) => {
    e?.preventDefault(); setError('')
    try {
      const a = ageCalc(birth, asOf)
      setResult({ headline: `${a.years} বছর ${a.months} মাস ${a.days} দিন`, details: [{ label: 'বছর', value: String(a.years) }, { label: 'মাস', value: String(a.months) }, { label: 'দিন', value: String(a.days) }, { label: 'মোট দিন', value: a.totalDays.toLocaleString('en-US') }, { label: 'মোট মাস', value: String(a.totalMonths) }, { label: 'মোট সপ্তাহ', value: String(a.totalWeeks) }], steps: [`${birth} থেকে ${asOf} পর্যন্ত ক্যালেন্ডার অনুযায়ী হিসাব করা হয়েছে`] })
      addHistory({ slug: calc.slug, title: calc.titleBn, summary: `${a.years} বছর ${a.months} মাস ${a.days} দিন` })
    } catch (err) { setError(err.message) }
  }
  return (
    <div><PageHead calc={calc} />
      <div className="glass mt-6 rounded-3xl p-4 sm:p-6">
        <form onSubmit={compute} className="grid gap-4 sm:grid-cols-2">
          <div><label htmlFor="age-b" className="mb-1 block font-medium">জন্মতারিখ</label><input id="age-b" type="date" value={birth} onChange={(e) => setBirth(e.target.value)} required className="min-h-[48px] w-full rounded-xl border border-slate-200 bg-white px-4 dark:border-slate-600 dark:bg-slate-900" /></div>
          <div><label htmlFor="age-a" className="mb-1 block font-medium">যে তারিখ পর্যন্ত (আজ)</label><input id="age-a" type="date" value={asOf} onChange={(e) => setAsOf(e.target.value)} required className="min-h-[48px] w-full rounded-xl border border-slate-200 bg-white px-4 dark:border-slate-600 dark:bg-slate-900" /></div>
          <button type="submit" className="grad flex min-h-[48px] items-center justify-center gap-2 rounded-full font-bold text-white sm:col-span-2"><Calculator className="h-5 w-5" /> বয়স হিসাব করুন</button>
        </form>
        {error && <p role="alert" className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <ResultPanel result={result} calc={calc} />
      </div>
      <PageFoot calc={calc} />
    </div>
  )
}

export function UnitPage({ calc }) {
  const group = UNIT_GROUPS[calc.unitGroup]
  const units = Object.keys(group.units)
  const [value, setValue] = useState('1')
  const [from, setFrom] = useState(units[0])
  const [to, setTo] = useState(units[1] || units[0])
  const [groupId, setGroupId] = useState(calc.unitGroup)
  const g = UNIT_GROUPS[groupId]
  const gUnits = Object.keys(g.units)
  const [fromG, setFromG] = useState(gUnits[0])
  const [toG, setToG] = useState(gUnits[1] || gUnits[0])
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const compute = (e) => {
    e?.preventDefault(); setError('')
    try {
      const v = convertUnit(groupId, value, fromG, toG)
      setResult({ headline: `${value} ${fromG} = ${v} ${toG}`, details: [{ label: 'ফলাফল', value: `${v} ${toG}` }], steps: [`${value} ${fromG} কে ${toG} এ রূপান্তর করা হয়েছে`] })
      addHistory({ slug: calc.slug, title: calc.titleBn, summary: `${value} ${fromG} = ${v} ${toG}` })
    } catch (err) { setError(err.message) }
  }
  return (
    <div><PageHead calc={calc} />
      <div className="glass mt-6 rounded-3xl p-4 sm:p-6">
        <form onSubmit={compute} className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2"><label htmlFor="unit-group" className="mb-1 block font-medium">এককের ধরন</label>
            <select id="unit-group" value={groupId} onChange={(e) => { const id = e.target.value; setGroupId(id); const u = Object.keys(UNIT_GROUPS[id].units); setFromG(u[0]); setToG(u[1] || u[0]) }} className="min-h-[48px] w-full rounded-xl border border-slate-200 bg-white px-4 dark:border-slate-600 dark:bg-slate-900">
              {Object.entries(UNIT_GROUPS).map(([id, gg]) => <option key={id} value={id}>{gg.label}</option>)}
            </select>
          </div>
          <div><label htmlFor="unit-v" className="mb-1 block font-medium">মান</label><input id="unit-v" type="number" step="any" value={value} onChange={(e) => setValue(e.target.value)} required className="min-h-[48px] w-full rounded-xl border border-slate-200 bg-white px-4 dark:border-slate-600 dark:bg-slate-900" /></div>
          <div><label htmlFor="unit-from" className="mb-1 block font-medium">থেকে</label><select id="unit-from" value={fromG} onChange={(e) => setFromG(e.target.value)} className="min-h-[48px] w-full rounded-xl border border-slate-200 bg-white px-4 dark:border-slate-600 dark:bg-slate-900">{gUnits.map((u) => <option key={u}>{u}</option>)}</select></div>
          <div><label htmlFor="unit-to" className="mb-1 block font-medium">এতে</label><select id="unit-to" value={toG} onChange={(e) => setToG(e.target.value)} className="min-h-[48px] w-full rounded-xl border border-slate-200 bg-white px-4 dark:border-slate-600 dark:bg-slate-900">{gUnits.map((u) => <option key={u}>{u}</option>)}</select></div>
          <button type="submit" className="grad flex min-h-[48px] items-center justify-center gap-2 rounded-full font-bold text-white sm:col-span-2"><Calculator className="h-5 w-5" /> রূপান্তর করুন</button>
        </form>
        {error && <p role="alert" className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <ResultPanel result={result} calc={calc} />
      </div>
      <PageFoot calc={calc} />
    </div>
  )
}

export function LandPage({ calc }) {
  const units = Object.keys(LAND_UNITS)
  const [value, setValue] = useState('1')
  const [from, setFrom] = useState(calc.landUnit || 'শতাংশ')
  const [to, setTo] = useState('বর্গফুট')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const compute = (e) => {
    e?.preventDefault(); setError('')
    try {
      const rows = units.filter((u) => u !== from).map((u) => ({ label: u, value: String(convertLand(value, from, u)) }))
      setResult({ headline: `${value} ${from} = ${convertLand(value, from, to)} ${to}`, details: rows, steps: [`ঢাকা মান অনুযায়ী রূপান্তর করা হয়েছে`] })
      addHistory({ slug: calc.slug, title: calc.titleBn, summary: `${value} ${from} = ${convertLand(value, from, to)} ${to}` })
    } catch (err) { setError(err.message) }
  }
  return (
    <div><PageHead calc={calc} />
      <div className="glass mt-6 rounded-3xl p-4 sm:p-6">
        <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">{LAND_NOTE}</p>
        <form onSubmit={compute} className="mt-4 grid gap-4 sm:grid-cols-3">
          <div><label htmlFor="land-v" className="mb-1 block font-medium">পরিমাণ</label><input id="land-v" type="number" step="any" min="0" value={value} onChange={(e) => setValue(e.target.value)} required className="min-h-[48px] w-full rounded-xl border border-slate-200 bg-white px-4 dark:border-slate-600 dark:bg-slate-900" /></div>
          <div><label htmlFor="land-from" className="mb-1 block font-medium">থেকে</label><select id="land-from" value={from} onChange={(e) => setFrom(e.target.value)} className="min-h-[48px] w-full rounded-xl border border-slate-200 bg-white px-4 dark:border-slate-600 dark:bg-slate-900">{units.map((u) => <option key={u}>{u}</option>)}</select></div>
          <div><label htmlFor="land-to" className="mb-1 block font-medium">এতে (প্রধান ফলাফল)</label><select id="land-to" value={to} onChange={(e) => setTo(e.target.value)} className="min-h-[48px] w-full rounded-xl border border-slate-200 bg-white px-4 dark:border-slate-600 dark:bg-slate-900">{units.map((u) => <option key={u}>{u}</option>)}</select></div>
          <button type="submit" className="grad flex min-h-[48px] items-center justify-center gap-2 rounded-full font-bold text-white sm:col-span-3"><Calculator className="h-5 w-5" /> রূপান্তর করুন</button>
        </form>
        {error && <p role="alert" className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <ResultPanel result={result} calc={calc} />
      </div>
      <PageFoot calc={calc} />
    </div>
  )
}

export function MatrixPage({ calc }) {
  const [a, setA] = useState([[1, 2], [3, 4]])
  const [b, setB] = useState([[2, 0], [1, 2]])
  const [op, setOp] = useState('multiply')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const setCell = (mat, r, c, v, setter) => setter(mat.map((row, i) => row.map((x, j) => (i === r && j === c ? Number(v) || 0 : x))))
  const compute = (e) => {
    e?.preventDefault(); setError('')
    try {
      const r = matrix2x2(op, a, b)
      if (op === 'det') setResult({ headline: `নির্ণায়ক = ${r.determinant}`, details: [{ label: 'নির্ণায়ক', value: String(r.determinant) }], steps: [`${a[0][0]}×${a[1][1]} − ${a[0][1]}×${a[1][0]} = ${r.determinant}`] })
      else setResult({ headline: `ফলাফল: [[${r.result[0].join(', ')}], [${r.result[1].join(', ')}]]`, details: [{ label: 'সারি ১', value: r.result[0].join(', ') }, { label: 'সারি ২', value: r.result[1].join(', ') }], steps: ['ম্যাট্রিক্স অপারেশন প্রয়োগ করা হয়েছে'] })
      addHistory({ slug: calc.slug, title: calc.titleBn, summary: 'ম্যাট্রিক্স হিসাব সম্পন্ন' })
    } catch (err) { setError(err.message) }
  }
  const grid = (mat, setter, label) => (
    <div><p className="mb-2 font-medium">{label}</p><div className="grid grid-cols-2 gap-2">{mat.flatMap((row, i) => row.map((x, j) => <input key={`${i}${j}`} aria-label={`${label} ${i + 1},${j + 1}`} type="number" value={x} onChange={(e) => setCell(mat, i, j, e.target.value, setter)} className="min-h-[48px] rounded-xl border border-slate-200 bg-white px-3 text-center dark:border-slate-600 dark:bg-slate-900" />))}</div></div>
  )
  return (
    <div><PageHead calc={calc} />
      <div className="glass mt-6 rounded-3xl p-4 sm:p-6">
        <form onSubmit={compute} className="space-y-4">
          <div><label htmlFor="mx-op" className="mb-1 block font-medium">অপারেশন</label>
            <select id="mx-op" value={op} onChange={(e) => setOp(e.target.value)} className="min-h-[48px] w-full rounded-xl border border-slate-200 bg-white px-4 dark:border-slate-600 dark:bg-slate-900">
              <option value="add">যোগ (A + B)</option><option value="multiply">গুণ (A × B)</option><option value="det">নির্ণায়ক (det A)</option>
            </select></div>
          <div className="grid gap-4 sm:grid-cols-2">{grid(a, setA, 'ম্যাট্রিক্স A')}{op !== 'det' && grid(b, setB, 'ম্যাট্রিক্স B')}</div>
          {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <button type="submit" className="grad flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full font-bold text-white"><Calculator className="h-5 w-5" /> হিসাব করুন</button>
        </form>
        <ResultPanel result={result} calc={calc} />
      </div>
      <PageFoot calc={calc} />
    </div>
  )
}

export function EquationPage({ calc }) {
  const [type, setType] = useState('quadratic')
  const [a, setA] = useState('1'); const [b, setB] = useState('-5'); const [c, setC] = useState('6')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const compute = (e) => {
    e?.preventDefault(); setError('')
    try {
      if (type === 'linear') {
        const r = solveLinear(a, b)
        setResult({ headline: `x = ${r.x}`, details: [{ label: 'x', value: String(r.x) }], steps: [`x = −(${b}) ÷ ${a} = ${r.x}`] })
      } else {
        const r = solveQuadratic(a, b, c)
        if (r.type === 'complex') setResult({ headline: 'বাস্তব সমাধান নেই', details: [{ label: 'বৈষম্যকারী', value: String(r.discriminant) }], steps: ['b²−4ac ঋণাত্মক, তাই বাস্তব সমাধান নেই'], sub: r.note })
        else setResult({ headline: `x = ${r.x1} অথবা x = ${r.x2}`, details: [{ label: 'x₁', value: String(r.x1) }, { label: 'x₂', value: String(r.x2) }, { label: 'বৈষম্যকারী', value: String(r.discriminant) }], steps: [`বৈষম্যকারী = ${b}² − 4×${a}×${c} = ${r.discriminant}`, `x = (−b ± √বৈষম্যকারী) ÷ 2a`] })
      }
      addHistory({ slug: calc.slug, title: calc.titleBn, summary: 'সমীকরণ সমাধান সম্পন্ন' })
    } catch (err) { setError(err.message) }
  }
  return (
    <div><PageHead calc={calc} />
      <div className="glass mt-6 rounded-3xl p-4 sm:p-6">
        <form onSubmit={compute} className="space-y-4">
          <div><label htmlFor="eq-type" className="mb-1 block font-medium">সমীকরণের ধরন</label>
            <select id="eq-type" value={type} onChange={(e) => setType(e.target.value)} className="min-h-[48px] w-full rounded-xl border border-slate-200 bg-white px-4 dark:border-slate-600 dark:bg-slate-900">
              <option value="quadratic">দ্বিঘাত: ax² + bx + c = 0</option><option value="linear">রৈখিক: ax + b = 0</option>
            </select></div>
          <div className="grid grid-cols-3 gap-2">
            <div><label htmlFor="eq-a" className="mb-1 block font-medium">a</label><input id="eq-a" type="number" step="any" value={a} onChange={(e) => setA(e.target.value)} required className="min-h-[48px] w-full rounded-xl border border-slate-200 bg-white px-3 dark:border-slate-600 dark:bg-slate-900" /></div>
            <div><label htmlFor="eq-b" className="mb-1 block font-medium">b</label><input id="eq-b" type="number" step="any" value={b} onChange={(e) => setB(e.target.value)} required className="min-h-[48px] w-full rounded-xl border border-slate-200 bg-white px-3 dark:border-slate-600 dark:bg-slate-900" /></div>
            {type === 'quadratic' && <div><label htmlFor="eq-c" className="mb-1 block font-medium">c</label><input id="eq-c" type="number" step="any" value={c} onChange={(e) => setC(e.target.value)} required className="min-h-[48px] w-full rounded-xl border border-slate-200 bg-white px-3 dark:border-slate-600 dark:bg-slate-900" /></div>}
          </div>
          {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <button type="submit" className="grad flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full font-bold text-white"><Calculator className="h-5 w-5" /> সমাধান করুন</button>
        </form>
        <ResultPanel result={result} calc={calc} />
      </div>
      <PageFoot calc={calc} />
    </div>
  )
}
