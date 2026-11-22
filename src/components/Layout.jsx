import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Calculator, Menu, Moon, Star, Sun, X, Home, LayoutGrid, Info, History } from 'lucide-react'
import { THEME_KEY, loadJSON } from '../lib/storage.js'

export function useTheme() {
  const [dark, setDark] = useState(() => loadJSON(THEME_KEY, false))
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    try { localStorage.setItem(THEME_KEY, JSON.stringify(dark)) } catch { /* ignore */ }
  }, [dark])
  return { dark, toggle: () => setDark((d) => !d) }
}

const NAV = [
  { to: '/', label: 'হোম', icon: Home },
  { to: '/calculators', label: 'সব ক্যালকুলেটর', icon: Calculator },
  { to: '/categories', label: 'ক্যাটাগরি', icon: LayoutGrid },
  { to: '/favorites', label: 'প্রিয়', icon: Star },
  { to: '/history', label: 'ইতিহাস', icon: History },
  { to: '/about', label: 'আমাদের সম্পর্কে', icon: Info },
]

export default function Layout() {
  const { dark, toggle } = useTheme()
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  useEffect(() => setOpen(false), [loc.pathname])
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="blob left-[-80px] top-[-60px] h-72 w-72 bg-blue-400" aria-hidden="true" />
      <div className="blob right-[-60px] top-40 h-72 w-72 bg-cyan-300" aria-hidden="true" />
      <div className="blob bottom-0 left-1/3 h-64 w-64 bg-violet-300" aria-hidden="true" />
      <header className="sticky top-0 z-40">
        <div className="glass mx-auto mt-3 flex max-w-6xl items-center justify-between gap-2 rounded-2xl px-3 py-2 sm:px-4">
          <Link to="/" className="flex min-h-[44px] items-center gap-2" aria-label="SP Calculator — হোম">
            <span className="grad flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white">SP</span>
            <span className="leading-tight">
              <span className="block text-base font-bold sm:text-lg">SP Calculator</span>
              <span className="hidden text-[11px] text-slate-500 dark:text-slate-400 sm:block">সব হিসাব, একটি প্ল্যাটফর্মে।</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-1 lg:flex" aria-label="প্রধান নেভিগেশন">
            {NAV.map(({ to, label }) => (
              <NavLink key={to} to={to} className={({ isActive }) => `rounded-full px-3 py-2 text-sm font-medium ${isActive ? 'grad text-white' : 'text-slate-700 hover:bg-white/70 dark:text-slate-200 dark:hover:bg-white/10'}`}>{label}</NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button type="button" onClick={toggle} aria-label={dark ? 'লাইট মোড' : 'ডার্ক মোড'} className="flex h-11 w-11 items-center justify-center rounded-full bg-white/80 shadow-sm dark:bg-slate-800">
              {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button type="button" onClick={() => setOpen((o) => !o)} aria-label="মেনু" aria-expanded={open} className="flex h-11 w-11 items-center justify-center rounded-full bg-white/80 shadow-sm dark:bg-slate-800 lg:hidden">
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {open && (
          <nav className="glass mx-auto mt-2 max-w-6xl rounded-2xl p-2 lg:hidden" aria-label="মোবাইল নেভিগেশন">
            {NAV.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} className={({ isActive }) => `flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2 font-medium ${isActive ? 'grad text-white' : ''}`}>
                <Icon className="h-5 w-5" />{label}
              </NavLink>
            ))}
          </nav>
        )}
      </header>
      <main className="relative z-10 mx-auto w-full max-w-6xl px-3 pb-28 sm:px-4">
        <Outlet />
      </main>
      <footer className="relative z-10 border-t border-white/60 bg-white/60 backdrop-blur dark:border-white/10 dark:bg-slate-900/60">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
          <div>
            <p className="text-lg font-bold">SP Calculator</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">সব হিসাব, একটি প্ল্যাটফর্মে। বাংলা ভাষার All-in-One অনলাইন ক্যালকুলেটর — GPA, CGPA, Scientific, Age, EMI, Percentage ও Unit Converterসহ প্রয়োজনীয় হিসাব বিনামূল্যে।</p>
          </div>
          <nav aria-label="ফুটার লিংক">
            <p className="font-semibold">দ্রুত লিংক</p>
            <ul className="mt-2 space-y-2 text-sm">
              <li><Link className="text-blue-700 dark:text-blue-300" to="/calculators">সব ক্যালকুলেটর</Link></li>
              <li><Link className="text-blue-700 dark:text-blue-300" to="/categories">ক্যাটাগরি</Link></li>
              <li><Link className="text-blue-700 dark:text-blue-300" to="/ssc-gpa-calculator">SSC GPA ক্যালকুলেটর</Link></li>
              <li><Link className="text-blue-700 dark:text-blue-300" to="/emi-calculator">EMI ক্যালকুলেটর</Link></li>
              <li><Link className="text-blue-700 dark:text-blue-300" to="/age-calculator">বয়স ক্যালকুলেটর</Link></li>
            </ul>
          </nav>
          <nav aria-label="তথ্য">
            <p className="font-semibold">তথ্য</p>
            <ul className="mt-2 space-y-2 text-sm">
              <li><Link className="text-blue-700 dark:text-blue-300" to="/about">আমাদের সম্পর্কে</Link></li>
              <li><Link className="text-blue-700 dark:text-blue-300" to="/privacy">গোপনীয়তা নীতি</Link></li>
              <li><Link className="text-blue-700 dark:text-blue-300" to="/terms">শর্তাবলি</Link></li>
              <li><Link className="text-blue-700 dark:text-blue-300" to="/contact">যোগাযোগ</Link></li>
            </ul>
          </nav>
        </div>
        <p className="border-t border-white/60 px-4 py-4 text-center text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">© ২০২৬ SP Calculator — বিনামূল্যে ব্যবহার করুন। স্বাস্থ্য সংক্রান্ত ফলাফল শিক্ষামূলক অনুমান, চিকিৎসা পরামর্শ নয়। Google-এ র‍্যাঙ্কিংয়ের কোনো নিশ্চয়তা দেওয়া হয় না।</p>
      </footer>
    </div>
  )
}
