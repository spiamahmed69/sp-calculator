import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, Star, Trash2, Clock, Calculator } from 'lucide-react'
import Seo from '../components/Seo.jsx'
import { useToast } from '../components/Toast.jsx'
import { CATEGORIES, calculators, searchCalculators, byCategory } from '../data/calculators.js'
import { getFavorites, toggleFavorite, getHistory, clearHistory } from '../lib/storage.js'

function CalcCard({ c }) {
  return (
    <Link to={`/${c.slug}`} className="glass rounded-3xl p-4 hover:shadow-xl">
      <Calculator className="h-5 w-5 text-blue-600" />
      <p className="mt-2 font-bold">{c.titleBn}</p>
      <p className="mt-1 text-xs text-slate-500">{c.descriptionBn}</p>
    </Link>
  )
}

export function AllCalculators() {
  const [params, setParams] = useSearchParams()
  const [q, setQ] = useState(params.get('q') || '')
  const [cat, setCat] = useState('all')
  const list = useMemo(() => {
    let l = q.trim() ? searchCalculators(q) : calculators
    if (cat !== 'all') l = l.filter((c) => c.category === cat)
    return l
  }, [q, cat])
  return (
    <div>
      <Seo title="সব ক্যালকুলেটর" description={`SP Calculator-এর সব ${calculators.length}টি ক্যালকুলেটর — GPA, CGPA, Scientific, Age, EMI, Percentage, Unit Converter ও আরও অনেক।`} slug="calculators" />
      <h1 className="mt-6 text-2xl font-bold sm:text-3xl">সব ক্যালকুলেটর</h1>
      <p className="mt-1 text-slate-600 dark:text-slate-300">মোট {calculators.length}টি ক্যালকুলেটর — খুঁজুন বা ক্যাটাগরি দিয়ে ফিল্টার করুন।</p>
      <div className="relative mt-4">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input value={q} onChange={(e) => { setQ(e.target.value); setParams(e.target.value ? { q: e.target.value } : {}, { replace: true }) }} placeholder="ক্যালকুলেটর খুঁজুন… (যেমন: GPA, EMI, বয়স)" aria-label="ক্যালকুলেটর খুঁজুন" className="min-h-[52px] w-full rounded-full border border-white/70 bg-white/80 py-3 pl-12 pr-4 shadow-lg backdrop-blur dark:border-slate-600 dark:bg-slate-800/80" />
      </div>
      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="ক্যাটাগরি ফিল্টার">
        <button type="button" onClick={() => setCat('all')} className={`min-h-[44px] shrink-0 rounded-full px-4 font-medium ${cat === 'all' ? 'grad text-white' : 'glass'}`}>সব ({calculators.length})</button>
        {CATEGORIES.map((c) => (
          <button key={c.id} type="button" onClick={() => setCat(c.id)} className={`min-h-[44px] shrink-0 rounded-full px-4 font-medium ${cat === c.id ? 'grad text-white' : 'glass'}`}>{c.name} ({byCategory(c.id).length})</button>
        ))}
      </div>
      {list.length === 0 ? <p className="mt-8 text-center text-slate-500">কোনো ক্যালকুলেটর পাওয়া যায়নি — অন্য শব্দ দিয়ে খুঁজুন।</p> : (
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => <CalcCard key={c.slug} c={c} />)}
        </div>
      )}
    </div>
  )
}

export function Categories() {
  return (
    <div>
      <Seo title="ক্যালকুলেটর ক্যাটাগরি" description="SP Calculator-এর সব ক্যাটাগরি — শিক্ষা, বিশ্ববিদ্যালয়, বিটিইবি, ক্যারিয়ার, বৈজ্ঞানিক, আর্থিক, তারিখ ও সময়, একক রূপান্তর, বাংলাদেশ বিশেষ, স্বাস্থ্য, গণিত ও জ্যামিতি।" slug="categories" />
      <h1 className="mt-6 text-2xl font-bold sm:text-3xl">ক্যালকুলেটর ক্যাটাগরি</h1>
      <div className="mt-6 space-y-8">
        {CATEGORIES.map((cat) => (
          <section key={cat.id} id={cat.id} aria-label={cat.name}>
            <h2 className="text-xl font-bold">{cat.name} <span className="text-sm font-normal text-slate-500">({byCategory(cat.id).length}টি)</span></h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{cat.desc}</p>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {byCategory(cat.id).map((c) => <CalcCard key={c.slug} c={c} />)}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

export function Favorites() {
  const toast = useToast()
  const [favs, setFavs] = useState(getFavorites())
  const list = calculators.filter((c) => favs.includes(c.slug))
  return (
    <div>
      <Seo title="প্রিয় ক্যালকুলেটর" description="আপনার প্রিয় ক্যালকুলেটরগুলো — শুধু আপনার ডিভাইসে সংরক্ষিত।" slug="favorites" />
      <h1 className="mt-6 flex items-center gap-2 text-2xl font-bold sm:text-3xl"><Star className="h-7 w-7 text-amber-500" /> প্রিয় ক্যালকুলেটর</h1>
      {list.length === 0 ? <p className="mt-4 text-slate-500">এখনো কোনো প্রিয় ক্যালকুলেটর নেই। যেকোনো ক্যালকুলেটর পাতায় গিয়ে “প্রিয় করুন” চাপুন।</p> : (
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => (
            <div key={c.slug} className="glass rounded-3xl p-4">
              <Link to={`/${c.slug}`} className="font-bold hover:text-blue-700">{c.titleBn}</Link>
              <p className="mt-1 text-xs text-slate-500">{c.descriptionBn}</p>
              <button type="button" onClick={() => { const n = toggleFavorite(c.slug); setFavs(n); toast('প্রিয় থেকে সরানো হয়েছে') }} className="mt-3 min-h-[40px] rounded-full bg-red-50 px-4 text-sm font-medium text-red-600 dark:bg-red-900/30">সরান</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function History() {
  const toast = useToast()
  const [hist, setHist] = useState(getHistory())
  return (
    <div>
      <Seo title="সাম্প্রতিক হিসাব" description="আপনার সাম্প্রতিক হিসাবের ইতিহাস — শুধু আপনার ডিভাইসে সংরক্ষিত।" slug="history" />
      <h1 className="mt-6 flex items-center gap-2 text-2xl font-bold sm:text-3xl"><Clock className="h-7 w-7" /> সাম্প্রতিক হিসাব</h1>
      {hist.length === 0 ? <p className="mt-4 text-slate-500">এখনো কোনো হিসাব করা হয়নি।</p> : (
        <>
          <button type="button" onClick={() => { clearHistory(); setHist([]); toast('ইতিহাস মুছে ফেলা হয়েছে') }} className="mt-4 flex min-h-[44px] items-center gap-2 rounded-full bg-red-50 px-4 font-medium text-red-600 dark:bg-red-900/30"><Trash2 className="h-4 w-4" /> সব মুছুন</button>
          <ul className="mt-4 space-y-2">
            {hist.map((h, i) => (
              <li key={i} className="glass flex items-center justify-between gap-3 rounded-2xl p-4">
                <div><Link to={`/${h.slug}`} className="font-bold hover:text-blue-700">{h.title}</Link><p className="text-sm text-slate-600 dark:text-slate-300">{h.summary}</p></div>
                <span className="shrink-0 text-xs text-slate-400">{new Date(h.at).toLocaleString('bn-BD', { timeZone: 'Asia/Dhaka' })}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
