import { useParams } from 'react-router-dom'
import CalculatorShell from '../components/CalculatorShell.jsx'
import { ScientificPage, BasicPage, EmiPage, AgePage, UnitPage, LandPage, MatrixPage, EquationPage } from '../components/SpecialCalculators.jsx'
import { getCalculator } from '../data/calculators.js'
import NotFound from './NotFound.jsx'

export default function CalculatorPage() {
  const { slug } = useParams()
  const calc = getCalculator(slug)
  if (!calc) return <NotFound />
  switch (calc.kind) {
    case 'scientific': return <ScientificPage calc={calc} />
    case 'basic': return <BasicPage calc={calc} />
    case 'emi': return <EmiPage calc={calc} />
    case 'age': return <AgePage calc={calc} />
    case 'unit': return <UnitPage calc={calc} />
    case 'land': return <LandPage calc={calc} />
    case 'matrix': return <MatrixPage calc={calc} />
    case 'equation': return <EquationPage calc={calc} />
    default: return <CalculatorShell calc={calc} />
  }
}
