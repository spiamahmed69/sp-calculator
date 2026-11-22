import { describe, it, expect } from 'vitest'
import { gpaFromMarks, gpaFromPoints, cgpaFromCourses, cgpaToPercentage, targetCgpa, marksToGrade } from './gpa.js'
import { emi, simpleInterest, compoundInterest, discountCalc, profitLoss } from './finance.js'
import { evaluate, solveQuadratic, matrix2x2 } from './scientific.js'
import { ageCalc, dateDiff, workingDays } from './dates.js'
import { convertUnit } from './units.js'
import { convertLand, bhoriToGram, takaToPoisha } from './land.js'
import { bmi, bmr } from './health.js'
import { triangleArea, circleArea, pythagHypotenuse, average, ratioSimplify } from './geometry.js'

describe('GPA', () => {
  it('marks to grade: 85 = A+ 5.0', () => { expect(marksToGrade(85)).toMatchObject({ letter: 'A+', point: 5 }) })
  it('marks to grade: 32 = F', () => { expect(marksToGrade(32).letter).toBe('F') })
  it('GPA from marks', () => { const r = gpaFromMarks([85, 75, 65]); expect(r.gpa).toBe(4.17); expect(r.failed).toBe(false) })
  it('any F fails the GPA', () => { expect(gpaFromMarks([85, 20]).gpa).toBe(0) })
  it('optional subject rule: only points above 2 count', () => {
    // main: 5,4,4 = 13 ; optional 3.5 -> excess 1.5 ; total 14.5 / 3 = 4.83
    const r = gpaFromPoints([5, 4, 4, 3.5], 3)
    expect(r.gpa).toBe(4.83)
  })
  it('optional subject at 2.0 adds nothing', () => { expect(gpaFromPoints([5, 5, 5, 2], 3).gpa).toBe(5) })
})

describe('CGPA', () => {
  it('credit-weighted', () => {
    const r = cgpaFromCourses([{ grade: 'A+', credit: 3 }, { grade: 'A', credit: 3 }, { grade: 'B', credit: 2 }])
    expect(r.cgpa).toBe(3.66); expect(r.totalCredits).toBe(8)
  })
  it('CGPA to percentage (4 scale)', () => { expect(cgpaToPercentage(3.5)).toBe(87.5) })
  it('target CGPA', () => {
    const r = targetCgpa({ currentCgpa: 3.0, completedCredits: 60, targetCgpa: 3.5, remainingCredits: 60 })
    expect(r.required).toBe(4); expect(r.possible).toBe(true)
  })
})

describe('Finance', () => {
  it('EMI: 100000 @12% for 12 months', () => {
    const r = emi(100000, 12, 12)
    // computed from the standard formula in the test itself
    const m = 0.12 / 12; const expected = Math.round((100000 * m * Math.pow(1 + m, 12)) / (Math.pow(1 + m, 12) - 1) * 100) / 100
    expect(r.emi).toBe(expected)
    expect(r.emi).toBeCloseTo(8885, 0)
    expect(r.totalInterest).toBeCloseTo(6618.55, 0)
  })
  it('simple interest', () => { expect(simpleInterest(10000, 10, 2)).toMatchObject({ interest: 2000, total: 12000 }) })
  it('compound interest', () => { const r = compoundInterest(10000, 10, 2); expect(r.total).toBe(12100) })
  it('discount', () => { expect(discountCalc(1000, 20)).toMatchObject({ discountAmount: 200, finalPrice: 800 }) })
  it('profit', () => { expect(profitLoss(100, 150)).toMatchObject({ isProfit: true, percent: 50 }) })
})

describe('Scientific parser', () => {
  it('operator precedence 2+3*4=14', () => { expect(evaluate('2+3*4')).toBe(14) })
  it('parentheses', () => { expect(evaluate('(2+3)*4')).toBe(20) })
  it('power and sqrt', () => { expect(evaluate('2^3+sqrt(16)')).toBe(12) })
  it('log base 10', () => { expect(evaluate('log(100)')).toBe(2) })
  it('division by zero throws', () => { expect(() => evaluate('1/0')).toThrow() })
  it('invalid input throws, no eval', () => { expect(() => evaluate('alert(1)')).toThrow() })
  it('quadratic x^2-5x+6', () => { const r = solveQuadratic(1, -5, 6); expect(r.x1).toBe(3); expect(r.x2).toBe(2) })
  it('matrix 2x2 multiply', () => {
    const r = matrix2x2('multiply', [[1, 2], [3, 4]], [[2, 0], [1, 2]])
    expect(r.result).toEqual([[4, 4], [10, 8]])
  })
})

describe('Dates', () => {
  it('age exact', () => { const r = ageCalc('2000-01-15', '2026-11-22'); expect(r.years).toBe(26); expect(r.months).toBe(10); expect(r.days).toBe(7) })
  it('date diff', () => { expect(dateDiff('2026-01-01', '2026-01-11').days).toBe(10) })
  it('working days skips Friday', () => {
    // 2026-11-16 Mon .. 2026-11-22 Sun: Fri 20th excluded, Sat included by default? default excludes Sat too
    const r = workingDays('2026-11-16', '2026-11-22')
    expect(r.workingDays).toBe(5)
  })
})

describe('Units & land', () => {
  it('1 km = 1000 m', () => { expect(convertUnit('length', 1, 'কিলোমিটার', 'মিটার')).toBe(1000) })
  it('100C = 212F', () => { expect(convertUnit('temperature', 100, 'সেলসিয়াস', 'ফারেনহাইট')).toBe(212) })
  it('1 acre = 100 shotangsho', () => { expect(convertLand(1, 'একর', 'শতাংশ')).toBe(100) })
  it('1 bigha = 33 shotangsho', () => { expect(convertLand(1, 'বিঘা', 'শতাংশ')).toBe(33) })
  it('1 shotangsho = 435.6 sq ft', () => { expect(convertLand(1, 'শতাংশ', 'বর্গফুট')).toBe(435.6) })
  it('1 bhori = 11.664 g', () => { expect(bhoriToGram(1).gram).toBe(11.664) })
  it('taka to poisha', () => { expect(takaToPoisha(10)).toBe(1000) })
})

describe('Health & geometry', () => {
  it('BMI', () => { const r = bmi(70, 170); expect(r.bmi).toBe(24.22); expect(r.category).toBe('স্বাভাবিক') })
  it('BMR male approx', () => { expect(bmr({ weightKg: 70, heightCm: 170, age: 25, gender: 'male' })).toBe(1643) })
  it('triangle area', () => { expect(triangleArea(10, 5)).toBe(25) })
  it('circle area', () => { expect(circleArea(7)).toBe(153.94) })
  it('pythagoras 3-4-5', () => { expect(pythagHypotenuse(3, 4)).toBe(5) })
  it('average', () => { expect(average([10, 20, 30])).toBe(20) })
  it('ratio simplify', () => { expect(ratioSimplify(6, 9)).toBe('2 : 3') })
})
