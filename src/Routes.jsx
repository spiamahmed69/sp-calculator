import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import CalculatorPage from './pages/CalculatorPage.jsx'
import { AllCalculators, Categories, Favorites, History } from './pages/ListPages.jsx'
import { About, Privacy, Terms, Contact } from './pages/Static.jsx'
import NotFound from './pages/NotFound.jsx'

// The route tree, shared by the browser entry (main.jsx, inside BrowserRouter)
// and the prerender entry (entry-server.jsx, inside StaticRouter).
export default function AppRoutes() {
  return (
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
  )
}
