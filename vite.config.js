import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Plugin: in sviluppo Vite usa eval() per l'HMR, bloccato dalla CSP rigida di
// produzione. Qui rilassiamo la CSP SOLO quando si serve in locale, aggiungendo
// 'unsafe-eval' a script-src. Nel build di produzione l'index.html resta invariato
// (CSP rigida senza unsafe-eval).
function devCsp() {
  return {
    name: 'dev-csp-relax',
    apply: 'serve',
    transformIndexHtml(html) {
      return html.replace(
        "script-src 'self' 'unsafe-inline'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      )
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  // Percorsi relativi: gli asset funzionano sia su GitHub Pages in sottocartella
  // (es. utente.github.io/psicodinamica-sociale/) sia su dominio custom alla radice.
  base: './',
  plugins: [react(), tailwindcss(), devCsp()],
  server: {
    host: true, // ascolta su tutte le interfacce (necessario per dev tunnels / rete)
    // Autorizza i domini dei dev tunnels, altrimenti Vite blocca la richiesta
    allowedHosts: ['.devtunnels.ms'],
  },
})
