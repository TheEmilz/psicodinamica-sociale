import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Percorsi relativi: gli asset funzionano sia su GitHub Pages in sottocartella
  // (es. utente.github.io/psicodinamica-sociale/) sia su dominio custom alla radice.
  base: './',
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // ascolta su tutte le interfacce (necessario per dev tunnels / rete)
    // Autorizza i domini dei dev tunnels, altrimenti Vite blocca la richiesta
    allowedHosts: ['.devtunnels.ms'],
    proxy: {
      // In sviluppo inoltra le chiamate /api al server PHP locale (php -S :8000)
      '/api': 'http://localhost:8000',
    },
  },
})
