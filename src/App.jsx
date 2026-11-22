import { BrowserRouter } from 'react-router-dom'
import { ToastProvider } from './components/Toast.jsx'
import AppRoutes from './Routes.jsx'

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ToastProvider>
  )
}
