// Health — educational estimates only, NOT medical advice (labelled on every page).
export function bmi(weightKg, heightCm) {
  const w = Number(weightKg); const h = Number(heightCm) / 100
  if (![w, h].every(Number.isFinite) || w <= 0 || h <= 0) throw new Error('ওজন ও উচ্চতা সঠিকভাবে দিন')
  const v = w / (h * h)
  const r = Math.round(v * 100) / 100
  const cat = r < 18.5 ? 'কম ওজন' : r < 25 ? 'স্বাভাবিক' : r < 30 ? 'অতিরিক্ত ওজন' : 'স্থূলতা'
  return { bmi: r, category: cat }
}
export function bmr({ weightKg, heightCm, age, gender }) {
  const w = Number(weightKg); const h = Number(heightCm); const a = Number(age)
  if (![w, h, a].every(Number.isFinite) || w <= 0 || h <= 0 || a <= 0) throw new Error('সঠিক তথ্য দিন')
  // Mifflin-St Jeor
  const v = gender === 'female' ? 10 * w + 6.25 * h - 5 * a - 161 : 10 * w + 6.25 * h - 5 * a + 5
  return Math.round(v)
}
export function calorieEstimate(bmrValue, activity) {
  const factors = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, veryActive: 1.9 }
  const f = factors[activity] || 1.2
  return Math.round(Number(bmrValue) * f)
}
export function waterIntake(weightKg, activityMinutes = 0) {
  const w = Number(weightKg)
  if (!Number.isFinite(w) || w <= 0) throw new Error('সঠিক ওজন দিন')
  const litres = w * 0.035 + Number(activityMinutes) * 0.012
  return Math.round(litres * 100) / 100
}
