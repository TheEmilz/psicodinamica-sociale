import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function CoseDetail() {
  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = "Cos'è la Psicoterapia Psicodinamica · Psicodinamica Sociale"
    return () => { document.title = 'Psicodinamica Sociale' }
  }, [])

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header back link */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, padding: '20px 40px', background: 'rgba(245,245,245,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link
          to="/"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#059669', textDecoration: 'none' }}
        >
          ← Home
        </Link>
        <span style={{ width: '1px', height: '16px', background: 'rgba(16,185,129,0.2)' }} />
        <span style={{ fontSize: '11px', letterSpacing: '0.1em', color: '#9ca3af', textTransform: 'uppercase' }}>
          La psicoterapia psicodinamica
        </span>
      </header>

      <main style={{ maxWidth: '680px', margin: '0 auto', padding: '64px 24px 100px' }}>
        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#059669', marginBottom: '16px' }}
        >
          La psicoterapia psicodinamica
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.05 }}
          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '3rem', fontWeight: 500, lineHeight: 1.15, color: '#2f2f2f', marginBottom: '40px' }}
        >
          Cos'è la Psicoterapia<br />Psicodinamica
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
        >
          <p style={{ fontSize: '15px', lineHeight: 1.8, color: '#4b5563' }}>
            La psicoterapia psicodinamica nasce dal pensiero di Sigmund Freud e si è sviluppata nel corso del Novecento attraverso il contributo di molti clinici e teorici — da Melanie Klein a Donald Winnicott, da Wilfred Bion a Jacques Lacan — che ne hanno ampliato e trasformato i fondamenti.
          </p>
          <p style={{ fontSize: '15px', lineHeight: 1.8, color: '#4b5563' }}>
            Il suo presupposto centrale è che una parte rilevante della nostra vita psichica sia inconscia: desideri, conflitti, emozioni e memorie che non sono direttamente accessibili alla coscienza, ma che orientano profondamente il nostro modo di stare al mondo, di amare, di soffrire.
          </p>
          <p style={{ fontSize: '15px', lineHeight: 1.8, color: '#4b5563' }}>
            La psicoterapia psicodinamica lavora attraverso la parola e la relazione. Non si concentra solo sul sintomo, ma cerca di esplorare il significato che quel sintomo porta con sé. Il disagio non viene eliminato, ma <strong style={{ color: '#2f2f2f' }}>ascoltato, e attraverso quell'ascolto, trasformato</strong>.
          </p>

          {/* CTA */}
          <div style={{ borderTop: '1px solid rgba(16,185,129,0.15)', paddingTop: '40px', marginTop: '8px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }}>
            <Link to="/" style={{ fontSize: '12px', color: '#9ca3af', textDecoration: 'none' }}>
              ← Torna alla home
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
