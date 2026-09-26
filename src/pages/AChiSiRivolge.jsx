import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function AChiSiRivolge() {
  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'A chi si rivolge · Psicodinamica Sociale'
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
          A chi si rivolge
        </span>
      </header>

      <main style={{ maxWidth: '680px', margin: '0 auto', padding: '64px 24px 100px' }}>
        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#059669', marginBottom: '16px' }}
        >
          A chi si rivolge
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.05 }}
          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '3rem', fontWeight: 500, lineHeight: 1.15, color: '#2f2f2f', marginBottom: '40px' }}
        >
          A chi si Rivolge<br />il Percorso
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
        >
          <p style={{ fontSize: '15px', lineHeight: 1.8, color: '#4b5563' }}>
            Il servizio si rivolge ad adulti e giovani adulti in condizioni di difficoltà economica che stanno attraversando un momento di sofferenza psichica — che si manifesti come ansia, fobie, attacchi di panico, depressione, disturbi alimentari, fatica nelle relazioni, o semplicemente come un senso di vuoto difficile da nominare.
          </p>
          <p style={{ fontSize: '15px', lineHeight: 1.8, color: '#4b5563' }}>
            Accade frequentemente che il malessere non derivi da una vita oggettivamente compromessa, ma dall'impossibilità di elaborare ciò che si vive interiormente: stati affettivi confusi, emozioni intense e difficilmente tollerabili, esperienze che non trovano rappresentazione né parola. Paura, rabbia, dolore, confusione possono essere vissuti come qualcosa di insostenibile, da cui difendersi o allontanarsi. Gli eventi si susseguono senza che sia possibile una profonda comprensione, integrazione o che si possa attribuire loro un significato. In assenza di questa capacità elaborativa, la vita tende a ridursi a una forma di resistenza passiva piuttosto che a un'esistenza agita e sentita come propria.
          </p>
          <p style={{ fontSize: '15px', lineHeight: 1.8, color: '#4b5563' }}>
            La psicoterapia offre uno spazio in cui la persona non si trova sola di fronte alla propria sofferenza. Non si tratta di un luogo in cui si cerca immediatamente di comprendere o risolvere, ma di un contesto in cui è possibile sostare con ciò che esiste, permettere alle emozioni di prendere forma e diventare pensabili, essere rappresentate e non costituire più una minaccia per il proprio benessere psichico.
          </p>
          <p style={{ fontSize: '15px', lineHeight: 1.8, color: '#4b5563' }}>
            Nel corso del lavoro terapeutico, ciò che in precedenza si configurava esclusivamente come peso può trasformarsi in qualcosa di osservabile, verbalizzabile, condivisibile. La psicoterapia contribuisce a restituire alla persona la capacità di pensare, piuttosto che prescrivere contenuti di pensiero, e questa competenza appresa diventa condizione per esperire pienamente la propria esistenza.
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
