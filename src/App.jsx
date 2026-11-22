import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import { ToastProvider } from './components/Toast.jsx'
import Home from './pages/Home.jsx'
import CalculatorPage from './pages/CalculatorPage.jsx'
import { AllCalculators, Categories, Favorites, History } from './pages/ListPages.jsx'
import { About, Privacy, Terms, Contact } from './pages/Static.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/calculators" element={<AllCalculators />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/history" element={<History />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/:slug" element={<CalculatorPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  )
}
