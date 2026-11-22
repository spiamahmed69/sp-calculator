// Bangladesh board grading (SSC/HSC/JSC/Dakhil/Alim, standard board rule).
// A+ 5.0 (80-100), A 4.0 (70-79), A- 3.5 (60-69), B 3.0 (50-59), C 2.0 (40-49), D 1.0 (33-39), F 0 (0-32)
export const BOARD_GRADES = [
  { letter: 'A+', point: 5.0, min: 80, max: 100 },
  { letter: 'A', point: 4.0, min: 70, max: 79 },
  { letter: 'A-', point: 3.5, min: 60, max: 69 },
  { letter: 'B', point: 3.0, min: 50, max: 59 },
  { letter: 'C', point: 2.0, min: 40, max: 49 },
  { letter: 'D', point: 1.0, min: 33, max: 39 },
  { letter: 'F', point: 0, min: 0, max: 32 },
]

export function marksToGrade(marks) {
  const m = Number(marks)
  if (!Number.isFinite(m) || m < 0 || m > 100) throw new Error('নম্বর ০ থেকে ১০০ এর মধ্যে হতে হবে')
  return BOARD_GRADES.find((g) => m >= g.min && m <= g.max)
}

// NU / university 4.0 scale (common scale used by National University; labelled as such on the page)
export const NU_GRADES = [
  { letter: 'A+', point: 4.0 }, { letter: 'A', point: 3.75 }, { letter: 'A-', point: 3.5 },
  { letter: 'B+', point: 3.25 }, { letter: 'B', point: 3.0 }, { letter: 'B-', point: 2.75 },
  { letter: 'C+', point: 2.5 }, { letter: 'C', point: 2.25 }, { letter: 'D', point: 2.0 },
  { letter: 'F', point: 0 },
]
export function nuPoint(letter) {
  const g = NU_GRADES.find((x) => x.letter === letter)
  if (!g) throw new Error('অবৈধ গ্রেড')
  return g.point
}

// GPA from subject grade points. Optional (4th) subject rule (standard board rule):
// only points above 2.0 count; the excess is added to the total, and the divisor
// excludes the optional subject.
export function gpaFromPoints(points, optionalIndex = -1) {
  const pts = points.map(Number)
  if (!pts.length) throw new Error('কমপক্ষে একটি বিষয় দিন')
  if (pts.some((p) => !Number.isFinite(p) || p < 0 || p > 5)) throw new Error('গ্রেড পয়েন্ট ০ থেকে ৫ এর মধ্যে হতে হবে')
  if (pts.some((p) => p === 0)) return { gpa: 0, grade: 'F', failed: true, total: 0, count: pts.length }
  let total = 0
  let count = 0
  pts.forEach((p, i) => {
    if (i === optionalIndex) { total += Math.max(0, p - 2); return }
    total += p; count += 1
  })
  const gpa = Math.min(5, total / count)
  return { gpa: round2(gpa), grade: gpaToLetter(gpa), failed: false, total: round2(total), count }
}

export function gpaFromMarks(marks, optionalIndex = -1) {
  const grades = marks.map(marksToGrade)
  return { ...gpaFromPoints(grades.map((g) => g.point), optionalIndex), grades: grades.map((g) => g.letter) }
}

export function gpaToLetter(gpa) {
  if (gpa >= 5) return 'A+'
  if (gpa >= 4) return 'A'
  if (gpa >= 3.5) return 'A-'
  if (gpa >= 3) return 'B'
  if (gpa >= 2) return 'C'
  if (gpa >= 1) return 'D'
  return 'F'
}

// Credit-weighted CGPA. courses: [{grade: 'A+'|'A'|..., credit}] or [{point, credit}]
export function cgpaFromCourses(courses) {
  if (!courses.length) throw new Error('কমপক্ষে একটি কোর্স দিন')
  let weighted = 0; let credits = 0
  for (const c of courses) {
    const point = c.point != null ? Number(c.point) : nuPoint(c.grade)
    const credit = Number(c.credit)
    if (!Number.isFinite(point) || point < 0 || point > 4) throw new Error('গ্রেড পয়েন্ট ০ থেকে ৪ এর মধ্যে হতে হবে')
    if (!Number.isFinite(credit) || credit <= 0) throw new Error('ক্রেডিট ০ এর বেশি হতে হবে')
    weighted += point * credit; credits += credit
  }
  return { cgpa: round2(weighted / credits), totalCredits: credits, weighted: round2(weighted) }
}

export function cgpaToPercentage(cgpa, scale = 4) {
  const v = Number(cgpa)
  if (!Number.isFinite(v) || v < 0 || v > scale) throw new Error('সিজিপিএ স্কেলের মধ্যে হতে হবে')
  return round2((v / scale) * 100)
}

export function percentageToCgpa(pct, scale = 4) {
  const v = Number(pct)
  if (!Number.isFinite(v) || v < 0 || v > 100) throw new Error('শতাংশ ০ থেকে ১০০ এর মধ্যে হতে হবে')
  return round2((v / 100) * scale)
}

// Target CGPA: required average grade point in remaining credits to reach target.
export function targetCgpa({ currentCgpa, completedCredits, targetCgpa: target, remainingCredits }) {
  const cur = Number(currentCgpa); const done = Number(completedCredits)
  const tgt = Number(target); const rem = Number(remainingCredits)
  if ([cur, done, tgt, rem].some((x) => !Number.isFinite(x)) || done <= 0 || rem <= 0) throw new Error('সব ঘরে সঠিক সংখ্যা দিন')
  const needed = (tgt * (done + rem) - cur * done) / rem
  return { required: round2(needed), possible: needed <= 4, totalCredits: done + rem }
}

export function round2(n) { return Math.round(n * 100) / 100 }
