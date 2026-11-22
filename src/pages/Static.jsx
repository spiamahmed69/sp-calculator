import { useState } from 'react'
import { Mail, Send } from 'lucide-react'
import Seo from '../components/Seo.jsx'
import { useToast } from '../components/Toast.jsx'

function Page({ title, desc, children }) {
  return (
    <div>
      <Seo title={title} description={desc} slug={title === 'আমাদের সম্পর্কে' ? 'about' : title === 'গোপনীয়তা নীতি' ? 'privacy' : title === 'শর্তাবলি' ? 'terms' : 'contact'} />
      <h1 className="mt-6 text-2xl font-bold sm:text-3xl">{title}</h1>
      <div className="glass mt-4 space-y-4 rounded-3xl p-5 text-slate-700 dark:text-slate-200">{children}</div>
    </div>
  )
}

export function About() {
  return (
    <Page title="আমাদের সম্পর্কে" desc="SP Calculator — বাংলা ভাষার All-in-One অনলাইন ক্যালকুলেটর প্ল্যাটফর্ম সম্পর্কে জানুন।">
      <p>SP Calculator হলো বাংলা ভাষার All-in-One অনলাইন ক্যালকুলেটর প্ল্যাটফর্ম। আমাদের লক্ষ্য — শিক্ষার্থী, শিক্ষক, চাকরিপ্রার্থী, ব্যবসায়ী ও সাধারণ ব্যবহারকারীদের দৈনন্দিন হিসাব সহজ, দ্রুত ও নির্ভুলভাবে করা।</p>
      <p>এখানে GPA, CGPA, সায়েন্টিফিক, বয়স, EMI, শতাংশ, একক রূপান্তর, জমির মাপসহ {''}৮০টির বেশি ক্যালকুলেটর আছে — সব বিনামূল্যে, রেজিস্ট্রেশন ছাড়াই।</p>
      <p>আমরা কোনো ভুয়া ফলাফল দেখাই না। প্রতিটি ক্যালকুলেটরে সূত্র, হিসাবের ধাপ, উদাহরণ ও সীমাবদ্ধতা খোলাখুলিভাবে দেওয়া থাকে। স্বাস্থ্য সংক্রান্ত ফলাফল শিক্ষামূলক অনুমান মাত্র, চিকিৎসা পরামর্শ নয়।</p>
      <p>Google-এ র‍্যাঙ্কিংয়ের কোনো নিশ্চয়তা আমরা দিই না — তবে সঠিক SEO অনুশীলন (সাইটম্যাপ, ক্যানোনিকাল, স্ট্রাকচার্ড ডেটা, দ্রুত লোড) অনুসরণ করা হয়েছে যাতে সার্চ ইঞ্জিন পাতাগুলো সহজে খুঁজে পায়।</p>
    </Page>
  )
}

export function Privacy() {
  return (
    <Page title="গোপনীয়তা নীতি" desc="SP Calculator-এর গোপনীয়তা নীতি — আপনার তথ্য কীভাবে ব্যবহৃত হয়।">
      <p><strong>আমরা কী সংগ্রহ করি না:</strong> এই ওয়েবসাইটে কোনো অ্যাকাউন্ট বা রেজিস্ট্রেশন নেই। আপনি ক্যালকুলেটরে যা লেখেন, তা আপনার ব্রাউজারেই হিসাব হয় — আমাদের সার্ভারে পাঠানো হয় না।</p>
      <p><strong>লোকাল স্টোরেজ:</strong> আপনার প্রিয় ক্যালকুলেটর, সাম্প্রতিক হিসাব ও থিম পছন্দ শুধু আপনার ডিভাইসের localStorage-এ থাকে। ব্রাউজারের ডেটা মুছলে এগুলোও মুছে যাবে।</p>
      <p><strong>অ্যানালিটিক্স:</strong> Google Analytics 4 শুধুমাত্র তখনই চালু হয়, যখন সাইট পরিচালক একটি বৈধ Measurement ID (VITE_GA_MEASUREMENT_ID) বসান। ডিফল্টভাবে কোনো ট্র্যাকিং চালু নেই।</p>
      <p><strong>তৃতীয় পক্ষ:</strong> ফন্টের জন্য Google Fonts ব্যবহার করা হয়। অন্য কোনো বিজ্ঞাপন বা ট্র্যাকিং স্ক্রিপ্ট নেই।</p>
      <p>এই নীতি পরিবর্তন হলে এই পাতায় হালনাগাদ করা হবে।</p>
    </Page>
  )
}

