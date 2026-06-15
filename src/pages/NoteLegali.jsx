import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function NoteLegali() {
  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Note Legali · Psicodinamica Sociale'
    return () => { document.title = 'Psicodinamica Sociale' }
  }, [])

  const h2 = {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.6rem',
    fontWeight: 500,
    color: '#2f2f2f',
    margin: '36px 0 12px',
  }
  const p = { fontSize: '15px', lineHeight: 1.8, color: '#4b5563', margin: '0 0 12px' }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header back link */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, padding: '20px 40px', background: 'rgba(245,245,245,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(91,77,224,0.1)', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link
          to="/"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#5b4de0', textDecoration: 'none' }}
        >
          ← Home
        </Link>
        <span style={{ width: '1px', height: '16px', background: 'rgba(91,77,224,0.2)' }} />
        <span style={{ fontSize: '11px', letterSpacing: '0.1em', color: '#9ca3af', textTransform: 'uppercase' }}>
          Note Legali
        </span>
      </header>

      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '64px 24px 100px' }}>
        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#5b4de0', marginBottom: '16px' }}
        >
          Informazioni legali
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.05 }}
          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.8rem', fontWeight: 500, lineHeight: 1.15, color: '#2f2f2f', marginBottom: '40px' }}
        >
          Note Legali
        </motion.h1>

        <motion.section
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 style={h2}>Natura del rapporto professionale</h2>
          <p style={p}>
            Ogni professionista opera in autonomia clinica e fiscale. Il rapporto terapeutico è
            diretto tra paziente e singolo terapeuta. Non esiste un centro clinico né una
            segreteria comune: questo sito ha funzione esclusivamente informativa e di presentazione
            dei professionisti che vi aderiscono.
          </p>

          <h2 style={h2}>Regime fiscale</h2>
          <p style={p}>
            Le prestazioni sanitarie rese sono esenti IVA ai sensi dell&apos;art. 10, n. 18, del
            D.P.R. 633/1972. Ogni terapeuta emette autonomamente la propria documentazione fiscale.
          </p>

          <h2 style={h2}>Trattamento dei dati personali</h2>
          <p style={p}>
            I dati personali sono trattati da ciascun terapeuta in qualità di titolare autonomo del
            trattamento, nel rispetto del Regolamento (UE) 2016/679 (GDPR). Per maggiori dettagli è
            possibile consultare l&apos;<Link to="/privacy" style={{ color: '#5b4de0', textDecoration: 'underline' }}>Informativa sulla Privacy</Link>.
          </p>
        </motion.section>
      </main>
    </div>
  )
}
