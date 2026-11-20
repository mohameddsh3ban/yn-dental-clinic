import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { MotionConfig } from 'framer-motion'
import './index.css'
import App from './App.tsx'
import { I18nProvider } from '@/lib/I18nProvider'
import { loadBundle } from '@/lib/copy/bundle'
import { langOf } from '@/lib/paths'
import { HYDRATE } from '@/lib/prerendered'

const container = document.getElementById('root')!

const app = (
  <StrictMode>
    {/* The router is outermost: the language is read from the URL. */}
    <BrowserRouter>
      <I18nProvider>
        {/* Honour the OS "reduce motion" setting for every framer animation at
            once: transforms and layout moves are skipped, opacity still fades. */}
        <MotionConfig reducedMotion="user">
          <App />
        </MotionConfig>
      </I18nProvider>
    </BrowserRouter>
  </StrictMode>
)

// The copy for this URL's language is a chunk of its own, preloaded from the
// document head. Wait for it, then take over the pre-rendered page in place
// (hydrate) instead of throwing it away and drawing it again.
void loadBundle(langOf(window.location.pathname)).then(() => {
  if (HYDRATE) hydrateRoot(container, app)
  else createRoot(container).render(app)
})
