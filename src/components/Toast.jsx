import { createContext, useCallback, useContext, useState } from 'react'

const ToastCtx = createContext(() => {})
export function useToast() { return useContext(ToastCtx) }

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const push = useCallback((msg) => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, msg }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000)
  }, [])
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 space-y-2" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className="grad rounded-full px-5 py-3 text-sm font-semibold text-white shadow-xl">{t.msg}</div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}
