import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import i18n, { detectInitialLocale, NAMESPACES, i18nReady } from './lib/i18n'
import App from './App'

await i18nReady
const initial = detectInitialLocale()
if (i18n.language !== initial) {
  await i18n.changeLanguage(initial)
}
await i18n.loadNamespaces([...NAMESPACES])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
