import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import CoseDetail from './pages/CoseDetail.jsx'
import ComeFunzionaDetail from './pages/ComeFunzionaDetail.jsx'
import LavoraConNoi from './pages/LavoraConNoi.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
import NoteLegali from './pages/NoteLegali.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/cos-e" element={<CoseDetail />} />
        <Route path="/come-funziona" element={<ComeFunzionaDetail />} />
        <Route path="/lavora-con-noi" element={<LavoraConNoi />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/note-legali" element={<NoteLegali />} />
      </Routes>
    </HashRouter>
  </StrictMode>,
)
