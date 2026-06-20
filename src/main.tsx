import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { LanguageProvider } from './context/LanguageContext'
import { ThemeProvider } from './context/ThemeContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LanguageProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </LanguageProvider>
  </React.StrictMode>,
)

// Unregister PWA Service Worker to prevent caching old versions of the site
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    if (registrations.length > 0) {
      for (const registration of registrations) {
        registration.unregister();
      }
      if ('caches' in window) {
        caches.keys().then((keys) => {
          Promise.all(keys.map((key) => caches.delete(key))).then(() => {
            (window as any).location.reload();
          });
        });
      } else {
        (window as any).location.reload();
      }
    }
  });
}
