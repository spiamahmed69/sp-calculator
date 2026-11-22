import { Link } from 'react-router-dom'
import { SearchX } from 'lucide-react'
import Seo from '../components/Seo.jsx'

export default function NotFound() {
  return (
    <div className="py-16 text-center">
      <Seo title="পাতা পাওয়া যায়নি (৪০৪)" description="আপনি যে পাতাটি খুঁজছেন তা পাওয়া যায়নি।" slug="" />
      <SearchX className="mx-auto h-16 w-16 text-blue-500" />
      <h1 className="mt-4 text-3xl font-bold">পাতাটি পাওয়া যায়নি</h1>
      <p className="mx-auto mt-2 max-w-md text-slate-600 dark:text-slate-300">দুঃখিত — এই ঠিকানায় কোনো পাতা নেই। হয়তো লিংকটি ভুল, অথবা পাতাটি সরানো হয়েছে।</p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Link to="/" className="grad min-h-[48px] rounded-full px-6 py-3 font-bold text-white">হোমে ফিরুন</Link>
        <Link to="/calculators" className="glass min-h-[48px] rounded-full px-6 py-3 font-medium">সব ক্যালকুলেটর দেখুন</Link>
      </div>
    </div>
  )
}
