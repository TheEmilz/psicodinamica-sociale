import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function ComeFunzionaDetail() {
  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Come Funziona · Psicodinamica Sociale'
    return () => { document.title = 'Psicodinamica Sociale' }
  }, [])

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 50, padding: '20px 40px', background: 'rgba(245,245,245,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(234,88,12,0.1)', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link
          to="/"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#ea580c', textDecoration: 'none' }}
        >
          ← Home
        </Link>
        <span style={{ width: '1px', height: '16px', background: 'rgba(234,88,12,0.2)' }} />
        <span style={{ fontSize: '11px', letterSpacing: '0.1em', color: '#9ca3af', textTransform: 'uppercase' }}>
          Il nostro metodo
        </span>
      </header>

      <main style={{ maxWidth: '680px', margin: '0 auto', padding: '64px 24px 100px' }}>
        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#ea580c', marginBottom: '16px' }}
        >
          Il nostro metodo
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.05 }}
          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '3rem', fontWeight: 500, lineHeight: 1.15, color: '#2f2f2f', marginBottom: '40px' }}
        >
          Come Funziona
        </motion.h1>

        {/* Tre step */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.08 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '48px' }}
        >
          {[
            { num: '01', title: 'Primo colloquio', text: 'Uno spazio libero — non è richiesto sapere già cosa dire.' },
            { num: '02', title: 'Concordiamo insieme', text: 'Frequenza delle sedute stabilita insieme, senza pressioni.' },
            { num: '03', title: 'Inizi il percorso', text: 'Sedute online, 50 minuti · 40€. Disponibilità a tariffa sociale.' },
          ].map(({ num, title, text }) => (
            <div key={num} style={{ padding: '20px 16px', borderRadius: '20px', background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(234,88,12,0.13)' }}>
              <div style={{ fontSize: '28px', fontWeight: 700, color: 'rgba(234,88,12,0.18)', fontFamily: "'Cormorant Garamond', serif", marginBottom: '8px' }}>{num}</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1f2937', marginBottom: '6px' }}>{title}</div>
              <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: 1.5 }}>{text}</div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.12 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
        >
          <p style={{ fontSize: '15px', lineHeight: 1.8, color: '#4b5563' }}>
            Il percorso inizia con un primo colloquio, uno spazio in cui non è richiesto di sapere già cosa dire o come dirlo. È possibile raccontare liberamente la propria storia, il momento che si sta attraversando, ciò che ha spinto a cercare un aiuto professionale. Non esistono domande giuste o sbagliate, né un modo corretto di presentarsi.
          </p>
          <p style={{ fontSize: '15px', lineHeight: 1.8, color: '#4b5563' }}>
            Il primo colloquio ha una funzione duplice. Da un lato, offre alla persona la possibilità di entrare in contatto con uno spazio terapeutico e valutare se sente di potersi fidare di chi ha di fronte. Dall'altro, consente al terapeuta di comprendere la natura del disagio, la storia della persona e le sue risorse, al fine di proporre il percorso più adeguato alle sue esigenze.
          </p>
          <p style={{ fontSize: '15px', lineHeight: 1.8, color: '#4b5563' }}>
            Al termine del colloquio, la persona è libera di scegliere: proseguire il percorso o prendersi del tempo per riflettere. Nessuna scelta è definitiva, e nessuna pressione viene esercitata in alcuna direzione. Qualora si decida di intraprendere un percorso terapeutico, la frequenza delle sedute viene concordata insieme, tenendo conto delle esigenze della persona e degli obiettivi del lavoro.
          </p>

          {/* Price box */}
          <div style={{ padding: '24px 32px', borderRadius: '20px', background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(234,88,12,0.22)', textAlign: 'center', marginTop: '8px' }}>
            <p style={{ fontSize: '28px', fontWeight: 600, color: '#ea580c', fontFamily: "'Cormorant Garamond', serif", margin: 0 }}>
              40€ a seduta · 50 minuti
            </p>
          </div>

          {/* CTA */}
          <div style={{ borderTop: '1px solid rgba(234,88,12,0.15)', paddingTop: '40px', marginTop: '8px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }}>
            <Link
              to="/#prenota"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '16px 32px', borderRadius: '24px', background: '#ea580c', color: '#fff', textDecoration: 'none' }}
            >
              Prenota ora — 40€ a seduta
            </Link>
            <Link to="/" style={{ fontSize: '12px', color: '#9ca3af', textDecoration: 'none' }}>
              ← Torna alla home
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
