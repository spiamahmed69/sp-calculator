// Server entry used ONLY by scripts/prerender.mjs (never shipped to the browser).
// Renders one route to static HTML with react-dom/server + StaticRouter.
// Uses renderToStaticMarkup (no hydration): the browser entry (main.jsx) mounts
// with createRoot, which replaces the prerendered markup on load.
import { renderToStaticMarkup } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { ToastProvider } from './components/Toast.jsx'
import AppRoutes from './Routes.jsx'

export function render(url) {
  return renderToStaticMarkup(
    <ToastProvider>
      <StaticRouter location={url}>
        <AppRoutes />
      </StaticRouter>
    </ToastProvider>,
  )
}