export function Terms() {
  return (
    <Page title="শর্তাবলি" desc="SP Calculator ব্যবহারের শর্তাবলি।">
      <p>SP Calculator বিনামূল্যে ব্যবহারের জন্য দেওয়া হয়েছে। ক্যালকুলেটরগুলো প্রচলিত সূত্র ও নিয়ম অনুযায়ী হিসাব দেয়; ফলাফল শিক্ষামূলক ও সহায়ক হিসেবে ব্যবহার করুন।</p>
      <p>অফিসিয়াল সিদ্ধান্ত (পরীক্ষার ফল, চাকরির আবেদন, ঋণ, জমি কেনাবেচা, চিকিৎসা) নেওয়ার আগে সংশ্লিষ্ট কর্তৃপক্ষের প্রকাশিত তথ্য মিলিয়ে নিন। ভ্যাট/ট্যাক্সের হার আপনি নিজে বসান — এখানে কোনো হার অফিসিয়াল হিসেবে ধরা হয়নি।</p>
      <p>স্বাস্থ্য সংক্রান্ত ফলাফল (BMI, BMR, ক্যালরি, পানি) শিক্ষামূলক অনুমান মাত্র, চিকিৎসা পরামর্শ নয়।</p>
      <p>এই সাইটের কনটেন্ট ও হিসাবের নির্ভুলতার জন্য সর্বোচ্চ চেষ্টা করা হয়, তবে কোনো ক্ষতির দায় সাইট বহন করে না।</p>
    </Page>
  )
}

export function Contact() {
  const toast = useToast()
  const [name, setName] = useState('')
  const [msg, setMsg] = useState('')
  const [sent, setSent] = useState(false)
  const submit = (e) => {
    e.preventDefault()
    // No backend: the form honestly does not send anywhere; offer mailto instead.
    setSent(true)
    toast('বার্তাটি কোথাও পাঠানো হয়নি — নিচের ইমেইল বোতামটি ব্যবহার করুন')
  }
  return (
    <Page title="যোগাযোগ" desc="SP Calculator-এর সঙ্গে যোগাযোগ করুন — মতামত, ভুলের তথ্য বা নতুন ক্যালকুলেটরের অনুরোধ পাঠান।">
      <p>আপনার মতামত, কোনো ভুলের তথ্য বা নতুন ক্যালকুলেটরের অনুরোধ জানাতে পারেন। এই সাইটে কোনো ব্যাকএন্ড নেই, তাই ফর্মটি বার্তা কোথাও পাঠায় না — নিচের ইমেইল বোতামে ক্লিক করলে আপনার ইমেইল অ্যাপে বার্তাটি তৈরি হবে।</p>
      <form onSubmit={submit} className="space-y-4">
        <div><label htmlFor="ct-name" className="mb-1 block font-medium">আপনার নাম</label><input id="ct-name" value={name} onChange={(e) => setName(e.target.value)} required className="min-h-[48px] w-full rounded-xl border border-slate-200 bg-white px-4 dark:border-slate-600 dark:bg-slate-900" /></div>
        <div><label htmlFor="ct-msg" className="mb-1 block font-medium">বার্তা</label><textarea id="ct-msg" rows={4} value={msg} onChange={(e) => setMsg(e.target.value)} required className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-600 dark:bg-slate-900" /></div>
        <button type="submit" className="grad flex min-h-[48px] items-center gap-2 rounded-full px-6 font-bold text-white"><Send className="h-4 w-4" /> বার্তা তৈরি করুন</button>
        {sent && (
          <p className="rounded-xl bg-blue-50 p-3 text-sm dark:bg-blue-900/30">
            <a className="flex items-center gap-2 font-semibold text-blue-700 dark:text-blue-300" href={`mailto:contact@sp-calculator.example?subject=${encodeURIComponent('SP Calculator — যোগাযোগ')}&body=${encodeURIComponent(`নাম: ${name}\n\n${msg}`)}`}>
              <Mail className="h-4 w-4" /> ইমেইল অ্যাপে খুলুন (contact@sp-calculator.example)
            </a>
            দ্রষ্টব্য: উপরের ঠিকানাটি একটি প্লেসহোল্ডার — সাইট পরিচালক আসল ইমেইল বসালে এটি কাজ করবে।
          </p>
        )}
      </form>
    </Page>
  )
}
